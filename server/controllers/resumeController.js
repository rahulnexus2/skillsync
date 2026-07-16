import axios from "axios";
import { extractText, getDocumentProxy } from "unpdf";
import { logger } from "../utils/logger.js";

const HF_API_KEY = process.env.HF_API_KEY;

const GEN_AI_URL = "https://router.huggingface.co/v1/chat/completions";
const GEN_AI_MODEL =  "Qwen/Qwen2.5-7B-Instruct";

// ===============================
// AI ANALYSIS
// ===============================
const getDetailedAnalysis = async (resumeText, role) => {
  try {
    const truncatedResume = resumeText.slice(0, 4000);
    const wasTruncated = resumeText.length > 4000;

    const response = await axios.post(
      GEN_AI_URL,
      {
        model: GEN_AI_MODEL,
        messages: [
          {
            role: "system",
            content: `You are a senior technical recruiter with 15+ years of experience screening resumes for technical and non-technical roles, including internships and entry-level positions.

Critical calibration rule: judge candidates against what is REALISTIC and EXPECTED for the seniority level implied by the role title (e.g. "Intern", "Junior", "Entry-level", "Senior", "Lead"). Do not penalize an intern or entry-level candidate for lacking advanced/optional skills (e.g. state management libraries, testing frameworks, system design, CI/CD) unless the role explicitly requires them. For entry-level and intern roles, strong personal/academic projects with relevant tech stacks should be weighted heavily and can justify scores of 70+ on their own — real-world job experience is not expected.

Rules:
- Every strength and weakness must reference something concrete from the resume — never a vague statement that could apply to any resume.
- Do NOT claim a skill is "missing" or "not mentioned" if it is a standard, implied part of a stack the candidate explicitly says they used (e.g. if the resume says "MERN stack," do not list MongoDB or Node.js as missing — only flag genuinely absent skills).
- Do not invent details that aren't in the resume text.
- Be fair, not harsh: distinguish between "this is a genuine gap for this seniority level" and "this is a nice-to-have the candidate hasn't needed yet."
- Respond ONLY with a single valid JSON object. No markdown, no code fences, no commentary before or after.`,
          },
          {
            role: "user",
            content: `Analyze this resume for the role of "${role}".

Scoring rubric for fitScore (0-100) — calibrated to the seniority level of "${role}":
- 0-30: Missing core, non-negotiable skills for this specific level (e.g. an intern with no relevant projects or coursework at all)
- 31-50: Has some relevant exposure but real gaps in the fundamentals expected even at this level
- 51-70: Meets the baseline expectations for this level; has relevant projects/experience with a couple of areas to grow
- 71-85: Strong candidate for this level — clear relevant experience/projects, good grasp of the core stack, minor polish needed
- 86-100: Exceptional for this level — goes beyond what's typically expected

Return ONLY this exact JSON structure:
{
  "overallVerdict": "1-2 sentence honest summary of fit for this specific role and level",
  "strengths": ["specific strength tied to resume content", "...", "..."],
  "weaknesses": ["specific, genuine gap appropriate to this seniority level", "..."],
  "suggestions": ["concrete, actionable improvement", "...", "..."],
  "missingKeywords": ["keyword genuinely absent and realistically expected at this level", "..."],
  "experienceLevel": "Entry" | "Mid" | "Senior",
  "fitScore": <integer 0-100 per rubric above>
}

Requirements:
- strengths: exactly 3 items, each referencing specific resume content
- weaknesses: exactly 2-3 items — only genuine gaps for this seniority level, not advanced/optional skills
- suggestions: exactly 3 items, concrete enough that the candidate could act on them today
- missingKeywords: 3-5 keywords that are both absent from the resume AND realistically expected at this seniority level
- Base every judgment strictly on the resume text below${wasTruncated ? " (note: resume was truncated to the first 4000 characters)" : ""}

Resume:
${truncatedResume}`,
          },
        ],
        max_tokens: 700,
        temperature: 0.2,
        stream: false,
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY.trim()}`,
          "Content-Type": "application/json",
        },
        timeout: 90000,
      }
    );

    const generatedText = response.data.choices?.[0]?.message?.content;
    if (!generatedText) throw new Error("No generated text");

    const cleaned = generatedText.replace(/```json|```/g, "").trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");

    const parsed = JSON.parse(jsonMatch[0]);

    if (
      typeof parsed.fitScore !== "number" ||
      !Array.isArray(parsed.strengths) ||
      !Array.isArray(parsed.weaknesses)
    ) {
      throw new Error("Malformed AI response shape");
    }

    return parsed;
  } catch (err) {
    logger.error("AI analysis error:", err.message);
    console.log("Status:", err.response?.status);
    console.log("Response:", err.response?.data);

    return {
      overallVerdict: `Candidate shows potential for the ${role} role but resume needs optimization.`,
      strengths: [
        "Demonstrates foundational technical knowledge relevant to the role",
        "Resume structure is readable and organized",
        "Shows initiative through project or experience listings",
      ],
      weaknesses: [
        "Resume lacks quantifiable achievements and impact metrics",
        `Missing key industry keywords expected for a ${role} position`,
      ],
      suggestions: [
        `Add measurable results to each experience (e.g., "Improved performance by 30%")`,
        `Include role-specific keywords from ${role} job descriptions to pass ATS filters`,
        "Add a concise professional summary at the top tailored to this role",
      ],
      missingKeywords: ["metrics", "leadership", "agile", "collaboration"],
      experienceLevel: "Entry",
      fitScore: 45,
    };
  }
};

// ===============================
// MAIN EXPORT
// ===============================
export const scoreResume = async (req, res) => {
  try {
    const { role } = req.body;
    const file = req.file;

    if (!file || !role) {
      return res.status(400).json({ message: "Role and Resume are required." });
    }

    const binaryData = new Uint8Array(file.buffer);
    const pdf = await getDocumentProxy(binaryData);
    const textResult = await extractText(pdf);
    const resumeText = Array.isArray(textResult.text)
      ? textResult.text.join(" ")
      : textResult.text;

    const aiAnalysis = await getDetailedAnalysis(resumeText, role);
    const finalScore = Math.min(100, aiAnalysis.fitScore || 60);

    return res.status(200).json({
      score: finalScore,
      overallVerdict: aiAnalysis.overallVerdict,
      strengths: aiAnalysis.strengths,
      weaknesses: aiAnalysis.weaknesses,
      suggestions: aiAnalysis.suggestions,
      missingKeywords: aiAnalysis.missingKeywords,
      experienceLevel: aiAnalysis.experienceLevel,
    });

  } catch (error) {
    logger.error("scoreResume error:", error.response?.data || error.message);
    return res.status(500).json({
      message: "Analysis failed",
    });
  }
};


















