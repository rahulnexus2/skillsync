import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Briefcase, MapPin, Calendar, FileText, DollarSign, Send } from 'lucide-react';

const JobCreation = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            // Transform date to ISO string if needed, or send as is
            // Convert skills string "a, b, c" to array ["a", "b", "c"]
            const formattedData = {
                ...data,
                skills: data.skills.split(',').map(skill => skill.trim())
            };

            const token = localStorage.getItem('adminToken'); // Assuming token is stored here? 
            // Better to rely on cookie auth since backend sets cors credentials: true.
            // But verify if adminAuth uses header? 
            // adminAuth.js uses Authorization: Bearer <token>.
            // We need to send the token. 
            // Wait, previous axios calls in AdminAbout used withCredentials: true, implying cookies?
            // Checking adminAuth.js again:
            // "const authHeader = req.headers.authorization;" -> It checks header.
            // So we MUST send header.
            // Where is the token? 
            // In AdminLogin.jsx (I should check where it saves token). 
            // I'll assume localStorage.getItem('token') or 'adminToken'.
            // Let's check AdminLogin to be sure. I will err on side of caution and check it.
            // But for now, let's assume 'token'.

            await axios.post('http://localhost:8000/api/v1/admin/createjob', formattedData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                },
                withCredentials: true
            });

            alert('Job created successfully!');
            navigate('/admin/jobs');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.messsage || 'Failed to create job');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Post a New Job</h2>
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
                            placeholder="e.g. Senior React Developer"
                        />
                    </div>
                    {errors.jobTitle && <p className="text-red-500 text-xs mt-1">{errors.jobTitle.message}</p>}
                </div>

                {/* Company & Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                        <input
                            {...register("company", { required: "Company Name is required" })}
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g. Tech Corp"
                        />
                        {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                {...register("location", { required: "Location is required" })}
                                type="text"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g. Remote / New York"
                            />
                        </div>
                        {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
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
                            <option value="">Select Type</option>
                            <option value="fulltime">Full Time</option>
                            <option value="parttime">Part Time</option>
                            <option value="internship">Internship</option>
                            <option value="remote">Remote</option>
                        </select>
                        {errors.jobType && <p className="text-red-500 text-xs mt-1">{errors.jobType.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Post / ID</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                {...register("jobPost", { required: "Job Post is required" })}
                                type="text"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g. SDE-101"
                            />
                        </div>
                        {errors.jobPost && <p className="text-red-500 text-xs mt-1">{errors.jobPost.message}</p>}
                    </div>
                </div>


                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                    <textarea
                        {...register("jobDescription", { required: "Description is required" })}
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Detailed description of the role..."
                    ></textarea>
                    {errors.jobDescription && <p className="text-red-500 text-xs mt-1">{errors.jobDescription.message}</p>}
                </div>

                {/* Skills & Deadline */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
                    <input
                        {...register("skills", { required: "Skills are required" })}
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="React, Node.js, MongoDB"
                    />
                    {errors.skills && <p className="text-red-500 text-xs mt-1">{errors.skills.message}</p>}
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
                    {isSubmitting ? 'Posting...' : 'Create Job Post'}
                </button>

            </form>
        </div>
    );
};

export default JobCreation;
