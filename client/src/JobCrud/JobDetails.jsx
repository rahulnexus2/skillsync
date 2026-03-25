import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import {
  Briefcase,
  MapPin,
  Calendar,
  ArrowLeft,
  Loader,
  Hash,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader";

const JobDetails = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await axiosInstance.get(`/admin/viewjob/${jobId}`);
        if (!cancelled) setJob(res.data);
      } catch (e) {
        if (!cancelled) setError(e.response?.data?.message || "Could not load job.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [jobId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm">Loading job…</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
        <p className="text-sm text-destructive">{error || "Job not found."}</p>
        <Link
          to="/admin/jobs"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        to="/admin/jobs"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All jobs
      </Link>

      <PageHeader title={job.jobTitle} description={job.company} />

      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold capitalize text-primary">
          {job.jobType}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {job.location}
        </span>
        {job.deadline && (
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            Deadline {new Date(job.deadline).toLocaleDateString()}
          </span>
        )}
        {job.jobPost && (
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
            <Hash className="h-3.5 w-3.5" />
            {job.jobPost}
          </span>
        )}
      </div>

      <div className="card-panel p-5 sm:p-6">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          <Briefcase className="h-4 w-4" />
          Description
        </h2>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
          {job.jobDescription}
        </p>
      </div>

      {job.skills?.length > 0 && (
        <div className="card-panel p-5 sm:p-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((s, i) => (
              <span
                key={i}
                className="rounded-full border border-border bg-muted/30 px-3 py-1 text-xs font-medium"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Link
          to={`/admin/jobs/update/${job._id}`}
          className="btn-primary w-auto min-w-[120px]"
        >
          Edit listing
        </Link>
      </div>
    </div>
  );
};

export default JobDetails;
