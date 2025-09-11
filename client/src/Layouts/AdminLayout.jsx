import { Outlet, Link } from 'react-router-dom';
import React from 'react';
import { FaUser, FaBriefcase, FaQuestionCircle, FaComments } from 'react-icons/fa';

const AdminDashLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Nav */}
      <header className="bg-white shadow p-6 flex flex-col items-center justify-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-blue-600">
          SkillSync
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-500 mt-2">
          Get Hired
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-4 sm:p-6 md:p-8">
        <Outlet />
      </main>

      {/* Bottom Nav */}
      <nav className="bg-white shadow-inner p-2 sm:p-4 flex justify-between md:justify-between lg:justify-between">
        <Link
          to="/admin/profile"
          className="flex flex-col items-center text-gray-700 hover:text-blue-500 text-xs sm:text-sm md:text-base"
        >
          <FaUser className="text-xl sm:text-2xl md:text-3xl" />
          <span className="mt-1">Profile</span>
        </Link>
        <Link
          to="/admin/jobs"
          className="flex flex-col items-center text-gray-700 hover:text-blue-500 text-xs sm:text-sm md:text-base"
        >
          <FaBriefcase className="text-xl sm:text-2xl md:text-3xl" />
          <span className="mt-1">Jobs</span>
        </Link>
        <Link
          to="/admin/quizes"
          className="flex flex-col items-center text-gray-700 hover:text-blue-500 text-xs sm:text-sm md:text-base"
        >
          <FaQuestionCircle className="text-xl sm:text-2xl md:text-3xl" />
          <span className="mt-1">Quizzes</span>
        </Link>
        <Link
          to="/admin/chatroom"
          className="flex flex-col items-center text-gray-700 hover:text-blue-500 text-xs sm:text-sm md:text-base"
        >
          <FaComments className="text-xl sm:text-2xl md:text-3xl" />
          <span className="mt-1">Chatroom</span>
        </Link>
      </nav>
    </div>
  );
};

export default AdminDashLayout;
