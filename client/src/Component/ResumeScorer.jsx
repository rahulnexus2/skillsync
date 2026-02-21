{/*
import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import {
  UploadCloud,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Loader,
} from "lucide-react";

const ResumeScorer = () => {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // ===============================
  // DRAG HANDLERS
  // ===============================
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // ===============================
  // SUBMIT
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !role) {
      alert("Please upload resume and enter target role");
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("role", role);
    formData.append("resume", file);

    try {
      const token = localStorage.getItem("token");

      const res = await axiosInstance.post(
        "/resume/analyze",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResult(res.data);
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
      alert(
        err.response?.data?.message || "Failed to analyze resume"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">

      
      <div className="text-center">
        <h1 className="text-4xl font-bold text-indigo-600">
          AI Resume Analyzer
        </h1>
        <p className="text-slate-600 mt-2">
          Upload your resume and get AI-powered feedback instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        
        <div className="bg-white p-6 rounded-2xl shadow-lg border">
          <form onSubmit={handleSubmit} className="space-y-6">

            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                dragActive
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-slate-300 hover:border-indigo-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="resume-upload"
                className="hidden"
                onChange={handleChange}
                accept=".pdf"
              />
              <label
                htmlFor="resume-upload"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <UploadCloud className="w-12 h-12 text-slate-400" />
                <span className="font-medium text-slate-700">
                  {file ? file.name : "Drag & drop or click to upload"}
                </span>
                <span className="text-xs text-slate-400">
                  PDF Only (Max 5MB)
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Target Job Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Frontend Developer"
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={!file || !role || loading}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <Loader className="animate-spin w-5 h-5" />
                  <span>Analyzing...</span>
                </span>
              ) : (
                "Analyze Resume"
              )}
            </button>
          </form>
        </div>

       
        <div>

          {loading && (
            <div className="text-center text-indigo-600 font-medium">
              AI is analyzing your resume...
            </div>
          )}

          {result && (
            <div className="space-y-6">

              
              <div className="bg-white p-6 rounded-2xl shadow border">
                <h3 className="text-lg font-semibold mb-2">
                  ATS Score
                </h3>

                <div className="text-4xl font-bold text-indigo-600">
                  {result.score}/100
                </div>

                <div className="text-sm text-slate-500 mt-1">
                  Similarity: {result.similarityScore}
                </div>
              </div>

             
              {result.strengths?.length > 0 && (
                <div>
                  <h4 className="flex items-center space-x-2 font-bold text-green-600 mb-2">
                    <CheckCircle size={18} />
                    <span>Strengths</span>
                  </h4>
                  {result.strengths.map((s, i) => (
                    <p key={i} className="text-sm text-slate-600">
                      • {s}
                    </p>
                  ))}
                </div>
              )}

             
              {result.weaknesses?.length > 0 && (
                <div>
                  <h4 className="flex items-center space-x-2 font-bold text-red-500 mb-2">
                    <AlertTriangle size={18} />
                    <span>Weaknesses</span>
                  </h4>
                  {result.weaknesses.map((w, i) => (
                    <p key={i} className="text-sm text-slate-600">
                      • {w}
                    </p>
                  ))}
                </div>
              )}

              
              {result.suggestions?.length > 0 && (
                <div>
                  <h4 className="flex items-center space-x-2 font-bold text-blue-500 mb-2">
                    <Lightbulb size={18} />
                    <span>Suggestions</span>
                  </h4>
                  {result.suggestions.map((s, i) => (
                    <p key={i} className="text-sm text-slate-600">
                      • {s}
                    </p>
                  ))}
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeScorer; */}
import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import {
  UploadCloud,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Loader,
  FileText,
  Target
} from "lucide-react";

const ResumeScorer = () => {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // ===============================
  // HANDLERS
  // ===============================
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !role) {
      alert("Please upload resume and enter target role");
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("role", role);
    formData.append("resume", file);

    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.post("/resume/analyze", formData, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 120000, // 2-minute timeout for AI generation
      });
      setResult(res.data);
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Analysis failed. The AI might be warming up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-10">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
          AI Resume Intelligence
        </h1>
        <p className="text-slate-500 text-lg">
          Professional ATS simulation and role-specific gap analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        
        {/* LEFT: Upload Form (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Drag & Drop */}
              <div
                className={`group relative border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
                  dragActive ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:border-indigo-300"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="resume-upload"
                  className="hidden"
                  onChange={handleChange}
                  accept=".pdf"
                />
                <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
                  <div className="p-4 bg-indigo-50 rounded-full mb-4 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-8 h-8 text-indigo-600" />
                  </div>
                  <span className="text-slate-700 font-semibold">
                    {file ? file.name : "Upload Resume (PDF)"}
                  </span>
                  <span className="text-xs text-slate-400 mt-2">Max file size: 5MB</span>
                </label>
              </div>

              {/* Role Input */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
                  <Target size={16} className="text-indigo-500" />
                  <span>Target Professional Role</span>
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g., Full Stack Engineer"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                />
              </div>

              <button
                type="submit"
                disabled={!file || !role || loading}
                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition disabled:opacity-50"
              >
                {loading ? "Analyzing Context..." : "Start AI Analysis"}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT: Results Display (3 Columns) */}
        <div className="lg:col-span-3">
          {!result && !loading && (
            <div className="h-full border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center p-12 text-slate-300">
              <FileText size={64} strokeWidth={1} />
              <p className="mt-4 font-medium">Results will appear here after analysis</p>
            </div>
          )}

          {loading && (
            <div className="bg-white p-12 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <Loader className="animate-spin w-16 h-16 text-indigo-600" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-ping" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-slate-800">Reading your Resume...</p>
                <p className="text-slate-500 text-sm mt-1">This takes ~20s for the AI to "think"</p>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
              
              {/* Score Bar */}
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <h3 className="text-slate-500 font-semibold uppercase tracking-wider text-xs">ATS Compatibility</h3>
                    <div className="text-6xl font-black text-slate-800">{result.score}%</div>
                  </div>
                  <div className="text-right">
                     <span className={`px-3 py-1 rounded-full text-xs font-bold ${result.score > 70 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {result.score > 70 ? 'Strong Match' : 'Optimization Required'}
                     </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-4 rounded-full">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-1000"
                    style={{ width: `${result.score}%` }}
                  />
                </div>
              </div>

              {/* Detailed AI Review */}
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-violet-50 rounded-lg text-violet-600">
                    <CheckCircle size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">Recruiter's Feedback</h3>
                </div>
                
                {/* AI Analysis Content */}
                <div className="prose prose-slate max-w-none">
                  <div className="text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">
                    {result.analysis}
                  </div>
                </div>
              </div>

              {/* Suggestions Footer */}
              <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl flex items-start space-x-4">
                <Lightbulb className="text-indigo-500 shrink-0 mt-1" />
                <div>
                    <p className="font-bold text-indigo-900 mb-1">AI Recommendation</p>
                    <p className="text-sm text-indigo-700">
                        The analysis above is strictly optimized for the <strong>{role}</strong> profile. 
                        Try uploading again with modified keywords to see how the score reacts.
                    </p>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeScorer;
