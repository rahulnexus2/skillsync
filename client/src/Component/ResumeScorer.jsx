import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "sonner";
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
    if (!file || !role) {
      toast.error("Add a PDF and target role.");
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("role", role);
    formData.append("resume", file);

    try {
      const res = await axiosInstance.post("/resume/analyze", formData, {
        timeout: 120000,
      });
      setResult(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Analysis failed. Try again.");
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
    <div className="mx-auto max-w-6xl space-y-8 p-1 md:p-2">
      <div className="space-y-1 border-b border-border pb-6 text-center md:text-left">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Resume analyzer
        </h1>
        <p className="max-w-xl text-sm text-muted-foreground md:mx-0 mx-auto">
          Upload a PDF and a target role. We return an ATS-style score, strengths, gaps, and keywords.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="card-panel p-6">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Drag & Drop */}
              <div
                className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input type="file" id="resume-upload" className="hidden" onChange={handleChange} accept=".pdf" />
                <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-3">
                    <UploadCloud className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {file ? file.name : "Drop PDF here or click to browse"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">PDF · max 5MB</p>
                  </div>
                </label>
              </div>

              {/* Role Input */}
              <div className="space-y-2">
                <label className="form-label mb-0 flex items-center gap-2 normal-case tracking-normal">
                  <Target size={14} className="text-primary" />
                  Target role
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Full-stack developer"
                  className="input-ctrl"
                />
              </div>

              <button
                type="submit"
                disabled={!file || !role || loading}
                className="btn-primary h-11 font-semibold shadow-md shadow-primary/20 disabled:opacity-50"
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
        <div className="space-y-5 lg:col-span-3">
          {!result && !loading && (
            <div className="flex h-80 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border text-muted-foreground">
              <FileText size={48} strokeWidth={1} className="opacity-40" />
              <p className="mt-3 text-sm font-medium">Results appear here after analysis</p>
            </div>
          )}

          {loading && (
            <div className="card-panel flex flex-col items-center gap-4 p-12">
              <Loader className="h-12 w-12 animate-spin text-primary" />
              <div className="text-center">
                <p className="font-semibold text-foreground">Analyzing…</p>
                <p className="mt-1 text-sm text-muted-foreground">Can take up to a minute</p>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-5">
              <div className="card-panel p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Fit score
                    </p>
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
                <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${getScoreGradient(result.score)} transition-all duration-1000`}
                    style={{ width: `${result.score}%` }}
                  />
                </div>

                {/* Overall Verdict */}
                {result.overallVerdict && (
                  <p className="mt-4 rounded-xl border border-border bg-muted/30 p-3 text-sm italic text-foreground">
                    &ldquo;{result.overallVerdict}&rdquo;
                  </p>
                )}
              </div>

              {/* Strengths */}
              {result.strengths?.length > 0 && (
                <div className="card-panel p-6">
                  <h4 className="mb-4 flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle size={18} /> Strengths
                  </h4>
                  <ul className="space-y-2">
                    {result.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1 w-2 h-2 bg-green-400 rounded-full shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Weaknesses */}
              {result.weaknesses?.length > 0 && (
                <div className="card-panel p-6">
                  <h4 className="mb-4 flex items-center gap-2 font-semibold text-red-600 dark:text-red-400">
                    <AlertTriangle size={18} /> Areas to Improve
                  </h4>
                  <ul className="space-y-2">
                    {result.weaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1 w-2 h-2 bg-red-400 rounded-full shrink-0" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggestions */}
              {result.suggestions?.length > 0 && (
                <div className="card-panel p-6">
                  <h4 className="mb-4 flex items-center gap-2 font-semibold text-primary">
                    <Lightbulb size={18} /> Actionable Suggestions
                  </h4>
                  <ul className="space-y-2">
                    {result.suggestions.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Zap size={14} className="text-indigo-400 mt-0.5 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Missing Keywords */}
              {result.missingKeywords?.length > 0 && (
                <div className="card-panel p-6">
                  <h4 className="mb-4 flex items-center gap-2 font-semibold text-amber-700 dark:text-amber-400">
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