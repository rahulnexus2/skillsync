import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import {
  Briefcase, Users, User, Mail, Phone, BookOpen,
  Code, FolderGit2, ExternalLink, X, CheckCircle, XCircle
} from "lucide-react";

const AdminAbout = () => {
  const [applications, setApplications] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);

  const getConfig = () => {
    const token = localStorage.getItem("adminToken");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [appsRes, statsRes] = await Promise.all([
        axiosInstance.get("/admin/applications", getConfig()),
        axiosInstance.get("/admin/stats", getConfig()),
      ]);
      setApplications(appsRes.data);
      setAdminStats(statsRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axiosInstance.put(`/admin/application/${id}`, { status }, getConfig());
      setApplications((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status } : app))
      );
      if (selectedApp?._id === id) {
        setSelectedApp((prev) => ({ ...prev, status }));
      }
    } catch (error) {
      alert("Failed to update status");
    }
  };

  if (loading)
    return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

  if (error)
    return <div className="p-8 text-center text-red-500">{error}</div>;

  const pendingCount = applications.filter((a) => a.status === "pending").length;
  const acceptedCount = applications.filter((a) => a.status === "accepted").length;
  const rejectedCount = applications.filter((a) => a.status === "rejected").length;

  return (
    <div className="space-y-8 p-6">

      {/* Admin Info Card */}
      {adminStats && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold uppercase">
              {adminStats.admin?.username?.[0] || "A"}
            </div>
            <div>
              <h1 className="text-2xl font-bold capitalize">{adminStats.admin?.username}</h1>
              <p className="text-white/80 text-sm">{adminStats.admin?.email}</p>
              {adminStats.admin?.phoneNumber && (
                <p className="text-white/70 text-sm">{adminStats.admin.phoneNumber}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Briefcase className="text-indigo-600" size={22} />}
          label="Jobs Posted"
          value={adminStats?.stats?.jobsPosted ?? 0}
          bg="bg-indigo-50"
        />
        <StatCard
          icon={<Users className="text-yellow-600" size={22} />}
          label="Pending"
          value={pendingCount}
          bg="bg-yellow-50"
        />
        <StatCard
          icon={<CheckCircle className="text-green-600" size={22} />}
          label="Accepted"
          value={acceptedCount}
          bg="bg-green-50"
        />
        <StatCard
          icon={<XCircle className="text-red-500" size={22} />}
          label="Rejected"
          value={rejectedCount}
          bg="bg-red-50"
        />
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Job Applications</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="p-4">Candidate</th>
                <th className="p-4">Job</th>
                <th className="p-4">Applied At</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">
                    No applications yet.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <p className="font-medium capitalize">{app.userId?.username || "Unknown"}</p>
                      <p className="text-xs text-gray-500">{app.userId?.email}</p>
                    </td>
                    <td className="p-4 text-sm">{app.jobId?.jobTitle || "N/A"}</td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded text-xs hover:bg-indigo-100 transition"
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-bold text-gray-800">Applicant Profile</h3>
              <button onClick={() => setSelectedApp(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">

              {/* Basic Info */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl uppercase">
                  {selectedApp.userId?.username?.[0] || "U"}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 capitalize text-lg">
                    {selectedApp.userId?.username}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Mail size={13} /> {selectedApp.userId?.email}
                  </p>
                  {selectedApp.userId?.phone && (
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Phone size={13} /> {selectedApp.userId.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Applied For */}
              <div className="bg-indigo-50 rounded-lg p-3 flex items-center gap-2">
                <Briefcase size={16} className="text-indigo-600" />
                <span className="text-sm text-indigo-700 font-medium">
                  Applied for: {selectedApp.jobId?.jobTitle} — {selectedApp.jobId?.company}
                </span>
              </div>

              {/* Education */}
              {selectedApp.userId?.education && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1 mb-1">
                    <BookOpen size={15} /> Education
                  </h4>
                  <p className="text-sm text-gray-600">{selectedApp.userId.education}</p>
                </div>
              )}

              {/* Skills */}
              {selectedApp.userId?.skills?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1 mb-2">
                    <Code size={15} /> Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedApp.userId.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {selectedApp.userId?.projects?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1 mb-2">
                    <FolderGit2 size={15} /> Projects
                  </h4>
                  <div className="space-y-2">
                    {selectedApp.userId.projects.map((project, i) => (
                      <div key={i} className="border border-gray-100 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm text-gray-800">{project.name}</p>
                          {project.link && (
                            <a href={project.link} target="_blank" rel="noreferrer"
                              className="text-indigo-500 hover:text-indigo-700">
                              <ExternalLink size={14} />
                            </a>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{project.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Current Status */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 font-medium">Current Status:</span>
                <StatusBadge status={selectedApp.status} />
              </div>

              {/* Accept / Reject Buttons */}
              {selectedApp.status === "pending" && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => handleStatusUpdate(selectedApp._id, "rejected")}
                    className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedApp._id, "accepted")}
                    className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                  >
                    Accept
                  </button>
                </div>
              )}

              {selectedApp.status !== "pending" && (
                <div className="flex gap-3 pt-2">
                  {selectedApp.status === "accepted" && (
                    <button
                      onClick={() => handleStatusUpdate(selectedApp._id, "rejected")}
                      className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition"
                    >
                      Change to Rejected
                    </button>
                  )}
                  {selectedApp.status === "rejected" && (
                    <button
                      onClick={() => handleStatusUpdate(selectedApp._id, "accepted")}
                      className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                    >
                      Change to Accepted
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value, bg }) => (
  <div className={`${bg} rounded-xl p-4 flex items-center gap-3`}>
    <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
    <div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  </div>
);

const StatusBadge = ({ status }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
    status === "accepted" ? "bg-green-100 text-green-700"
    : status === "rejected" ? "bg-red-100 text-red-700"
    : "bg-yellow-100 text-yellow-700"
  }`}>
    {status}
  </span>
);

export default AdminAbout;