import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "sonner";
import {
  Briefcase,
  Users,
  User,
  Mail,
  Phone,
  BookOpen,
  Code,
  FolderGit2,
  ExternalLink,
  X,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader";

const AdminAbout = () => {
  const [applications, setApplications] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [appsRes, statsRes] = await Promise.all([
        axiosInstance.get("/admin/applications"),
        axiosInstance.get("/admin/stats"),
      ]);
      setApplications(appsRes.data);
      setAdminStats(statsRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axiosInstance.put(`/admin/application/${id}`, { status });
      setApplications((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status } : app))
      );
      if (selectedApp?._id === id) {
        setSelectedApp((prev) => ({ ...prev, status }));
      }
      toast.success("Status updated.");
    } catch (error) {
      toast.error("Could not update status.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        Loading dashboard…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center text-sm text-destructive">
        {error}
      </div>
    );
  }

  const pendingCount = applications.filter((a) => a.status === "pending").length;
  const acceptedCount = applications.filter((a) => a.status === "accepted").length;
  const rejectedCount = applications.filter((a) => a.status === "rejected").length;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        title="Recruiter dashboard"
        description="Review applicants and update statuses. Accepted candidates can message you in Chat."
      />

      {adminStats && (
        <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/15 via-card to-card p-6 shadow-soft sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground">
              {adminStats.admin?.username?.[0] || "A"}
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-semibold capitalize tracking-tight text-foreground">
                {adminStats.admin?.username}
              </h2>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                {adminStats.admin?.email}
              </p>
              {adminStats.admin?.phoneNumber && (
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  {adminStats.admin.phoneNumber}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={<Briefcase className="h-5 w-5 text-primary" />}
          label="Jobs posted"
          value={adminStats?.stats?.jobsPosted ?? 0}
        />
        <StatCard
          icon={<Users className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
          label="Pending"
          value={pendingCount}
        />
        <StatCard
          icon={<CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
          label="Accepted"
          value={acceptedCount}
        />
        <StatCard
          icon={<XCircle className="h-5 w-5 text-red-500" />}
          label="Rejected"
          value={rejectedCount}
        />
      </div>

      <div className="card-panel">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-semibold text-foreground">Applications</h2>
          <p className="text-xs text-muted-foreground">Newest first</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Candidate</th>
                <th className="px-4 py-3">Job</th>
                <th className="px-4 py-3">Applied</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-14 text-center text-muted-foreground">
                    No applications yet.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app._id} className="hover:bg-muted/15">
                    <td className="px-4 py-3">
                      <p className="font-medium capitalize text-foreground">
                        {app.userId?.username || "Unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground">{app.userId?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {app.jobId?.jobTitle || "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedApp(app)}
                        className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                      >
                        View profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedApp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="card-panel max-h-[90vh] w-full max-w-lg overflow-y-auto shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-5 py-4">
              <h3 className="font-semibold text-foreground">Applicant</h3>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-lg font-bold uppercase text-primary">
                  {selectedApp.userId?.username?.[0] || "U"}
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-semibold capitalize text-foreground">
                    {selectedApp.userId?.username}
                  </p>
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    {selectedApp.userId?.email}
                  </p>
                  {selectedApp.userId?.phone && (
                    <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" />
                      {selectedApp.userId.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-2 rounded-xl border border-border bg-muted/20 px-3 py-2.5 text-sm">
                <Briefcase className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="text-foreground">
                  <span className="font-medium">{selectedApp.jobId?.jobTitle}</span>
                  <span className="text-muted-foreground"> · </span>
                  {selectedApp.jobId?.company}
                </span>
              </div>

              {selectedApp.userId?.education && (
                <div>
                  <h4 className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <BookOpen className="h-3.5 w-3.5" />
                    Education
                  </h4>
                  <p className="text-sm text-foreground">{selectedApp.userId.education}</p>
                </div>
              )}

              {selectedApp.userId?.skills?.length > 0 && (
                <div>
                  <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <Code className="h-3.5 w-3.5" />
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedApp.userId.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedApp.userId?.projects?.length > 0 && (
                <div>
                  <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <FolderGit2 className="h-3.5 w-3.5" />
                    Projects
                  </h4>
                  <div className="space-y-2">
                    {selectedApp.userId.projects.map((project, i) => (
                      <div key={i} className="rounded-xl border border-border bg-muted/10 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium text-foreground">{project.name}</p>
                          {project.link && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary hover:opacity-80"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{project.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 border-t border-border pt-4">
                <span className="text-sm text-muted-foreground">Status</span>
                <StatusBadge status={selectedApp.status} />
              </div>

              {selectedApp.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate(selectedApp._id, "rejected")}
                    className="btn-secondary flex-1 border-destructive/30 text-destructive hover:bg-destructive/10"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate(selectedApp._id, "accepted")}
                    className="btn-primary flex-1"
                  >
                    Accept
                  </button>
                </div>
              )}

              {selectedApp.status !== "pending" && (
                <div className="flex gap-2">
                  {selectedApp.status === "accepted" && (
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate(selectedApp._id, "rejected")}
                      className="btn-secondary flex-1 border-destructive/30 text-destructive hover:bg-destructive/10"
                    >
                      Move to rejected
                    </button>
                  )}
                  {selectedApp.status === "rejected" && (
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate(selectedApp._id, "accepted")}
                      className="btn-primary flex-1"
                    >
                      Move to accepted
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-soft">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">{icon}</div>
    <div>
      <p className="text-2xl font-semibold tabular-nums text-foreground">{value}</p>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
    </div>
  </div>
);

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
      status === "accepted"
        ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300"
        : status === "rejected"
          ? "bg-red-500/15 text-red-800 dark:text-red-300"
          : "bg-amber-500/15 text-amber-800 dark:text-amber-300"
    }`}
  >
    {status}
  </span>
);

export default AdminAbout;
