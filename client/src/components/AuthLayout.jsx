import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Users, Shield, ChevronLeft } from "lucide-react";

const AuthLayout = ({ type }) => {
  const location = useLocation();
  const isUser = type === "user";
  const basePath = isUser ? "/users" : "/admin";
  const isSignup = location.pathname.includes('signup');
  
  // Configuration for different portal types
  const config = {
    user: {
      title: 'Welcome Back',
      subtitle: 'Sign in to your account',
      signupTitle: 'Create Account',
      signupSubtitle: 'Join our community today',
      icon: Users,
      bgGradient: 'from-blue-600 to-purple-700',
      accentColor: 'blue',
      primaryColor: 'blue-600',
      hoverColor: 'blue-700',
      borderColor: 'blue-500',
      bgColor: 'blue-50',
    },
    admin: {
      title: 'Admin Portal',
      subtitle: 'Access your dashboard',
      signupTitle: 'Admin Registration',
      signupSubtitle: 'Create your admin account',
      icon: Shield,
      bgGradient: 'from-emerald-600 to-teal-700',
      accentColor: 'emerald',
      primaryColor: 'emerald-600',
      hoverColor: 'emerald-700',
      borderColor: 'emerald-500',
      bgColor: 'emerald-50',
    },
  };

  const currentConfig = config[type];
  const IconComponent = currentConfig.icon;

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
          <div className={`bg-gradient-to-r ${currentConfig.bgGradient} px-8 py-12 text-center`}>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {isSignup ? currentConfig.signupTitle : currentConfig.title}
            </h1>
            <p className="text-white/90">
              {isSignup ? currentConfig.signupSubtitle : currentConfig.subtitle}
            </p>
          </div>

          {/* Portal Type Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50">
            <Link
              to="/users/signup"
              className={`flex-1 px-6 py-3 text-center font-medium transition-all duration-200 ${
                isUser
                  ? "bg-white text-blue-600 border-b-2 border-blue-500 shadow-sm"
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              User Portal
            </Link>
            <Link
              to="/admin/signup"
              className={`flex-1 px-6 py-3 text-center font-medium transition-all duration-200 ${
                !isUser
                  ? "bg-white text-emerald-600 border-b-2 border-emerald-500 shadow-sm"
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              <Shield className="w-4 h-4 inline mr-2" />
              Admin Portal
            </Link>
          </div>

          {/* Auth Type Navigation Tabs */}
          <div className="flex border-b border-slate-200">
            <Link
              to={`${basePath}/signup`}
              className={`flex-1 px-6 py-4 text-center font-medium transition-all duration-200 ${
                isSignup
                  ? `text-${currentConfig.primaryColor} border-b-2 border-${currentConfig.borderColor} bg-${currentConfig.bgColor}/50`
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              Sign Up
            </Link>
            <Link
              to={`${basePath}/login`}
              className={`flex-1 px-6 py-4 text-center font-medium transition-all duration-200 ${
                !isSignup
                  ? `text-${currentConfig.primaryColor} border-b-2 border-${currentConfig.borderColor} bg-${currentConfig.bgColor}/50`
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              Sign In
            </Link>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <Outlet context={{ type, accentColor: currentConfig.accentColor }} />
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="text-center mt-6 text-sm text-slate-600">
          {type === 'user' ? (
            <>
              Need admin access?{' '}
              <Link to="/admin" className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                Admin Portal
              </Link>
            </>
          ) : (
            <>
              Regular user?{' '}
              <Link to="/users" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                User Portal
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;