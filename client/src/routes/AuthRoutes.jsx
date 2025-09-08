import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";


import { UserSignup } from "../pages/UserSignup";
import { UserLogin } from "../pages/UserLogin";


import { AdminSignup } from "../pages/AdminSignup";
import { AdminLogin } from "../pages/AdminLogin";

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/users" replace />} />

    
      <Route path="/users" element={<AuthLayout type="user" />}>
        <Route index element={<Navigate to="signup" replace />} />
        <Route path="signup" element={<UserSignup />} />
        <Route path="login" element={<UserLogin />} />
      </Route>

      
      <Route path="/admin" element={<AuthLayout type="admin" />}>
        <Route index element={<Navigate to="signup" replace />} />
        <Route path="signup" element={<AdminSignup />} />
        <Route path="login" element={<AdminLogin />} />
      </Route>
    </Routes>
  );
};
