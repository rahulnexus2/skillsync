import React, { useEffect, useState } from 'react';
import { Briefcase, MapPin, Building, Calendar, Edit, Trash2, Plus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const JobViewAll = ({ isAdmin = true }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Determine if we are in admin mode based on URL if prop not strictly passed
  const isActuallyAdmin = isAdmin || location.pathname.includes('/admin');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/admin/viewjob');
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();
      setJobs(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/v1/admin/deletejob/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setJobs(jobs.filter(job => job._id !== id));
      } else {
        alert('Failed to delete job');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting job');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (error) return (
    <div className="text-center text-red-500 p-8 bg-red-50 rounded-lg">
      <p className="font-medium">Error loading jobs: {error}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">
          {jobs.length} Active Job Openings
        </h2>
        {isActuallyAdmin && (
          <Link
            to="/admin/jobs/create"
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <Plus size={18} />
            <span>Post Job</span>
          </Link>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <div key={job._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition border border-slate-100 flex flex-col">
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <Briefcase size={24} />
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${job.jobType === 'fulltime' ? 'bg-green-100 text-green-700' :
                    job.jobType === 'parttime' ? 'bg-blue-100 text-blue-700' :
                      'bg-purple-100 text-purple-700'
                  }`}>
                  {job.jobType}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-1">{job.jobTitle}</h3>
              <p className="text-slate-500 font-medium text-sm flex items-center mb-4">
                <Building size={14} className="mr-1" /> {job.company}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-slate-600 text-sm">
                  <MapPin size={16} className="mr-2 text-slate-400" />
                  {job.location}
                </div>
                <div className="flex items-center text-slate-600 text-sm">
                  <Calendar size={16} className="mr-2 text-slate-400" />
                  Apply by: {new Date(job.deadline).toLocaleDateString()}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {job.skills && job.skills.slice(0, 3).map((skill, idx) => (
                  <span key={idx} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex justify-between items-center">
              {/* Adjust detail link based on user type */}
              <Link
                to={isActuallyAdmin ? `/admin/jobs/view/${job._id}` : `/user/jobs/view/${job._id}`}
                className="text-indigo-600 font-medium text-sm hover:underline"
              >
                View Details
              </Link>

              {isActuallyAdmin && (
                <div className="flex space-x-2">
                  <Link to={`/admin/jobs/update/${job._id}`} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition">
                    <Edit size={16} />
                  </Link>
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {jobs.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500">
            No jobs found.
          </div>
        )}
      </div>
    </div>
  );
};

export default JobViewAll;
