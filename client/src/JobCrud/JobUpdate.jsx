import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Briefcase, Building, MapPin, Calendar } from 'lucide-react';

const JobUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        // Fetch all jobs and find the one (since viewJobById is not commonly exposed publicly or just use view all)
        // Actually server route says `router.get("/viewjob", viewJob)` returns all.
        // It's better to fetch all and filter client side if specific ID endpoint missing, 
        // BUT `adminRoute` says `router.put("/updatejob/:id")` but no `get("/viewjob/:id")`.
        // Wait, `viewJob` is getting ALL. 
        // Let's assume we fetch all and find. Not efficient but works for now.
        const res = await fetch(`http://localhost:8000/api/v1/admin/viewjob`);
        const jobs = await res.json();
        const job = jobs.find(j => j._id === id);

        if (job) {
          setValue("jobTitle", job.jobTitle);
          setValue("company", job.company);
          setValue("jobDescription", job.jobDescription);
          setValue("jobType", job.jobType);
          setValue("jobPost", job.jobPost);
          setValue("location", job.location);
          setValue("skills", job.skills.join(", "));
          // Format date for input type="date"
          if (job.deadline) {
            const date = new Date(job.deadline).toISOString().split('T')[0];
            setValue("deadline", date);
          }
        } else {
          setError("root", { message: "Job not found" });
        }
      } catch (err) {
        console.error(err);
        setError("root", { message: "Failed to load job details" });
      }
    };
    fetchJob();
  }, [id, setValue, setError]);

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        skills: data.skills.split(',').map(s => s.trim())
      };

      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8000/api/v1/admin/updatejob/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formattedData)
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to update job");
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
        <h2 className="text-2xl font-bold text-slate-800">Update Job</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-xl shadow-md space-y-5 border border-gray-100">
        {/* Job Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg outline-none"
            {...register("jobTitle", { required: "Job title is required" })}
          />
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg outline-none"
            {...register("company", { required: "Company name is required" })}
          />
        </div>

        {/* Job Post */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Job Post</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg outline-none"
            {...register("jobPost", { required: "Job post is required" })}
          />
        </div>

        {/* Job Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea
            className="w-full px-4 py-2 border rounded-lg outline-none h-32"
            {...register("jobDescription", { required: "Description is required" })}
          />
        </div>

        {/* Job Type & Location */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Job Type</label>
            <select
              className="w-full px-4 py-2 border rounded-lg outline-none"
              {...register("jobType", { required: "Job type is required" })}
            >
              <option value="fulltime">Full Time</option>
              <option value="parttime">Part Time</option>
              <option value="internship">Internship</option>
              <option value="remote">Remote</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg outline-none"
              {...register("location", { required: "Location is required" })}
            />
          </div>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Skills</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg outline-none"
            {...register("skills", { required: "Skills are required" })}
          />
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Deadline</label>
          <input
            type="date"
            className="w-full px-4 py-2 border rounded-lg outline-none"
            {...register("deadline", { required: "Deadline is required" })}
          />
        </div>

        {errors.root && (
          <div className="text-red-500 text-center">{errors.root.message}</div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
        >
          {isSubmitting ? 'Updating...' : 'Update Job'}
        </button>
      </form>
    </div>
  )
}

export default JobUpdate;
