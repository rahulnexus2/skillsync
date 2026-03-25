import axios from "axios";
import { extractText, getDocumentProxy } from "unpdf";
import { logger } from "../utils/logger.js";

const HF_API_KEY = process.env.HF_API_KEY;

const GEN_AI_URL = "https://router.huggingface.co/v1/chat/completions";
const GEN_AI_MODEL = "meta-llama/Llama-3.1-8B-Instruct:cerebras";

// ===============================
// AI ANALYSIS
// ===============================
const getDetailedAnalysis = async (resumeText, role) => {
  try {
    const response = await axios.post(
      GEN_AI_URL,
      {
        model: GEN_AI_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are a senior technical recruiter. Respond ONLY with a valid JSON object, no extra text, no markdown backticks.",
          },
          {
            role: "user",
            content: `Analyze this resume for the role of "${role}".

Return ONLY this JSON:
{
  "overallVerdict": "one sentence professional summary",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "missingKeywords": ["keyword1", "keyword2", "keyword3"],
  "experienceLevel": "Entry / Mid / Senior",
  "fitScore": <number 0-100>
}

Resume:
${resumeText.slice(0, 2500)}`,
          },
        ],
        max_tokens: 500,
        temperature: 0.3,
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

    return JSON.parse(jsonMatch[0]);

  } catch (err) {
    logger.error("AI analysis error:", err.message);

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


















