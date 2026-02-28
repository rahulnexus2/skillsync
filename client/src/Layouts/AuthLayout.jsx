import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Briefcase, ChevronLeft } from "lucide-react";

const AuthLayout = () => {
  const location = useLocation();
  const isSignup = location.pathname.includes("signup");
  const isForgot = location.pathname.includes("forgot");
  const isReset = location.pathname.includes("reset");

  const getTitle = () => {
    if (isSignup) return "Create Account";
    if (isForgot) return "Forgot Password";
    if (isReset) return "Reset Password";
    return "Welcome Back";
  };

  const getSubtitle = () => {
    if (isSignup) return "Join the Job Portal today";
    if (isForgot) return "We'll send you an OTP";
    if (isReset) return "Enter your OTP and new password";
    return "Sign in to your account";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back to home */}
        <Link
          to="/"
          className="inline-flex items-center text-slate-600 hover:text-slate-800 mb-8 transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Main Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-8 py-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">{getTitle()}</h1>
            <p className="text-white/90">{getSubtitle()}</p>
          </div>

          {/* Login / Signup Tabs (only show on login and signup pages) */}
          {!isForgot && !isReset && (
            <div className="flex border-b border-slate-200">
              <Link
                to="/signup"
                className={`flex-1 px-6 py-4 text-center font-medium transition-all duration-200 ${
                  isSignup
                    ? "text-indigo-600 border-b-2 border-indigo-500 bg-indigo-50/50"
                    : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className={`flex-1 px-6 py-4 text-center font-medium transition-all duration-200 ${
                  !isSignup
                    ? "text-indigo-600 border-b-2 border-indigo-500 bg-indigo-50/50"
                    : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                Sign In
              </Link>
            </div>
          )}

          {/* Form Content */}
          <div className="p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;