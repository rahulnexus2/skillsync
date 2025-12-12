import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Briefcase, MapPin, Building, Calendar, ArrowLeft } from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  // Check if user is viewing via admin route or user route based on URL 
  // This is simple hack, robust way is context or props.
  const isAdmin = window.location.pathname.includes('/admin');
  const backLink = isAdmin ? '/admin/jobs' : '/user/jobs';

  useEffect(() => {
    const fetchJob = async () => {
      try {
        // Fetch all and find (since no specific ID endpoint used in viewJob.js)
        const response = await fetch('http://localhost:8000/api/v1/admin/viewjob');
        const data = await response.json();
        const foundJob = data.find(j => j._id === id);
        setJob(foundJob);
      } catch (err) {
        console.error(err);
      }
    };
    fetchJob();
  }, [id]);

  if (!job) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <Link to={backLink} className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-6 transition">
        <ArrowLeft size={20} className="mr-2" /> Back to Jobs
      </Link>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-indigo-600 p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">{job.jobTitle}</h1>
          <div className="flex flex-wrap gap-4 text-indigo-100">
            <span className="flex items-center"><Building size={18} className="mr-2" /> {job.company}</span>
            <span className="flex items-center"><MapPin size={18} className="mr-2" /> {job.location}</span>
            <span className="bg-indigo-500 px-3 py-1 rounded-full text-sm font-semibold">{job.jobType}</span>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Job Description</h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{job.jobDescription}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span key={index} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">Details</h3>
              <div className="space-y-2 text-slate-600">
                <p className="flex items-center"><Briefcase size={18} className="mr-2 text-slate-400" /> Role: {job.jobPost}</p>
                <p className="flex items-center"><Calendar size={18} className="mr-2 text-slate-400" /> Apply By: {new Date(job.deadline).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {!isAdmin && (
            <div className="border-t pt-8 text-center">
              <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-indigo-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Apply Now
              </button>
              <p className="text-slate-400 text-sm mt-3">Application happens externally or via email.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default JobDetails;
