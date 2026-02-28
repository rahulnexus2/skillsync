import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import {
  Briefcase, MapPin, Calendar, Send, Search,
  Filter, Clock, CheckCircle, XCircle, Loader
} from "lucide-react";

const UserJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);
  const [applied, setApplied] = useState({}); // jobId -> "success" | "already" | "error"
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      const res = await axiosInstance.get("/admin/viewjob");
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    setApplying(jobId);
    try {
      await axiosInstance.post(`/users/apply/${jobId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setApplied(prev => ({ ...prev, [jobId]: "success" }));
    } catch (err) {
      const msg = err.response?.data?.message || "";
      if (msg.toLowerCase().includes("already")) {
        setApplied(prev => ({ ...prev, [jobId]: "already" }));
      } else {
        setApplied(prev => ({ ...prev, [jobId]: "error" }));
      }
    } finally {
      setApplying(null);
    }
  };

  const jobTypes = ["all", ...new Set(jobs.map(j => j.jobType).filter(Boolean))];

  const filtered = jobs.filter(job => {
    const matchSearch =
      job.jobTitle?.toLowerCase().includes(search.toLowerCase()) ||
      job.company?.toLowerCase().includes(search.toLowerCase()) ||
      job.location?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || job.jobType === typeFilter;
    return matchSearch && matchType;
  });

  const typeColors = {
    fulltime: { bg: "#dcfce7", color: "#16a34a" },
    parttime: { bg: "#fef9c3", color: "#ca8a04" },
    internship: { bg: "#dbeafe", color: "#2563eb" },
    remote: { bg: "#f5f3ff", color: "#7c3aed" },
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", gap: 12, color: "#6366f1", fontFamily: "'DM Sans', sans-serif" }}>
      <Loader size={20} style={{ animation: "spin 1s linear infinite" }} />
      <span>Loading opportunities...</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: 1100, margin: "0 auto", padding: "24px 16px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        .job-card { background: white; border: 1px solid #ede9fe; border-radius: 16px; padding: 24px; display: flex; flex-direction: column; justify-content: space-between; transition: transform 0.2s, box-shadow 0.2s; }
        .job-card:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(99,102,241,0.1); border-color: #c4b5fd; }
        .apply-btn { width: 100%; padding: 11px; background: linear-gradient(135deg, #6366f1, #7c3aed); color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; display: flex; align-items: center; justify-content: center; gap: 6px; transition: opacity 0.2s; }
        .apply-btn:hover { opacity: 0.9; }
        .apply-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .search-input { width: 100%; padding: 10px 14px 10px 40px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.2s; box-sizing: border-box; }
        .search-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.08); }
        .filter-btn { padding: 8px 16px; border-radius: 100px; font-size: 13px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; border: 1.5px solid #e2e8f0; background: white; color: #64748b; transition: all 0.2s; }
        .filter-btn.active { background: #6366f1; color: white; border-color: #6366f1; }
        .filter-btn:hover:not(.active) { border-color: #c4b5fd; color: #6366f1; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 600, color: "#1e1b4b", marginBottom: 4 }}>
          Job Opportunities
        </h1>
        <p style={{ fontSize: 14, color: "#94a3b8" }}>
          {jobs.length} active listing{jobs.length !== 1 ? "s" : ""} available
        </p>
      </div>

      {/* Search + Filter */}
      <div style={{ background: "white", border: "1px solid #ede9fe", borderRadius: 14, padding: "16px 20px", marginBottom: 24, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input
            className="search-input"
            type="text"
            placeholder="Search by title, company or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Type Filters */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <Filter size={15} color="#94a3b8" />
          {jobTypes.map(type => (
            <button
              key={type}
              className={`filter-btn ${typeFilter === type ? "active" : ""}`}
              onClick={() => setTypeFilter(type)}
            >
              {type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
          <Briefcase size={40} style={{ margin: "0 auto 12px", opacity: 0.3, display: "block" }} />
          <p style={{ fontSize: 15 }}>No jobs found matching your search.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {filtered.map(job => {
            const appStatus = applied[job._id];
            const typeColor = typeColors[job.jobType] || { bg: "#f1f5f9", color: "#64748b" };
            const isDeadlinePassed = job.deadline && new Date(job.deadline) < new Date();

            return (
              <div key={job._id} className="job-card">
                <div>
                  {/* Top Row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div style={{ width: 42, height: 42, background: "#f5f3ff", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Briefcase size={20} color="#6366f1" />
                    </div>
                    <span style={{ ...typeColor, padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 600, textTransform: "capitalize" }}>
                      {job.jobType}
                    </span>
                  </div>

                  {/* Title & Company */}
                  <h3 style={{ fontSize: 17, fontWeight: 600, color: "#1e1b4b", marginBottom: 4 }}>{job.jobTitle}</h3>
                  <p style={{ fontSize: 14, color: "#6366f1", fontWeight: 500, marginBottom: 12 }}>{job.company}</p>

                  {/* Meta */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#64748b" }}>
                      <MapPin size={13} /> {job.location}
                    </span>
                    {job.deadline && (
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: isDeadlinePassed ? "#ef4444" : "#64748b" }}>
                        <Calendar size={13} />
                        {isDeadlinePassed ? "Deadline passed" : `Due ${new Date(job.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7, marginBottom: 16, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {job.jobDescription}
                  </p>

                  {/* Skills */}
                  {job.skills?.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                      {job.skills.slice(0, 4).map((skill, i) => (
                        <span key={i} style={{ padding: "3px 10px", background: "#f8f7ff", color: "#6d28d9", border: "1px solid #ede9fe", borderRadius: 100, fontSize: 12 }}>
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 4 && (
                        <span style={{ padding: "3px 10px", background: "#f1f5f9", color: "#94a3b8", borderRadius: 100, fontSize: 12 }}>
                          +{job.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Posted by */}
                <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 14, paddingTop: 12, borderTop: "1px solid #f8f7ff" }}>
                  <Clock size={11} style={{ display: "inline", marginRight: 4 }} />
                  Posted by <span style={{ fontWeight: 500, color: "#6366f1" }}>{job.postedBy?.username || "Admin"}</span>
                </div>

                {/* Apply Button */}
                {appStatus === "success" ? (
                  <div style={{ width: "100%", padding: 11, background: "#dcfce7", color: "#16a34a", borderRadius: 10, fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <CheckCircle size={16} /> Applied Successfully!
                  </div>
                ) : appStatus === "already" ? (
                  <div style={{ width: "100%", padding: 11, background: "#fef9c3", color: "#ca8a04", borderRadius: 10, fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <CheckCircle size={16} /> Already Applied
                  </div>
                ) : appStatus === "error" ? (
                  <div style={{ width: "100%", padding: 11, background: "#fee2e2", color: "#dc2626", borderRadius: 10, fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <XCircle size={16} /> Failed — Try Again
                  </div>
                ) : (
                  <button
                    className="apply-btn"
                    onClick={() => handleApply(job._id)}
                    disabled={applying === job._id || isDeadlinePassed}
                  >
                    {applying === job._id ? (
                      <><Loader size={14} style={{ animation: "spin 1s linear infinite" }} /> Applying...</>
                    ) : isDeadlinePassed ? (
                      "Deadline Passed"
                    ) : (
                      <><Send size={14} /> Apply Now</>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserJobs;