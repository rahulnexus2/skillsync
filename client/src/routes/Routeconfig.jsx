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

import JobCreation from "../JobCrud/JobCreation";
import JobViewAll from "../JobCrud/JobViewAll";
import JobDetails from "../JobCrud/JobDetails";
import JobUpdate from "../JobCrud/JobUpdate"

// Quiz CRUD Components (Admin)
import QuizCreation from "../QuizCrud/QuizCreation";
import QuizViewAll from "../QuizCrud/QuizViewAll";
import QuizDetails from "../QuizCrud/QuizDetails";
import QuizUpdate from "../QuizCrud/QuizUpdate";

// User Quiz Components
import QuizList from "../UserQuiz/QuizList";
import QuizTake from "../UserQuiz/QuizTake";
import QuizResult from "../UserQuiz/QuizResult";
import QuizHistory from "../UserQuiz/QuizHistory";

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
        <Route path="dashboard" element={<UserAbout />} /> {/* Replace with actual Dashboard Component */}
        <Route path="profile" element={<UserAbout />} /> {/* Replace with Profile Component */}
        <Route path="jobs" element={<Jobs />}>
          <Route index element={<JobViewAll isAdmin={false} />} />
          <Route path="view/:id" element={<JobDetails />} />
        </Route>
        <Route path="quizes" element={<QuizList />} />
        <Route path="quizes/take/:quizId" element={<QuizTake />} />
        <Route path="quizes/result/:attemptId" element={<QuizResult />} />
        <Route path="quizes/history" element={<QuizHistory />} />
        <Route path="chatroom" element={<UserChat />} />
      </Route>

      {/* ---------------- Admin Protected Routes ---------------- */}
      <Route path="/admin" element={<AdminDashLayout />}>
        <Route path="dashboard" element={<AdminAbout />} /> {/* Replace with actual Dashboard Component */}
        <Route path="about" element={<AdminAbout />} />

        {/* Quiz Routes (Nested) */}
        <Route path="quizes" element={<Quizes />}>
          <Route index element={<QuizViewAll />} />
          <Route path="create" element={<QuizCreation />} />
          <Route path="view/:quizId" element={<QuizDetails />} />
          <Route path="update/:quizId" element={<QuizUpdate />} />
        </Route>

        <Route path="chatroom" element={<AdminChat />} />

        {/* Job Routes (Nested) */}
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
