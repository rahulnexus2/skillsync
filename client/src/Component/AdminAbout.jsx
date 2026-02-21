import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import {
  User,
  Briefcase,
  XCircle,
  ExternalLink,
  Clock,
} from "lucide-react";

const AdminAbout = () => {
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    phoneNumber: "",
  });

  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const getConfig = () => {
    const token = localStorage.getItem("adminToken");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchData = async () => {
    try {
      const statsRes = await axiosInstance.get(
        "/admin/stats",
        getConfig()
      );

      const appsRes = await axiosInstance.get(
        "/admin/applications",
        getConfig()
      );

      setStats(statsRes.data);
      setApplications(appsRes.data);

      setFormData({
        username: statsRes.data?.admin?.username || "",
        phoneNumber: statsRes.data?.admin?.phoneNumber || "",
      });

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load data");
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.put(
        "/admin/update-profile",
        formData,
        getConfig()
      );

      setStats((prev) => ({
        ...prev,
        admin: res.data.admin,
      }));

      setIsEditing(false);
      alert("Profile updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axiosInstance.put(
        `/admin/application/${id}`,
        { status },
        getConfig()
      );

      setApplications((prev) =>
        prev.map((app) =>
          app._id === id ? { ...app, status } : app
        )
      );

      if (selectedApp && selectedApp._id === id) {
        setSelectedApp((prev) => ({ ...prev, status }));
      }
    } catch (error) {
      alert("Failed to update status");
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">
        Loading profile...
      </div>
    );

  if (error)
    return (
      <div className="p-8 text-center text-red-500">
        {error}
      </div>
    );

  return (
    <div className="space-y-8">

      {/* ================= PROFILE SECTION ================= */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:space-x-8 space-y-4 md:space-y-0">

        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold uppercase">
          {stats?.admin?.username?.charAt(0) || "A"}
        </div>

        <div className="flex-1 text-center md:text-left">
          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-3">
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="border px-3 py-2 rounded w-full text-sm"
                placeholder="Username"
              />

              <input
                type="text"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phoneNumber: e.target.value,
                  })
                }
                className="border px-3 py-2 rounded w-full text-sm"
                placeholder="Phone Number"
              />

              <div className="space-x-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-1 rounded text-sm"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-200 px-4 py-1 rounded text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">
                  {stats?.admin?.username}
                </h1>

                <button
                  onClick={() => setIsEditing(true)}
                  className="text-blue-600 text-sm underline"
                >
                  Edit Profile
                </button>
              </div>

              <p className="text-gray-500">
                {stats?.admin?.email}
              </p>

              <p className="text-gray-500">
                {stats?.admin?.phoneNumber || "No phone number"}
              </p>

              {stats?.admin?.createdAt && (
                <p className="flex items-center text-xs text-gray-400 mt-1">
                  <Clock className="w-3 h-3 mr-1" />
                  Joined{" "}
                  {new Date(
                    stats?.admin?.createdAt
                  ).toLocaleDateString()}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* ================= STATS SECTION ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">
                Jobs Posted
              </p>
              <h3 className="text-2xl font-bold">
                {stats?.stats?.jobsPosted || 0}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">
                Total Applicants
              </p>
              <h3 className="text-2xl font-bold">
                {applications.length}
              </h3>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminAbout;
