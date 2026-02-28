import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Landingpage } from "../pages/Landingpage";

// Layouts
import AuthLayout from "../Layouts/AuthLayout";
import { AdminDashLayout } from "../Layouts/AdminLayout";
import { UserDashLayout } from "../Layouts/UserLayout";

// Unified Auth Pages
import { Login } from "../pages/Login";
import { Signup } from "../pages/Signup";
import { ForgotPassword } from "../pages/ForgotPassword";
import { ResetPassword } from "../pages/ResetPassword";

// Admin Components
import AdminAbout from "../Component/AdminAbout";
import Jobs from "../Component/Jobs";
import AdminChat from "../Component/AdminChat";

// User Components
import UserAbout from "../Component/UserAbout";
import UserChat from "../Component/UserChat";
import ResumeScorer from "../Component/ResumeScorer";
import UserJobs from "../Component/UserJobs";
import JobUpdate from "../JobCrud/JobUpdate";
import JobViewAll from "../JobCrud/JobViewAll";
import JobCreation from "../JobCrud/JobCreation";
import JobDetails from "../JobCrud/JobDetails";

export const Routeconfig = () => {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Landingpage />} />

      {/* ---------------- Unified Auth Routes ---------------- */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* ---------------- User Protected Routes ---------------- */}
      <Route path="/user" element={<UserDashLayout />}>
        <Route index element={<Navigate to="profile" replace />} />
        <Route path="profile" element={<UserAbout />} />
        <Route path="jobs" element={<UserJobs />} />
        <Route path="chatroom" element={<UserChat />} />
        <Route path="resume-scorer" element={<ResumeScorer />} />
      </Route>

      {/* ---------------- Admin Protected Routes ---------------- */}
      <Route path="/admin" element={<AdminDashLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminAbout />} />
        <Route path="chatroom" element={<AdminChat />} />
        <Route path="jobs" element={<Jobs />}>
          <Route index element={<JobViewAll />} />
          <Route path="create" element={<JobCreation />} />
          <Route path="view/:jobId" element={<JobDetails />} />
          <Route path="update/:jobId" element={<JobUpdate />} />
        </Route>
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
