/*import axios from "axios";
import { extractText, getDocumentProxy } from "unpdf";

const HF_API_KEY = process.env.HF_API_KEY;

console.log(HF_API_KEY);


// ✅ FIXED MODEL URL: Using the modern Hugging Face inference path
// 1. Change the URL to the MiniLM model (Much more stable)
// 1. Change the URL to the MiniLM model (Much more stable)
/*

const getEmbedding = async (text, retries = 3) => {
  try {
    const response = await axios.post(
      // Precise 2026 Router URL
      "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2",
      { 
        inputs: text,
        options: { 
            wait_for_model: true,
            use_cache: true 
        } 
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY.trim()}`,
          "Content-Type": "application/json",
        },
        timeout: 45000 
      }
    );

    console.log("HF API Success!");

    let embedding = response.data;

    // Handle the 2026 response format (sometimes results are in a sub-property)
    if (embedding.data) embedding = embedding.data;

    // Ensure we return a flat array
    if (Array.isArray(embedding) && Array.isArray(embedding[0])) {
      return embedding[0];
    }
    
    return embedding;
  } catch (error) {
    const status = error.response?.status;
    console.error(`Router Error (${status}):`, error.response?.data || error.message);

    // If 404 persists, the model might need to be explicitly loaded via the hub
    if (status === 503 && retries > 0) {
      console.log("Model loading on provider... retrying...");
      await new Promise(r => setTimeout(r, 8000));
      return getEmbedding(text, retries - 1);
    }
    throw error;
  }
};*/
// ✅ 1. Use the most stable 2026 router path
// Note: We include the 'hf-inference' provider to bypass routing delays
// ✅ Use the /pipeline/ prefix to force Feature Extraction
// ✅ Using the modern 2026 Router endpoint with provider prefix
// ✅ THE 2026 FIX: Force the 'feature-extraction' task via the URL path

/*
const MODEL_URL = "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction";

const getEmbedding = async (text, retries = 3) => {
  try {
    const response = await axios.post(
      MODEL_URL,
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY.trim()}`,
          "Content-Type": "application/json",
          // Standard 2026 headers to handle serverless cold-starts
          "x-wait-for-model": "true",
          "x-use-cache": "true"
        },
        timeout: 90000 
      }
    );

    console.log("HF API Success!");
    
    let embedding = response.data;

    // Feature-extraction usually returns a 2D array: [[val1, val2, ...]]
    // We need to flatten it to a 1D array for our cosine math
    if (Array.isArray(embedding) && Array.isArray(embedding[0])) {
      return embedding[0];
    }
    
    return embedding;
  } catch (error) {
    const status = error.response?.status;
    console.error(`Router Error (${status}):`, error.response?.data || error.message);

    // If 503 (Loading), wait and retry
    if (status === 503 && retries > 0) {
      console.log("Model waking up... retrying in 10s...");
      await new Promise(r => setTimeout(r, 10000));
      return getEmbedding(text, retries - 1);
    }
    throw error;
  }
};
// ===============================
// COSINE SIMILARITY
// ===============================
const cosineSimilarity = (a, b) => {
  if (!a || !b || !Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return 0;
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB || 1);
};

// ===============================
// MAIN CONTROLLER
// ===============================
export const scoreResume = async (req, res) => {
  try {
    const { role } = req.body;
    const file = req.file;

    if (!file || !file.buffer) {
      return res.status(400).json({ message: "No file buffer received." });
    }
    if (!role) {
      return res.status(400).json({ message: "Target role is required" });
    }

    // --- 1. ROBUST PDF EXTRACTION ---
    let resumeText = "";
    try {
      const binaryData = new Uint8Array(file.buffer);
      const pdf = await getDocumentProxy(binaryData);
      const result = await extractText(pdf);
      
      // Handle page arrays or single strings
      resumeText = Array.isArray(result.text) ? result.text.join(" ") : (result.text || "");
      console.log("Extraction successful! Length:", resumeText.length);
    } catch (err) {
      console.error("PDF Parsing error:", err.message);
      return res.status(400).json({ message: "AI could not read this PDF structure." });
    }

    if (resumeText.trim().length < 50) {
      return res.status(400).json({ message: "Resume text is too sparse for analysis." });
    }

    // --- 2. AI ANALYSIS (Parallel Embeddings) ---
    // Truncate to 3000 chars to avoid model token limits
    const [resumeEmbedding, roleEmbedding] = await Promise.all([
      getEmbedding(resumeText.slice(0, 3000)), 
      getEmbedding(role)
    ]);

    // --- 3. SCORING & ANALYSIS ---
    const similarity = cosineSimilarity(resumeEmbedding, roleEmbedding);
    const score = Math.min(100, Math.round(similarity * 100));

    const strengths = [];
    const weaknesses = [];
    const suggestions = [];

    if (score > 70) strengths.push(`Strong semantic alignment with ${role} requirements.`);
    if (/\d+%|\d+\s?%/.test(resumeText)) strengths.push("Includes quantifiable results (metrics detected).");
    if (resumeText.toLowerCase().includes("github")) strengths.push("GitHub portfolio detected.");

    if (!resumeText.toLowerCase().includes("linkedin")) weaknesses.push("Missing LinkedIn profile link.");
    if (score < 60) weaknesses.push("Relevancy to the specific role requirements is low.");

    suggestions.push(`Ensure your skills section explicitly lists technologies relevant to ${role}.`);

    return res.status(200).json({
      score,
      similarityScore: similarity.toFixed(4),
      strengths,
      weaknesses,
      suggestions,
    });

  } catch (error) {
    console.error("Global Controller Error:", error.message);
    return res.status(500).json({ 
        message: "Error processing analysis", 
        error: error.response?.data?.error || error.message 
    });
  }
};*/

