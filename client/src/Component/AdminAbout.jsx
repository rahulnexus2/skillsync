import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { User, Briefcase, Mail, Plus, XCircle, CheckCircle, ExternalLink, FileText, Clock } from 'lucide-react';

const AdminAbout = () => {
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ username: '', phoneNumber: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: { Authorization: `Bearer ${token} ` }
      };

      const statsRes = await axiosInstance.get('/admin/stats', config);
      const appsRes = await axiosInstance.get('/admin/applications', config);
      setStats(statsRes.data);
      setFormData({
        username: statsRes.data?.admin?.username || '',
        phoneNumber: statsRes.data?.admin?.phoneNumber || ''
      });
      setApplications(appsRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load data');
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: { Authorization: `Bearer ${token} ` }
      };
      const res = await axiosInstance.put('/admin/update-profile', formData, config);
      setStats(prev => ({ ...prev, admin: res.data.admin }));
      setIsEditing(false);
      alert('Profile updated successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    }
  };

  const [selectedApp, setSelectedApp] = useState(null);

  const handleStatusUpdate = async (id, status) => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: { Authorization: `Bearer ${token} ` }
      };
      await axiosInstance.put(`/ admin / application / ${id} `, { status }, config);
      // Optimistic update or refetch
      setApplications(prev => prev.map(app => app._id === id ? { ...app, status } : app));
      if (selectedApp && selectedApp._id === id) {
        setSelectedApp(prev => ({ ...prev, status }));
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-8">
      {/* Header / Profile Section */}
      <div className="bg-white rounded-2xl p-4 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold uppercase shadow-lg">
            {stats?.admin?.profilePicture ? (
              <img src={stats.admin.profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              stats?.admin?.username?.charAt(0) || 'A'
            )}
          </div>
          <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
        </div>
        <div className="text-center md:text-left flex-1">
          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Phone Number</label>
                <input
                  type="text"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                />
              </div>
              <div className="flex space-x-2 mt-2">
                <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">Save</button>
                <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs hover:bg-gray-300">Cancel</button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex items-center justify-between md:justify-start md:space-x-4">
                <h1 className="text-3xl font-bold text-gray-800">{stats?.admin?.username}</h1>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  Edit Profile
                </button>
              </div>
              <p className="text-gray-500">{stats?.admin?.email}</p>
              <p className="text-gray-500">{stats?.admin?.phoneNumber || 'No phone number'}</p>
              <div className="mt-2 flex items-center justify-center md:justify-start space-x-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold tracking-wide uppercase">Admin</span>
                {stats?.admin?.createdAt && (
                  <span className="flex items-center text-xs text-gray-400">
                    <Clock className="w-3 h-3 mr-1" />
                    Joined {new Date(stats?.admin?.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-transform hover:scale-105">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Jobs Posted</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats?.stats?.jobsPosted || 0}</h3>
            </div>
          </div>
        </div>
        {/* Quiz Count */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-transform hover:scale-105">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Quizzes Created</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats?.stats?.quizzesCreated || 0}</h3>
            </div>
          </div>
        </div>
        {/* Total Applications (Computed from loaded apps) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-transform hover:scale-105">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Applicants</p>
              <h3 className="text-2xl font-bold text-gray-800">{applications.length}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Application Management */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Job Applications</h2>
          <span className="text-sm text-gray-500">{applications.length} pending reviews</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
              <tr>
                <th className="p-4 font-semibold">Candidate</th>
                <th className="p-4 font-semibold">Applying For</th>
                <th className="p-4 font-semibold">Applied At</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">No applications found.</td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold uppercase">
                          {app.userId?.username ? app.userId.username.charAt(0) : 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 capitalize">{app.userId?.username || 'Unknown User'}</p>
                          <p className="text-xs text-gray-500">{app.userId?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-gray-800 font-medium">{app.jobId?.jobTitle || 'Unknown Job'}</p>
                      <p className="text-xs text-gray-500">{app.jobId?.company}</p>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className={`inline - flex items - center px - 2.5 py - 0.5 rounded - full text - xs font - medium ${app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        } `}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded text-xs font-medium hover:bg-indigo-100"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Applicant Profile Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">Applicant Profile</h3>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Profile Header */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold uppercase">
                  {selectedApp.userId?.username ? selectedApp.userId.username.charAt(0) : 'U'}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 capitalize">{selectedApp.userId?.username || 'Unknown User'}</h2>
                  <p className="text-sm text-gray-500">{selectedApp.userId?.email}</p>
                  {selectedApp.userId?.phone && <p className="text-sm text-gray-500">{selectedApp.userId.phone}</p>}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Applied For</h4>
                  <p className="font-medium text-gray-800">{selectedApp.jobId?.jobTitle}</p>
                  <p className="text-sm text-gray-600">{selectedApp.jobId?.company}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Education</h4>
                  <p className="font-medium text-gray-800">{selectedApp.userId?.education || 'Not Specified'}</p>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedApp.userId?.skills?.length > 0 ? (
                    selectedApp.userId.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium border border-indigo-100">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm italic">No skills listed</span>
                  )}
                </div>
              </div>

              {/* Projects */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Projects</h4>
                {selectedApp.userId?.projects?.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {selectedApp.userId.projects.map((proj, i) => (
                      <div key={i} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <h5 className="font-bold text-gray-800 text-sm flex items-center justify-between">
                          {proj.name}
                          {proj.link && (
                            <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:text-indigo-700">
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </h5>
                        <p className="text-xs text-gray-600 mt-1">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm italic">No projects listed</p>
                )}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
              {selectedApp.status === 'pending' ? (
                <>
                  <button
                    onClick={() => { handleStatusUpdate(selectedApp._id, 'rejected'); setSelectedApp(null); }}
                    className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => { handleStatusUpdate(selectedApp._id, 'accepted'); setSelectedApp(null); }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    Accept Application
                  </button>
                </>
              ) : (
                <div className="flex items-center text-sm font-medium text-gray-500">
                  Application Status:
                  <span className={`ml - 2 px - 2 py - 0.5 rounded capitalize ${selectedApp.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} `}>
                    {selectedApp.status}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminAbout

