import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "sonner";
import { Briefcase, MapPin, Calendar, Trash2, Edit, Loader } from "lucide-react";
import { Link } from "react-router-dom";

const JobViewAll = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (jobId) => {
    if (!window.confirm("Delete this job listing?")) return;
    try {
      await axiosInstance.delete(`/admin/deletejob/${jobId}`);
      setJobs((prev) => prev.filter((job) => job._id !== jobId));
      toast.success("Job removed.");
    } catch (err) {
      console.error(err);
      toast.error("Could not delete job.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm">Loading listings…</p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
        <Briefcase className="mb-3 h-12 w-12 text-muted-foreground/40" />
        <p className="font-medium text-foreground">No jobs yet</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Create your first listing to attract candidates.
        </p>
        <Link
          to="/admin/jobs/create"
          className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Create job
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div
          key={job._id}
          className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-foreground">{job.jobTitle}</h3>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold uppercase text-emerald-700 dark:text-emerald-400">
                {job.jobType}
              </span>
            </div>
            <p className="mt-1 font-medium text-primary">{job.company}</p>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4 shrink-0" />
                {job.location}
              </span>
              {job.deadline && (
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-4 w-4 shrink-0" />
                  {new Date(job.deadline).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            <Link
              to={`/admin/jobs/view/${job._id}`}
              className="btn-secondary text-sm"
            >
              View
            </Link>
            <Link
              to={`/admin/jobs/update/${job._id}`}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Link>
            <button
              type="button"
              onClick={() => handleDelete(job._id)}
              className="inline-flex items-center gap-2 rounded-lg border border-destructive/30 bg-card px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobViewAll;
