import React from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Briefcase, Building, MapPin, Calendar, CheckCircle } from 'lucide-react';

const JobCreation = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      // Split skills string into array
      const formattedData = {
        ...data,
        skills: data.skills.split(',').map(s => s.trim())
      };

      const token = localStorage.getItem('token');
      const res = await fetch("http://localhost:8000/api/v1/admin/createjob", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formattedData)
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to create job");
      }

      alert(result.message);
      navigate('/admin/jobs');

    } catch (err) {
      console.error(err);
      setError("root", { type: "server", message: err.message });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Post a New Job</h2>
        <p className="text-slate-500">Find the best talent for your team.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-xl shadow-md space-y-5 border border-gray-100">

        {/* Job Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              placeholder="e.g. Senior Software Engineer"
              {...register("jobTitle", {
                required: "Job title is required",
                maxLength: { value: 50, message: "Title too long" }
              })}
            />
          </div>
          {errors.jobTitle && <p className="text-red-500 text-xs mt-1">{errors.jobTitle.message}</p>}
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
          <div className="relative">
            <Building className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              placeholder="e.g. Tech Corp"
              {...register("company", { required: "Company name is required" })}
            />
          </div>
          {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company.message}</p>}
        </div>

        {/* Job Post/Role */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Job Role/Post</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="e.g. Backend Developer"
            {...register("jobPost", { required: "Job post is required" })}
          />
          {errors.jobPost && <p className="text-red-500 text-xs mt-1">{errors.jobPost.message}</p>}
        </div>

        {/* Job Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-32"
            placeholder="Describe the role responsibilities and requirements..."
            {...register("jobDescription", { required: "Description is required" })}
          />
          {errors.jobDescription && <p className="text-red-500 text-xs mt-1">{errors.jobDescription.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Job Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Job Type</label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              {...register("jobType", { required: "Job type is required" })}
            >
              <option value="">Select Type</option>
              <option value="fulltime">Full Time</option>
              <option value="parttime">Part Time</option>
              <option value="internship">Internship</option>
              <option value="remote">Remote</option>
            </select>
            {errors.jobType && <p className="text-red-500 text-xs mt-1">{errors.jobType.message}</p>}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g. New York, NY"
                {...register("location", { required: "Location is required" })}
              />
            </div>
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
          </div>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Required Skills (comma separated)</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="e.g. React, Node.js, MongoDB"
            {...register("skills", { required: "Skills are required" })}
          />
          {errors.skills && <p className="text-red-500 text-xs mt-1">{errors.skills.message}</p>}
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Application Deadline</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
            <input
              type="date"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              {...register("deadline", { required: "Deadline is required" })}
            />
          </div>
          {errors.deadline && <p className="text-red-500 text-xs mt-1">{errors.deadline.message}</p>}
        </div>

        {/* Root Error */}
        {errors.root && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">
            {errors.root.message}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition duration-200 disabled:opacity-70 flex justify-center items-center"
        >
          {isSubmitting ? 'Posting...' : 'Create Job Opening'}
        </button>
      </form>
    </div>
  );
};

export default JobCreation;
