import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import AuthLayout from "../Layouts/AuthLayout";
import { AdminDashLayout } from "../Layouts/AdminLayout";
import { UserDashLayout } from "../Layouts/UserLayout";

// Auth Pages
import { UserSignup } from "../pages/UserSignup";
import { UserLogin } from "../pages/UserLogin";
import { AdminSignup } from "../pages/AdminSignup";
import { AdminLogin } from "../pages/AdminLogin";

// Admin Components
import AdminAbout from "../Component/AdminAbout";
import Jobs from "../Component/Jobs";
import Quizes from "../Component/Quizes";
import AdminChat from "../Component/AdminChat";

// User Components
import UserAbout from "../Component/UserAbout";
import UserChat from "../Component/UserChat";
import UserJobs from "../Component/UserJobs";

import JobCreation from "../JobCrud/JobCreation";
import JobViewAll from "../JobCrud/JobViewAll";
import JobDetails from "../JobCrud/JobDetails";
import JobUpdate from "../JobCrud/JobUpdate"

export const Routeconfig = () => {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/user/login" replace />} />

      {/* ---------------- User Auth Routes ---------------- */}
      <Route path="/user" element={<AuthLayout type="user" />}>
        <Route index element={<Navigate to="signup" replace />} />
        <Route path="signup" element={<UserSignup />} />
        <Route path="login" element={<UserLogin />} />
      </Route>

      {/* ---------------- Admin Auth Routes ---------------- */}
      <Route path="/admin" element={<AuthLayout type="admin" />}>
        <Route index element={<Navigate to="signup" replace />} />
        <Route path="signup" element={<AdminSignup />} />
        <Route path="login" element={<AdminLogin />} />


      </Route>

      {/* ---------------- User Protected Routes ---------------- */}
      <Route path="/user" element={<UserDashLayout />}>
        {/* Redirect 'dashboard' and index to 'profile' or just have 'profile' */}
        <Route index element={<Navigate to="profile" replace />} />
        <Route path="profile" element={<UserAbout />} />
        <Route path="jobs" element={<UserJobs />} />
        <Route path="quizes" element={<Quizes />} />
        <Route path="chatroom" element={<UserChat />} />
      </Route>

      {/* ---------------- Admin Protected Routes ---------------- */}
      <Route path="/admin" element={<AdminDashLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminAbout />} />
        {/* Removed redundant 'about' route */}
        <Route path="quizes" element={<Quizes />} />
        <Route path="chatroom" element={<AdminChat />} />


        <Route path="jobs" element={<Jobs />} >
          <Route index element={<JobViewAll />} />
          <Route path="create" element={<JobCreation />} />
          <Route path="view/:jobId" element={<JobDetails />} />
          <Route path="update/:jobId" element={<JobUpdate />} />
        </Route>



        {/*  <Route path="jobs/createjob" element={<CreateJobLayout/>}></Route>
        <Route path="jobs/viewjob" element={<ViewCreateJobLayout/>}></Route> */}
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
