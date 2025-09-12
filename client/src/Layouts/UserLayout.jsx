import { Outlet, Link, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { User, Briefcase, HelpCircle, MessageCircle, Menu, X, Sparkles } from 'lucide-react';

// Reusable Navigation Item (handles Profile too)
const NavItem = ({ to, icon: Icon, label, isActive, mobile = false, onClick }) => {
  const baseClasses = mobile
    ? 'flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02]'
    : 'group flex items-center space-x-3 px-6 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105';

  const activeClasses = mobile
    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
    : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25';

  const inactiveClasses = mobile
    ? 'text-slate-600 hover:bg-white/70 hover:text-slate-800 hover:shadow-md'
    : 'text-slate-600 hover:bg-white/70 hover:text-slate-800 hover:shadow-lg hover:shadow-slate-200/50';

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      <Icon
        className={`w-${mobile ? 6 : 5} h-${mobile ? 6 : 5} transition-transform duration-200 ${
          isActive && !mobile ? 'text-white' : ''
        }`}
      />
      <span className={`${mobile ? 'font-semibold text-lg' : 'font-semibold'}`}>{label}</span>
    </Link>
  );
};

export const UserDashLayout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(location.pathname || '/user/profile');

  const navItems = [
    { to: '/user/jobs', icon: Briefcase, label: 'Jobs' },
    { to: '/user/quizes', icon: HelpCircle, label: 'Quizzes' },
    { to: '/user/chatroom', icon: MessageCircle, label: 'Chatroom' }
  ];

  const handleNavClick = (to) => setActiveItem(to);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveItem(location.pathname); // update active item on route change
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-300/10 to-indigo-300/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-md shadow-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  SkillSync
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-slate-600 font-medium tracking-wide">Get Hired</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              {/* Profile NavItem */}
              <NavItem
                to="/user/profile"
                icon={User}
                label="Profile"
                isActive={activeItem === '/user/profile'}
                onClick={() => handleNavClick('/user/profile')}
              />
              {navItems.map((item) => (
                <NavItem
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  isActive={activeItem === item.to}
                  onClick={() => handleNavClick(item.to)}
                />
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-3 rounded-xl text-slate-600 hover:bg-white/70 hover:text-slate-800 transition-all duration-200 transform hover:scale-105"
              aria-label="Toggle Mobile Menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Dropdown */}
          <div
            className={`md:hidden transition-all duration-500 ease-in-out ${
              isMobileMenuOpen ? 'max-h-80 opacity-100 pb-6' : 'max-h-0 opacity-0'
            } overflow-hidden`}
          >
            <nav className="space-y-3 pt-4">
              <NavItem
                to="/user/profile"
                icon={User}
                label="Profile"
                isActive={activeItem === '/user/profile'}
                onClick={() => handleNavClick('/user/profile')}
                mobile
              />
              {navItems.map((item) => (
                <NavItem
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  isActive={activeItem === item.to}
                  onClick={() => handleNavClick(item.to)}
                  mobile
                />
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 min-h-[600px] p-6 lg:p-10 transform hover:shadow-3xl transition-all duration-300">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden relative z-10 bg-white/90 backdrop-blur-md shadow-2xl border-t border-white/30">
        <div className="flex justify-around py-2">
          <NavItem
            to="/user/profile"
            icon={User}
            label="Profile"
            isActive={activeItem === '/user/profile'}
            onClick={() => handleNavClick('/user/profile')}
            mobile
          />
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isActive={activeItem === item.to}
              onClick={() => handleNavClick(item.to)}
              mobile
            />
          ))}
        </div>
      </nav>

      {/* Floating Decorative Elements */}
      <div className="fixed top-24 left-6 w-2 h-2 bg-blue-400/40 rounded-full animate-pulse"></div>
      <div className="fixed top-48 right-10 w-3 h-3 bg-indigo-400/30 rounded-full animate-pulse delay-1000"></div>
      <div className="fixed bottom-40 left-12 w-1 h-1 bg-purple-400/50 rounded-full animate-pulse delay-500"></div>
      <div className="fixed top-1/3 right-6 w-2 h-2 bg-blue-300/40 rounded-full animate-pulse delay-700"></div>
    </div>
  );
};
