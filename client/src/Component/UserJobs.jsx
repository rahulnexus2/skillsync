import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Briefcase, MapPin, Calendar, ArrowRight, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            // Using admin route exposed publicly for listing (or we could make a user route)
            const res = await axios.get('http://localhost:8000/api/v1/admin/viewjob', { withCredentials: true });
            setJobs(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleApply = async (jobId) => {
        try {
            await axios.post(`http://localhost:8000/api/v1/users/apply/${jobId}`, {}, { withCredentials: true });
            alert('Applied successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to apply');
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading opportunities...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Available Opportunities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                    <div key={job._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                    <Briefcase className="w-6 h-6" />
                                </div>
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full uppercase">
                                    {job.jobType}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-1">{job.jobTitle}</h3>
                            <p className="text-gray-500 font-medium mb-3">{job.company}</p>

                            <div className="flex items-center text-gray-500 text-sm mb-4 space-x-4">
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
                            <p className="text-gray-600 text-sm line-clamp-3 mb-6">
                                {job.jobDescription}
                            </p>
                        </div>

                        <div className="space-y-3 mt-4">
                            {/* Link to Details if implemented, otherwise just apply */}
                            <button
                                onClick={() => handleApply(job._id)}
                                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all transform hover:scale-[1.02] flex items-center justify-center space-x-2"
                            >
                                <Send className="w-4 h-4" />
                                <span>Apply Now</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserJobs;
