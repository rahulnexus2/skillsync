import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Phone, Book, Code, Edit, Trophy, Briefcase, Play, ExternalLink, XCircle } from 'lucide-react';

const UserAbout = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    education: '',
    skills: '',
    projects: []
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get("http://localhost:8000/api/v1/users/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
      setFormData({
        phone: res.data.user.phone || '',
        education: res.data.user.education || '',
        skills: res.data.user.skills ? res.data.user.skills.join(', ') : '',
        projects: res.data.user.projects || []
      });
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);

      await axios.put("http://localhost:8000/api/v1/users/profile", {
        ...formData,
        skills: skillsArray
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setEditMode(false);
      fetchProfile(); // Refresh
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Failed to update profile");
    }
  };

  const handleAddProject = () => {
    setFormData({
      ...formData,
      projects: [...formData.projects, { name: '', description: '', link: '' }]
    });
  };

  const handleProjectChange = (index, field, value) => {
    const updatedProjects = [...formData.projects];
    updatedProjects[index][field] = value;
    setFormData({ ...formData, projects: updatedProjects });
  };

  const handleRemoveProject = (index) => {
    const updatedProjects = formData.projects.filter((_, i) => i !== index);
    setFormData({ ...formData, projects: updatedProjects });
  };

  if (loading) return <div className="p-10 text-center">Loading Profile...</div>;
  if (!profile) return <div className="p-10 text-center text-red-500">Error loading profile data</div>;

  const { user, stats, applications } = profile;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Top Section: Profile Card & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 1. Profile Info Card */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-100 p-4 md:p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <User className="w-6 h-6 mr-2 text-indigo-600" />
              Personal Info
            </h2>
            <button
              onClick={() => setEditMode(!editMode)}
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Edit Profile"
            >
              <Edit className="w-5 h-5" />
            </button>
          </div>

          {!editMode ? (
            <div className="space-y-4">
              {/* Basic Info */}
              <div className="flex items-center space-x-3 text-gray-600">
                <span className="font-semibold w-24">Name:</span>
                <span className="text-gray-900">{user.username}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Mail className="w-4 h-4" />
                <span className="font-semibold w-20">Email:</span>
                <span className="text-gray-900">{user.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Phone className="w-4 h-4" />
                <span className="font-semibold w-20">Phone:</span>
                <span className="text-gray-900">{user.phone || 'Not Set'}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Book className="w-4 h-4" />
                <span className="font-semibold w-20">Education:</span>
                <span className="text-gray-900">{user.education || 'Not Set'}</span>
              </div>

              {/* Skills Display */}
              <div className="flex flex-wrap gap-2 pt-2">
                <div className="flex items-center w-full text-gray-600 mb-1">
                  <Code className="w-4 h-4 mr-2" />
                  <span className="font-semibold">Skills:</span>
                </div>
                {user.skills && user.skills.length > 0 ? (
                  user.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 italic">No skills listed</span>
                )}
              </div>

              {/* Projects Display */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center text-gray-600 mb-3">
                  <Briefcase className="w-4 h-4 mr-2" />
                  <span className="font-semibold text-lg">Projects</span>
                </div>
                {user.projects && user.projects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.projects.map((proj, i) => (
                      <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <h4 className="font-bold text-gray-800 flex justify-between items-start">
                          {proj.name}
                          {proj.link && (
                            <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:text-indigo-700">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic text-sm">No projects added yet.</p>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="+1 234 567 890"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                <input
                  type="text"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="University / Degree"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="React, Node.js, Python..."
                />
              </div>

              {/* Projects Edit Section */}
              <div className="pt-4 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-3">Projects</label>
                {formData.projects.map((proj, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-3 relative">
                    <button
                      type="button"
                      onClick={() => handleRemoveProject(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      title="Remove Project"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                    <div className="grid grid-cols-1 gap-3">
                      <input
                        type="text"
                        placeholder="Project Name"
                        value={proj.name}
                        onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-indigo-500 text-sm"
                        required
                      />
                      <textarea
                        placeholder="Description (max 200 chars)"
                        value={proj.description}
                        onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-indigo-500 text-sm h-20 resize-none"
                        required
                      />
                      <input
                        type="url"
                        placeholder="Project Link (User Hosted)"
                        value={proj.link}
                        onChange={(e) => handleProjectChange(index, 'link', e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-indigo-500 text-sm"
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddProject}
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                >
                  + Add Project
                </button>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>

        {/* 2. Stats Card */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-4 md:p-6 text-white flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold flex items-center mb-4 text-indigo-50">
              <Trophy className="w-5 h-5 mr-2" />
              Performance Stats
            </h3>
            <div className="space-y-6">
              <div className="text-center bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <span className="block text-4xl font-extrabold">{stats.totalScore}</span>
                <span className="text-indigo-100 text-sm">Total Quiz Score</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center bg-white/10 rounded-lg p-3">
                  <span className="block text-2xl font-bold">{stats.quizzesTaken}</span>
                  <span className="text-xs text-indigo-100">Quizzes Taken</span>
                </div>
                <div className="text-center bg-white/10 rounded-lg p-3">
                  <span className="block text-2xl font-bold">{stats.averagePercentage}%</span>
                  <span className="text-xs text-indigo-100">Avg. Score</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Job Applications */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Briefcase className="w-6 h-6 mr-2 text-indigo-600" />
            Job Applications
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600">Company</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Job Title</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Applied Date</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applications.length > 0 ? (
                applications.map(app => (
                  <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {app.jobId ? app.jobId.company : 'Deleted Job'}
                    </td>
                    <td className="px-6 py-4 text-gray-800">
                      {app.jobId ? app.jobId.jobTitle : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide 
                                                ${app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'}`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <ExternalLink className="w-12 h-12 text-gray-300 mb-3" />
                      <p>You haven't applied for any jobs yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserAbout;
