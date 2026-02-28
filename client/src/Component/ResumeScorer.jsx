import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import {
  UploadCloud, CheckCircle, AlertTriangle,
  Lightbulb, Loader, FileText, Target,
  TrendingUp, User, Tag, Zap
} from "lucide-react";

const ResumeScorer = () => {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  };

  const handleChange = (e) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !role) return alert("Please upload a resume and enter a target role");

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("role", role);
    formData.append("resume", file);

    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.post("/resume/analyze", formData, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 120000,
      });
      setResult(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return "text-green-600";
    if (score >= 50) return "text-amber-500";
    return "text-red-500";
  };

  const getScoreGradient = (score) => {
    if (score >= 75) return "from-green-500 to-emerald-400";
    if (score >= 50) return "from-amber-500 to-yellow-400";
    return "from-red-500 to-rose-400";
  };

  const getScoreLabel = (score) => {
    if (score >= 75) return { text: "Strong Match", bg: "bg-green-100 text-green-700" };
    if (score >= 50) return { text: "Moderate Match", bg: "bg-amber-100 text-amber-700" };
    return { text: "Needs Improvement", bg: "bg-red-100 text-red-700" };
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
          AI Resume Analyzer
        </h1>
        <p className="text-slate-500">
          Upload your resume and get professional ATS feedback tailored to your target role.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

        {/* Upload Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Drag & Drop */}
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                  dragActive ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:border-indigo-300"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input type="file" id="resume-upload" className="hidden" onChange={handleChange} accept=".pdf" />
                <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center gap-3">
                  <div className="p-3 bg-indigo-50 rounded-full">
                    <UploadCloud className="w-7 h-7 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700 text-sm">
                      {file ? file.name : "Drag & drop or click to upload"}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">PDF only · Max 5MB</p>
                  </div>
                </label>
              </div>

              {/* Role Input */}
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Target size={15} className="text-indigo-500" />
                  Target Role
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Full Stack Developer"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={!file || !role || loading}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader className="animate-spin w-4 h-4" /> Analyzing...
                  </span>
                ) : "Analyze Resume"}
              </button>
            </form>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-5">

          {/* Empty State */}
          {!result && !loading && (
            <div className="h-80 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-300">
              <FileText size={56} strokeWidth={1} />
              <p className="mt-3 font-medium text-sm">Results will appear here</p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="bg-white p-12 rounded-2xl shadow-lg border flex flex-col items-center gap-4">
              <Loader className="animate-spin w-12 h-12 text-indigo-600" />
              <div className="text-center">
                <p className="font-bold text-slate-800">Analyzing your resume...</p>
                <p className="text-slate-400 text-sm mt-1">This may take up to 30 seconds</p>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-5">

              {/* Score Card */}
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">ATS Score</p>
                    <p className={`text-6xl font-black ${getScoreColor(result.score)}`}>
                      {result.score}<span className="text-2xl">%</span>
                    </p>
                  </div>
                  <div className="text-right space-y-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getScoreLabel(result.score).bg}`}>
                      {getScoreLabel(result.score).text}
                    </span>
                    {result.experienceLevel && (
                      <div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 flex items-center gap-1 justify-end">
                          <User size={11} /> {result.experienceLevel} Level
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${getScoreGradient(result.score)} transition-all duration-1000`}
                    style={{ width: `${result.score}%` }}
                  />
                </div>

                {/* Overall Verdict */}
                {result.overallVerdict && (
                  <p className="mt-4 text-sm text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-100 italic">
                    "{result.overallVerdict}"
                  </p>
                )}
              </div>

              {/* Strengths */}
              {result.strengths?.length > 0 && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h4 className="flex items-center gap-2 font-bold text-green-700 mb-4">
                    <CheckCircle size={18} /> Strengths
                  </h4>
                  <ul className="space-y-2">
                    {result.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="mt-1 w-2 h-2 bg-green-400 rounded-full shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Weaknesses */}
              {result.weaknesses?.length > 0 && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h4 className="flex items-center gap-2 font-bold text-red-600 mb-4">
                    <AlertTriangle size={18} /> Areas to Improve
                  </h4>
                  <ul className="space-y-2">
                    {result.weaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="mt-1 w-2 h-2 bg-red-400 rounded-full shrink-0" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggestions */}
              {result.suggestions?.length > 0 && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h4 className="flex items-center gap-2 font-bold text-indigo-700 mb-4">
                    <Lightbulb size={18} /> Actionable Suggestions
                  </h4>
                  <ul className="space-y-2">
                    {result.suggestions.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <Zap size={14} className="text-indigo-400 mt-0.5 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Missing Keywords */}
              {result.missingKeywords?.length > 0 && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h4 className="flex items-center gap-2 font-bold text-amber-700 mb-4">
                    <Tag size={18} /> Missing Keywords
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.missingKeywords.map((kw, i) => (
                      <span key={i} className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-medium">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeScorer;