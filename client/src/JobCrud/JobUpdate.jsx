import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { Briefcase, MapPin, Calendar, FileText } from 'lucide-react';

const JobUpdate = () => {
    const { jobId } = useParams();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchJob();
    }, [jobId]);

    const fetchJob = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/v1/admin/viewjob/${jobId}`);
            const job = res.data;

            // Populate form
            setValue('jobTitle', job.jobTitle);
            setValue('company', job.company);
            setValue('location', job.location);
            setValue('jobType', job.jobType);
            setValue('jobPost', job.jobPost);
            setValue('jobDescription', job.jobDescription);
            setValue('skills', job.skills.join(', '));
            if (job.deadline) {
                setValue('deadline', new Date(job.deadline).toISOString().split('T')[0]);
            }

            setLoading(false);
        } catch (err) {
            console.error(err);
            alert('Failed to fetch job details');
            navigate('/admin/jobs');
        }
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const formattedData = {
                ...data,
                skills: data.skills.split(',').map(skill => skill.trim())
            };

            await axios.put(`http://localhost:8000/api/v1/admin/updatejob/${jobId}`, formattedData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                withCredentials: true
            });

            alert('Job updated successfully!');
            navigate('/admin/jobs');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to update job');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading job details...</div>;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Update Job</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* Job Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                            {...register("jobTitle", { required: "Job Title is required" })}
                            type="text"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Company & Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                        <input
                            {...register("company", { required: "Company Name is required" })}
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                {...register("location", { required: "Location is required" })}
                                type="text"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Job Type & Job Post (Role?) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                        <select
                            {...register("jobType", { required: "Job Type is required" })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="fulltime">Full Time</option>
                            <option value="parttime">Part Time</option>
                            <option value="internship">Internship</option>
                            <option value="remote">Remote</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Post / ID</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                {...register("jobPost", { required: "Job Post is required" })}
                                type="text"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                    <textarea
                        {...register("jobDescription", { required: "Description is required" })}
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    ></textarea>
                </div>

                {/* Skills & Deadline */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
                    <input
                        {...register("skills", { required: "Skills are required" })}
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                            {...register("deadline")}
                            type="date"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center items-center space-x-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.01]"
                >
                    {isSubmitting ? 'Updating...' : 'Update Job'}
                </button>

            </form>
        </div>
    );
};

export default JobUpdate;
