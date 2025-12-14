import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User, Briefcase, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';

const AdminAbout = () => {
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const statsRes = await axios.get('http://localhost:8000/api/v1/admin/stats', { withCredentials: true });
      const appsRes = await axios.get('http://localhost:8000/api/v1/admin/applications', { withCredentials: true });
      setStats(statsRes.data);
      setApplications(appsRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load data');
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`http://localhost:8000/api/v1/admin/application/${id}`, { status }, { withCredentials: true });
      // Optimistic update or refetch
      setApplications(prev => prev.map(app => app._id === id ? { ...app, status } : app));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-8">
      {/* Header / Profile Section */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
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
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-800">{stats?.admin?.username}</h1>
          <p className="text-gray-500">{stats?.admin?.email}</p>
          <div className="mt-2 flex items-center justify-center md:justify-start space-x-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold tracking-wide uppercase">Admin</span>
          </div>
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
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold">
                          {app.userId?.name ? app.userId.name.charAt(0) : 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{app.userId?.name || 'Unknown User'}</p>
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
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {app.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(app._id, 'accepted')}
                            className="text-green-600 hover:text-green-800 p-1 hover:bg-green-100 rounded"
                            title="Accept"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(app._id, 'rejected')}
                            className="text-red-600 hover:text-red-800 p-1 hover:bg-red-100 rounded"
                            title="Reject"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default AdminAbout