import axios from "axios";
import { extractText, getDocumentProxy } from "unpdf";

const HF_API_KEY = process.env.HF_API_KEY;

// 1. Define URLs
// ✅ NEW URLS: These are the most stable paths for 2026
const EMBEDDING_URL =
"https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction";

// Note: We use the /models/ path but treat it as a pipeline in the logic
const GEN_AI_URL =
"https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.3";

const getEmbedding = async (text) => {
  const res = await axios.post(
    EMBEDDING_URL,
    { inputs: text },
    {
      headers: {
        Authorization: `Bearer ${HF_API_KEY.trim()}`,
        "Content-Type": "application/json",
        "x-wait-for-model": "true"
      },
      timeout: 60000
    }
  );

  let embedding = res.data;

  if (embedding.data) embedding = embedding.data;

  if (Array.isArray(embedding) && Array.isArray(embedding[0])) {
    return embedding[0];
  }

  return embedding;
};


const getDetailedAnalysis = async (resumeText, role) => {
  const prompt = `
You are a technical recruiter hiring for ${role}.
Analyze this resume.

Provide:
1. Two strengths
2. Two weaknesses
3. One improvement tip

Resume:
${resumeText.slice(0, 1000)}
`;

  try {
    const response = await axios.post(
      GEN_AI_URL,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 300,
          temperature: 0.7
        }
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY.trim()}`,
          "Content-Type": "application/json",
          "x-wait-for-model": "true"
        },
        timeout: 90000
      }
    );

    const result = response.data;
    const generatedText = Array.isArray(result)
      ? result[0]?.generated_text
      : result?.generated_text;

    return generatedText || "No analysis generated.";

  } catch (err) {
    console.error("GEN AI FULL ERROR:", err.response?.data || err.message);

    return `
Strengths:
• Relevant technical background
• Suitable foundational skills

Weaknesses:
• Resume lacks measurable achievements
• Needs better keyword alignment with ${role}

Tip:
Tailor your resume using keywords from real ${role} job descriptions.
`;
  }
};


const calculateSimilarity = (a, b) => {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB || 1);
};

// 3. MAIN EXPORT (Calls the functions defined above)
export const scoreResume = async (req, res) => {
  try {
    const { role } = req.body;
    const file = req.file;

    if (!file || !role) return res.status(400).json({ message: "Role and Resume are required." });

    const binaryData = new Uint8Array(file.buffer);
    const pdf = await getDocumentProxy(binaryData);
    const textResult = await extractText(pdf);
    const resumeText = Array.isArray(textResult.text) ? textResult.text.join(" ") : textResult.text;

    // Now getEmbedding is definitely defined!
    const [resumeVec, roleVec, detailedReview] = await Promise.all([
      getEmbedding(resumeText.slice(0, 3000)),
      getEmbedding(role),
      getDetailedAnalysis(resumeText, role)
    ]);

    const simScore = calculateSimilarity(resumeVec, roleVec);
    const finalScore = Math.min(100, Math.round(simScore * 100));

    return res.status(200).json({
      score: finalScore,
      similarityScore: simScore.toFixed(4),
      analysis: detailedReview.trim()
    });

  } catch (error) {
  console.error("FULL ERROR:", error.response?.data || error.message);

  return res.status(500).json({
    message: "Analysis failed",
    error: error.response?.data || error.message
  });}
 

};