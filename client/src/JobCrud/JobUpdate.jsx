import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "sonner";
import { Briefcase, MapPin, Calendar, FileText, Loader, Save } from "lucide-react";

const JobUpdate = () => {
  const { jobId } = useParams();
  const { register, handleSubmit, setValue } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axiosInstance.get(`/admin/viewjob/${jobId}`);
        const job = res.data;

        setValue("jobTitle", job.jobTitle);
        setValue("company", job.company);
        setValue("location", job.location);
        setValue("jobType", job.jobType);
        setValue("jobPost", job.jobPost);
        setValue("jobDescription", job.jobDescription);
        setValue("skills", job.skills.join(", "));
        if (job.deadline) {
          setValue("deadline", new Date(job.deadline).toISOString().split("T")[0]);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Could not load job.");
        navigate("/admin/jobs");
      }
    };
    fetchJob();
  }, [jobId, setValue, navigate]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formattedData = {
        ...data,
        skills: data.skills.split(",").map((skill) => skill.trim()),
      };

      await axiosInstance.put(`/admin/updatejob/${jobId}`, formattedData);

      toast.success("Job updated.");
      navigate("/admin/jobs");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update job");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm">Loading job…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Edit listing</h2>
        <p className="mt-1 text-sm text-muted-foreground">Changes apply immediately for candidates.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="form-label">Job title</label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              {...register("jobTitle", { required: "Required" })}
              type="text"
              className="input-ctrl-icon"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="form-label">Company</label>
            <input {...register("company", { required: "Required" })} type="text" className="input-ctrl" />
          </div>
          <div>
            <label className="form-label">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                {...register("location", { required: "Required" })}
                type="text"
                className="input-ctrl-icon"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="form-label">Employment type</label>
            <select {...register("jobType", { required: "Required" })} className="input-ctrl">
              <option value="fulltime">Full time</option>
              <option value="parttime">Part time</option>
              <option value="internship">Internship</option>
              <option value="remote">Remote</option>
            </select>
          </div>
          <div>
            <label className="form-label">Internal ref / ID</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                {...register("jobPost", { required: "Required" })}
                type="text"
                className="input-ctrl-icon"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="form-label">Description</label>
          <textarea
            {...register("jobDescription", { required: "Required" })}
            rows={5}
            className="input-ctrl min-h-[120px] resize-y"
          />
        </div>

        <div>
          <label className="form-label">Skills (comma separated)</label>
          <input {...register("skills", { required: "Required" })} type="text" className="input-ctrl" />
        </div>

        <div>
          <label className="form-label">Application deadline</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input {...register("deadline")} type="date" className="input-ctrl-icon" />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary h-11 text-base font-semibold shadow-md shadow-primary/20"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader className="h-4 w-4 animate-spin" />
              Saving…
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Save className="h-4 w-4" />
              Save changes
            </span>
          )}
        </button>
      </form>
    </div>
  );
};

export default JobUpdate;
