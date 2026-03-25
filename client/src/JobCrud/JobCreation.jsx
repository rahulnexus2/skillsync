import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "sonner";
import { Briefcase, MapPin, Calendar, FileText, Send, Loader } from "lucide-react";

const JobCreation = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formattedData = {
        ...data,
        skills: data.skills.split(",").map((skill) => skill.trim()),
      };
      await axiosInstance.post("/admin/createjob", formattedData);
      toast.success("Job created.");
      navigate("/admin/jobs");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.messsage || err.response?.data?.message || "Failed to create job"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">New listing</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Published jobs appear on the candidate board right away.
        </p>
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
              placeholder="e.g. Senior Frontend Engineer"
            />
          </div>
          {errors.jobTitle && (
            <p className="mt-1 text-xs text-destructive">{errors.jobTitle.message}</p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="form-label">Company</label>
            <input
              {...register("company", { required: "Required" })}
              type="text"
              className="input-ctrl"
              placeholder="Company name"
            />
            {errors.company && (
              <p className="mt-1 text-xs text-destructive">{errors.company.message}</p>
            )}
          </div>
          <div>
            <label className="form-label">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                {...register("location", { required: "Required" })}
                type="text"
                className="input-ctrl-icon"
                placeholder="City or Remote"
              />
            </div>
            {errors.location && (
              <p className="mt-1 text-xs text-destructive">{errors.location.message}</p>
            )}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="form-label">Employment type</label>
            <select
              {...register("jobType", { required: "Required" })}
              className="input-ctrl"
            >
              <option value="">Select…</option>
              <option value="fulltime">Full time</option>
              <option value="parttime">Part time</option>
              <option value="internship">Internship</option>
              <option value="remote">Remote</option>
            </select>
            {errors.jobType && (
              <p className="mt-1 text-xs text-destructive">{errors.jobType.message}</p>
            )}
          </div>
          <div>
            <label className="form-label">Internal ref / ID</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                {...register("jobPost", { required: "Required" })}
                type="text"
                className="input-ctrl-icon"
                placeholder="e.g. REQ-2024-01"
              />
            </div>
            {errors.jobPost && (
              <p className="mt-1 text-xs text-destructive">{errors.jobPost.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="form-label">Description</label>
          <textarea
            {...register("jobDescription", { required: "Required" })}
            rows={5}
            className="input-ctrl min-h-[120px] resize-y"
            placeholder="Responsibilities, requirements, stack…"
          />
          {errors.jobDescription && (
            <p className="mt-1 text-xs text-destructive">{errors.jobDescription.message}</p>
          )}
        </div>

        <div>
          <label className="form-label">Skills (comma separated)</label>
          <input
            {...register("skills", { required: "Required" })}
            type="text"
            className="input-ctrl"
            placeholder="React, Node.js, MongoDB"
          />
          {errors.skills && (
            <p className="mt-1 text-xs text-destructive">{errors.skills.message}</p>
          )}
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
              Publishing…
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Send className="h-4 w-4" />
              Publish job
            </span>
          )}
        </button>
      </form>
    </div>
  );
};

export default JobCreation;
