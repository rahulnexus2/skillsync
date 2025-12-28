import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Briefcase, MapPin, Calendar, Trash2, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

const JobViewAll = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/v1/admin/viewjob', { withCredentials: true });
            setJobs(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleDelete = async (jobId) => {
        if (!window.confirm("Are you sure you want to delete this job?")) return;

        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`http://localhost:8000/api/v1/admin/deletejob/${jobId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });
            setJobs(prev => prev.filter(job => job._id !== jobId));
            alert("Job deleted successfully");
        } catch (err) {
            console.error(err);
            alert("Failed to delete job");
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading jobs...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Manage Jobs</h2>
            <div className="grid grid-cols-1 gap-4">
                {jobs.map((job) => (
                    <div key={job._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-center transition-hover hover:bg-gray-50">
                        <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-xl font-bold text-gray-800">{job.jobTitle}</h3>
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full uppercase">
                                    {job.jobType}
                                </span>
                            </div>
                            <p className="text-gray-500 font-medium">{job.company}</p>
                            <div className="flex items-center text-gray-500 text-sm mt-2 space-x-4">
                                <div className="flex items-center space-x-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>{job.location}</span>
                                </div>
                                {job.deadline && (
                                    <div className="flex items-center space-x-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date(job.deadline).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex space-x-3 mt-4 md:mt-0">

                            <Link
                                to={`update/${job._id}`}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            >
                                <Edit className="w-4 h-4" />
                                <span>Edit</span>
                            </Link>
                            <button
                                onClick={() => handleDelete(job._id)}
                                className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JobViewAll;
