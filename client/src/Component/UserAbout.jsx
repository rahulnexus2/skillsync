import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import {
  User, Mail, Phone, BookOpen, Code, Edit3, Briefcase,
  ExternalLink, X, Plus, Check, ChevronRight, Loader
} from "lucide-react";

const UserAbout = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    phone: "", education: "", skills: "", projects: []
  });

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get("/users/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
      setFormData({
        phone: res.data.user.phone || "",
        education: res.data.user.education || "",
        skills: res.data.user.skills?.join(", ") || "",
        projects: res.data.user.projects || []
      });
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const skillsArray = formData.skills.split(",").map(s => s.trim()).filter(Boolean);
      await axiosInstance.put("/users/profile", {
        ...formData, skills: skillsArray
      }, { headers: { Authorization: `Bearer ${token}` } });
      setEditMode(false);
      fetchProfile();
    } catch (err) {
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleAddProject = () => {
    setFormData({ ...formData, projects: [...formData.projects, { name: "", description: "", link: "" }] });
  };

  const handleProjectChange = (index, field, value) => {
    const updated = [...formData.projects];
    updated[index][field] = value;
    setFormData({ ...formData, projects: updated });
  };

  const handleRemoveProject = (index) => {
    setFormData({ ...formData, projects: formData.projects.filter((_, i) => i !== index) });
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", gap: 12, color: "#6366f1", fontFamily: "'DM Sans', sans-serif" }}>
      <Loader size={20} style={{ animation: "spin 1s linear infinite" }} />
      <span>Loading profile...</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!profile) return (
    <div style={{ textAlign: "center", padding: 40, color: "#ef4444", fontFamily: "'DM Sans', sans-serif" }}>
      Failed to load profile
    </div>
  );

  const { user, applications } = profile;

  const statusStyle = (status) => {
    if (status === "accepted") return { background: "#dcfce7", color: "#16a34a" };
    if (status === "rejected") return { background: "#fee2e2", color: "#dc2626" };
    return { background: "#fef9c3", color: "#ca8a04" };
  };

  const pendingCount = applications?.filter(a => a.status === "pending").length || 0;
  const acceptedCount = applications?.filter(a => a.status === "accepted").length || 0;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: 1000, margin: "0 auto", padding: "24px 16px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Instrument+Serif:ital@1&display=swap');
        .profile-card { background: white; border: 1px solid #ede9fe; border-radius: 16px; overflow: hidden; }
        .input-field { width: 100%; padding: 10px 14px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.2s; box-sizing: border-box; }
        .input-field:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.08); }
        .save-btn { background: linear-gradient(135deg, #6366f1, #7c3aed); color: white; border: none; border-radius: 10px; padding: 10px 24px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: opacity 0.2s; display: flex; align-items: center; gap: 6px; }
        .save-btn:hover { opacity: 0.9; }
        .cancel-btn { background: #f1f5f9; color: #64748b; border: none; border-radius: 10px; padding: 10px 20px; font-size: 14px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; }
        .cancel-btn:hover { background: #e2e8f0; }
        .skill-tag { display: inline-block; padding: 4px 12px; background: #f5f3ff; color: #6d28d9; border: 1px solid #ddd6fe; border-radius: 100px; font-size: 13px; font-weight: 500; }
        .edit-btn { background: #f5f3ff; color: #6366f1; border: 1px solid #ddd6fe; border-radius: 8px; padding: 7px 14px; font-size: 13px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap-6px; font-family: 'DM Sans', sans-serif; transition: all 0.2s; gap: 6px; }
        .edit-btn:hover { background: #ede9fe; }
        .project-card { background: #fafafa; border: 1px solid #ede9fe; border-radius: 12px; padding: 16px; }
        .add-project-btn { display: flex; align-items: center; gap: 6px; color: #6366f1; font-size: 13px; font-weight: 500; background: none; border: 1.5px dashed #c4b5fd; border-radius: 10px; padding: 8px 16px; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
        .add-project-btn:hover { background: #f5f3ff; }
        tr:hover td { background: #fafafa; }
      `}</style>

      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 600, color: "#1e1b4b", marginBottom: 4 }}>
          My Profile
        </h1>
        <p style={{ fontSize: 14, color: "#94a3b8" }}>Manage your personal information and track your applications</p>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total Applied", value: applications?.length || 0, color: "#6366f1", bg: "#f5f3ff" },
          { label: "Pending", value: pendingCount, color: "#ca8a04", bg: "#fef9c3" },
          { label: "Accepted", value: acceptedCount, color: "#16a34a", bg: "#dcfce7" },
          { label: "Skills Listed", value: user.skills?.length || 0, color: "#7c3aed", bg: "#ede9fe" },
        ].map((s, i) => (
          <div key={i} style={{ background: "white", border: "1px solid #ede9fe", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: s.color }}>{s.value}</span>
            </div>
            <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

        {/* Profile Info Card */}
        <div className="profile-card" style={{ gridColumn: "span 2" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #6366f1, #7c3aed)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <User size={18} color="white" />
              </div>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: "#1e1b4b" }}>Personal Information</h2>
                <p style={{ fontSize: 12, color: "#94a3b8" }}>Your profile details visible to admins</p>
              </div>
            </div>
            {!editMode && (
              <button className="edit-btn" onClick={() => setEditMode(true)}>
                <Edit3 size={14} /> Edit Profile
              </button>
            )}
          </div>

          <div style={{ padding: "24px" }}>
            {!editMode ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                {/* Left column */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <InfoRow icon={<User size={15} />} label="Username" value={user.username} />
                  <InfoRow icon={<Mail size={15} />} label="Email" value={user.email} />
                  <InfoRow icon={<Phone size={15} />} label="Phone" value={user.phone || "Not set"} empty={!user.phone} />
                  <InfoRow icon={<BookOpen size={15} />} label="Education" value={user.education || "Not set"} empty={!user.education} />
                </div>

                {/* Right column — Skills */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                    <Code size={15} color="#6366f1" />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Skills</span>
                  </div>
                  {user.skills?.length > 0 ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {user.skills.map((skill, i) => (
                        <span key={i} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: 13, color: "#94a3b8", fontStyle: "italic" }}>No skills added yet</p>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdate}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Phone</label>
                    <input className="input-field" type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="e.g. 9876543210" />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Education</label>
                    <input className="input-field" type="text" value={formData.education} onChange={e => setFormData({ ...formData, education: e.target.value })} placeholder="e.g. B.Tech in Computer Science" />
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Skills <span style={{ color: "#94a3b8", fontWeight: 400 }}>(comma separated)</span></label>
                    <input className="input-field" type="text" value={formData.skills} onChange={e => setFormData({ ...formData, skills: e.target.value })} placeholder="React, Node.js, MongoDB..." />
                  </div>
                </div>

                {/* Projects */}
                <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 20, marginBottom: 20 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 12 }}>Projects</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {formData.projects.map((proj, index) => (
                      <div key={index} style={{ background: "#fafafa", border: "1px solid #ede9fe", borderRadius: 12, padding: 16, position: "relative" }}>
                        <button type="button" onClick={() => handleRemoveProject(index)} style={{ position: "absolute", top: 10, right: 10, background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}>
                          <X size={16} />
                        </button>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                          <input className="input-field" type="text" placeholder="Project name" value={proj.name} onChange={e => handleProjectChange(index, "name", e.target.value)} required />
                          <input className="input-field" type="url" placeholder="Project link (optional)" value={proj.link} onChange={e => handleProjectChange(index, "link", e.target.value)} />
                          <textarea className="input-field" placeholder="Brief description" value={proj.description} onChange={e => handleProjectChange(index, "description", e.target.value)} style={{ gridColumn: "span 2", height: 72, resize: "none" }} required />
                        </div>
                      </div>
                    ))}
                    <button type="button" className="add-project-btn" onClick={handleAddProject}>
                      <Plus size={14} /> Add Project
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button type="button" className="cancel-btn" onClick={() => setEditMode(false)}>Cancel</button>
                  <button type="submit" className="save-btn" disabled={saving}>
                    {saving ? <><Loader size={14} style={{ animation: "spin 1s linear infinite" }} /> Saving...</> : <><Check size={14} /> Save Changes</>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Projects Display */}
      {!editMode && user.projects?.length > 0 && (
        <div className="profile-card" style={{ marginBottom: 20 }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: "#f5f3ff", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Briefcase size={18} color="#6366f1" />
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: "#1e1b4b" }}>Projects</h2>
              <p style={{ fontSize: 12, color: "#94a3b8" }}>{user.projects.length} project{user.projects.length !== 1 ? "s" : ""} showcased</p>
            </div>
          </div>
          <div style={{ padding: 24, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
            {user.projects.map((proj, i) => (
              <div key={i} className="project-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 600, color: "#1e1b4b" }}>{proj.name}</h4>
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noreferrer" style={{ color: "#6366f1" }}>
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Application Tracker */}
      <div className="profile-card">
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, background: "#f5f3ff", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ChevronRight size={18} color="#6366f1" />
          </div>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: "#1e1b4b" }}>Application Tracker</h2>
            <p style={{ fontSize: 12, color: "#94a3b8" }}>Real-time status of all your job applications</p>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#fafafa", borderBottom: "1px solid #f1f5f9" }}>
                {["Company", "Job Title", "Type", "Applied On", "Status"].map(h => (
                  <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {applications?.length > 0 ? applications.map(app => (
                <tr key={app._id} style={{ borderBottom: "1px solid #f8f8f8" }}>
                  <td style={{ padding: "14px 20px", fontWeight: 600, color: "#1e1b4b" }}>
                    {app.jobId?.company || "—"}
                  </td>
                  <td style={{ padding: "14px 20px", color: "#374151" }}>
                    {app.jobId?.jobTitle || "Deleted Job"}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    {app.jobId?.jobType ? (
                      <span style={{ padding: "3px 10px", background: "#f5f3ff", color: "#6d28d9", borderRadius: 100, fontSize: 12, fontWeight: 500, textTransform: "capitalize" }}>
                        {app.jobId.jobType}
                      </span>
                    ) : "—"}
                  </td>
                  <td style={{ padding: "14px 20px", color: "#94a3b8", fontSize: 13 }}>
                    {new Date(app.appliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ ...statusStyle(app.status), padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 600, textTransform: "capitalize" }}>
                      {app.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" style={{ padding: "48px 20px", textAlign: "center", color: "#94a3b8" }}>
                    <Briefcase size={32} style={{ margin: "0 auto 12px", opacity: 0.3, display: "block" }} />
                    <p style={{ fontSize: 14 }}>No applications yet. Start applying to jobs!</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon, label, value, empty }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
    <div style={{ color: "#6366f1", marginTop: 1 }}>{icon}</div>
    <div>
      <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>{label}</p>
      <p style={{ fontSize: 14, color: empty ? "#cbd5e1" : "#1e1b4b", fontStyle: empty ? "italic" : "normal" }}>{value}</p>
    </div>
  </div>
);

export default UserAbout;