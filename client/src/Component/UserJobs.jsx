import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import {
  Briefcase,
  MapPin,
  Calendar,
  Send,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  Loader,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../components/PageHeader";

const typeBadgeClass = {
  fulltime: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  parttime: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  internship: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  remote: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
};

const UserJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);
  const [applied, setApplied] = useState({});
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axiosInstance.get("/admin/viewjob");
      setJobs(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Could not load jobs.");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    setApplying(jobId);
    try {
      await axiosInstance.post(`/users/apply/${jobId}`, {});
      setApplied((prev) => ({ ...prev, [jobId]: "success" }));
      toast.success("Application sent.");
    } catch (err) {
      const msg = err.response?.data?.message || "";
      if (msg.toLowerCase().includes("already")) {
        setApplied((prev) => ({ ...prev, [jobId]: "already" }));
        toast.info("You already applied to this role.");
      } else {
        setApplied((prev) => ({ ...prev, [jobId]: "error" }));
        toast.error(msg || "Could not apply.");
      }
    } finally {
      setApplying(null);
    }
  };

  const jobTypes = ["all", ...new Set(jobs.map((j) => j.jobType).filter(Boolean))];

  const filtered = jobs.filter((job) => {
    const q = search.toLowerCase();
    const matchSearch =
      job.jobTitle?.toLowerCase().includes(q) ||
      job.company?.toLowerCase().includes(q) ||
      job.location?.toLowerCase().includes(q);
    const matchType = typeFilter === "all" || job.jobType === typeFilter;
    return matchSearch && matchType;
  });

  if (loading) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm">Loading opportunities…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Job opportunities"
        description={`${jobs.length} active listing${jobs.length !== 1 ? "s" : ""}. Search and filter to find a fit.`}
      />

      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-border bg-muted/30 p-4 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search title, company, location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-3 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 shrink-0 text-muted-foreground" />
          {jobTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setTypeFilter(type)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                typeFilter === type
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {type === "all"
                ? "All"
                : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
          <Briefcase className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm font-medium text-foreground">No roles match</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Try another search or filter.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((job) => {
            const appStatus = applied[job._id];
            const badgeClass =
              typeBadgeClass[job.jobType] ||
              "bg-muted text-muted-foreground";
            const isDeadlinePassed =
              job.deadline && new Date(job.deadline) < new Date();

            return (
              <article
                key={job._id}
                className="group flex flex-col rounded-xl border border-border bg-card p-5 shadow-soft transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Briefcase className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${badgeClass}`}
                  >
                    {job.jobType}
                  </span>
                </div>

                <h2 className="text-base font-semibold text-foreground">
                  {job.jobTitle}
                </h2>
                <p className="mt-0.5 text-sm text-primary">{job.company}</p>

                <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {job.location}
                  </span>
                  {job.deadline && (
                    <span
                      className={`inline-flex items-center gap-1 ${
                        isDeadlinePassed ? "text-destructive" : ""
                      }`}
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      {isDeadlinePassed
                        ? "Deadline passed"
                        : `Due ${new Date(job.deadline).toLocaleDateString(undefined, {
                            day: "numeric",
                            month: "short",
                          })}`}
                    </span>
                  )}
                </div>

                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {job.jobDescription}
                </p>

                {job.skills?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {job.skills.slice(0, 4).map((skill, i) => (
                      <span
                        key={i}
                        className="rounded-full border border-border bg-muted/50 px-2 py-0.5 text-xs text-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 4 && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        +{job.skills.length - 4}
                      </span>
                    )}
                  </div>
                )}

                <div className="mt-4 flex items-center gap-1 border-t border-border pt-4 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    Posted by{" "}
                    <span className="font-medium text-primary">
                      {job.postedBy?.username || "Admin"}
                    </span>
                  </span>
                </div>

                <div className="mt-4">
                  {appStatus === "success" ? (
                    <div className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500/10 py-2.5 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                      <CheckCircle className="h-4 w-4" />
                      Applied
                    </div>
                  ) : appStatus === "already" ? (
                    <div className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500/10 py-2.5 text-sm font-medium text-amber-700 dark:text-amber-400">
                      <CheckCircle className="h-4 w-4" />
                      Already applied
                    </div>
                  ) : appStatus === "error" ? (
                    <div className="flex w-full items-center justify-center gap-2 rounded-lg bg-destructive/10 py-2.5 text-sm font-medium text-destructive">
                      <XCircle className="h-4 w-4" />
                      Try again
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleApply(job._id)}
                      disabled={applying === job._id || isDeadlinePassed}
                      className="btn-primary flex w-full items-center gap-2"
                    >
                      {applying === job._id ? (
                        <>
                          <Loader className="h-4 w-4 animate-spin" />
                          Applying…
                        </>
                      ) : isDeadlinePassed ? (
                        "Closed"
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Apply
                        </>
                      )}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserJobs;
