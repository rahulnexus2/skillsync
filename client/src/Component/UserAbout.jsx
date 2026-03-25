import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  BookOpen,
  Code,
  Edit3,
  Briefcase,
  ExternalLink,
  X,
  Plus,
  Check,
  ChevronRight,
  Loader,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader";

const statusBadge = (status) => {
  const map = {
    accepted:
      "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-500/20",
    rejected: "bg-red-500/10 text-red-800 dark:text-red-300 ring-1 ring-red-500/20",
    pending:
      "bg-amber-500/10 text-amber-800 dark:text-amber-300 ring-1 ring-amber-500/20",
  };
  return map[status] || map.pending;
};

const InfoRow = ({ icon, label, value, empty }) => (
  <div className="flex gap-3">
    <div className="mt-0.5 text-primary">{icon}</div>
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p
        className={`mt-0.5 text-sm ${
          empty ? "italic text-muted-foreground/70" : "text-foreground"
        }`}
      >
        {value}
      </p>
    </div>
  </div>
);

const UserAbout = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    education: "",
    skills: "",
    projects: [],
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get("/users/profile");
      setProfile(res.data);
      setFormData({
        phone: res.data.user.phone || "",
        education: res.data.user.education || "",
        skills: res.data.user.skills?.join(", ") || "",
        projects: res.data.user.projects || [],
      });
    } catch (err) {
      console.error("Failed to load profile", err);
      toast.error("Could not load profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const skillsArray = formData.skills.split(",").map((s) => s.trim()).filter(Boolean);
      await axiosInstance.put("/users/profile", {
        ...formData,
        skills: skillsArray,
      });
      setEditMode(false);
      fetchProfile();
      toast.success("Profile saved.");
    } catch (err) {
      toast.error("Could not save profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddProject = () => {
    setFormData({
      ...formData,
      projects: [...formData.projects, { name: "", description: "", link: "" }],
    });
  };

  const handleProjectChange = (index, field, value) => {
    const updated = [...formData.projects];
    updated[index][field] = value;
    setFormData({ ...formData, projects: updated });
  };

  const handleRemoveProject = (index) => {
    setFormData({
      ...formData,
      projects: formData.projects.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm">Loading profile…</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-xl border border-dashed border-border py-16 text-center">
        <p className="text-sm text-destructive">Failed to load profile.</p>
      </div>
    );
  }

  const { user, applications } = profile;
  const pendingCount = applications?.filter((a) => a.status === "pending").length || 0;
  const acceptedCount = applications?.filter((a) => a.status === "accepted").length || 0;

  const stats = [
    { label: "Applications", value: applications?.length || 0, accent: "text-primary" },
    { label: "Pending", value: pendingCount, accent: "text-amber-600 dark:text-amber-400" },
    { label: "Accepted", value: acceptedCount, accent: "text-emerald-600 dark:text-emerald-400" },
    { label: "Skills", value: user.skills?.length || 0, accent: "text-violet-600 dark:text-violet-400" },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Profile"
        description="Information visible to recruiters and used for your applications."
      />

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-border bg-card px-4 py-3 shadow-soft"
          >
            <p className={`text-2xl font-semibold tabular-nums ${s.accent}`}>{s.value}</p>
            <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card-panel mb-6">
        <div className="flex flex-col gap-4 border-b border-border bg-muted/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <User className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Personal information</h2>
              <p className="text-xs text-muted-foreground">Basics & contact</p>
            </div>
          </div>
          {!editMode && (
            <button
              type="button"
              onClick={() => setEditMode(true)}
              className="btn-secondary w-full sm:w-auto"
            >
              <Edit3 className="h-4 w-4" />
              Edit
            </button>
          )}
        </div>

        <div className="p-5 sm:p-6">
          {!editMode ? (
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-5">
                <InfoRow icon={<User className="h-4 w-4" />} label="Username" value={user.username} />
                <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={user.email} />
                <InfoRow
                  icon={<Phone className="h-4 w-4" />}
                  label="Phone"
                  value={user.phone || "Not set"}
                  empty={!user.phone}
                />
                <InfoRow
                  icon={<BookOpen className="h-4 w-4" />}
                  label="Education"
                  value={user.education || "Not set"}
                  empty={!user.education}
                />
              </div>
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Code className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">Skills</span>
                </div>
                {user.skills?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm italic text-muted-foreground">No skills yet.</p>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="form-label">Phone</label>
                  <input
                    className="input-ctrl"
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div>
                  <label className="form-label">Education</label>
                  <input
                    className="input-ctrl"
                    type="text"
                    value={formData.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    placeholder="Degree, school, year"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="form-label">Skills (comma separated)</label>
                  <input
                    className="input-ctrl"
                    type="text"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    placeholder="React, TypeScript, Node.js"
                  />
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <label className="form-label mb-3">Projects</label>
                <div className="space-y-3">
                  {formData.projects.map((proj, index) => (
                    <div
                      key={index}
                      className="relative rounded-xl border border-border bg-muted/20 p-4"
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveProject(index)}
                        className="absolute right-3 top-3 rounded-lg p-1 text-destructive hover:bg-destructive/10"
                        aria-label="Remove project"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="grid gap-3 pr-8 sm:grid-cols-2">
                        <input
                          className="input-ctrl"
                          type="text"
                          placeholder="Project name"
                          value={proj.name}
                          onChange={(e) => handleProjectChange(index, "name", e.target.value)}
                          required
                        />
                        <input
                          className="input-ctrl"
                          type="url"
                          placeholder="https://…"
                          value={proj.link}
                          onChange={(e) => handleProjectChange(index, "link", e.target.value)}
                        />
                        <textarea
                          className="input-ctrl min-h-[4.5rem] resize-none sm:col-span-2"
                          placeholder="Short description"
                          value={proj.description}
                          onChange={(e) => handleProjectChange(index, "description", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddProject}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    <Plus className="h-4 w-4" />
                    Add project
                  </button>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-border pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary sm:w-auto sm:min-w-[140px]" disabled={saving}>
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader className="h-4 w-4 animate-spin" />
                      Saving…
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Check className="h-4 w-4" />
                      Save
                    </span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {!editMode && user.projects?.length > 0 && (
        <div className="card-panel mb-6">
          <div className="flex items-center gap-3 border-b border-border bg-muted/20 px-5 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Briefcase className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Projects</h2>
              <p className="text-xs text-muted-foreground">
                {user.projects.length} shown on your profile
              </p>
            </div>
          </div>
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            {user.projects.map((proj, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-muted/10 p-4 transition-colors hover:bg-muted/20"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-foreground">{proj.name}</h3>
                  {proj.link && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 text-primary hover:opacity-80"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card-panel overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border bg-muted/20 px-5 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ChevronRight className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Application tracker</h2>
            <p className="text-xs text-muted-foreground">Status for each role you applied to</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-3 py-3 sm:px-5">Company</th>
                <th className="px-3 py-3 sm:px-5">Role</th>
                <th className="px-3 py-3 sm:px-5">Type</th>
                <th className="px-3 py-3 sm:px-5">Applied</th>
                <th className="px-3 py-3 sm:px-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {applications?.length > 0 ? (
                applications.map((app) => (
                  <tr key={app._id} className="hover:bg-muted/20">
                    <td className="px-3 py-3 sm:px-5 font-medium text-foreground">
                      {app.jobId?.company || "—"}
                    </td>
                    <td className="px-3 py-3 sm:px-5 text-muted-foreground">
                      {app.jobId?.jobTitle || "Removed job"}
                    </td>
                    <td className="px-3 py-3 sm:px-5">
                      {app.jobId?.jobType ? (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs capitalize text-foreground">
                          {app.jobId.jobType}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-3 py-3 sm:px-5 text-muted-foreground">
                      {new Date(app.appliedAt).toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-3 py-3 sm:px-5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusBadge(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <Briefcase className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">No applications yet.</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Browse jobs and apply to see them here.
                    </p>
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

export default UserAbout;
