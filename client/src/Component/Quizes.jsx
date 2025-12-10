import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { PlusCircle, List, Edit } from 'lucide-react';

// Reusable component for the sub-navigation buttons
const QuizNavButton = ({ to, icon: Icon, label, isActive }) => {
  const activeClasses = 'bg-indigo-600 text-white shadow-md';
  const inactiveClasses = 'bg-white text-slate-700 hover:bg-slate-100';

  return (
    <Link
      to={to}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </Link>
  );
};

const Quizes = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Logic to determine if a sub-navigation button is active
  const isSubRouteActive = (pathSegment) => {
    // Handle the index route (View All)
    if (pathSegment === '') {
      return currentPath.endsWith('/quizes') || currentPath.endsWith('/quizes/');
    }

    // Handle other routes
    return currentPath.startsWith(`/admin/quizes/${pathSegment}`);
  };

  return (
    <div className="flex flex-col space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 border-b pb-2">🎯 Quiz Management Console</h2>

      {/* Sub-Navigation for CRUD Actions */}
      <nav className="flex space-x-3 p-3 bg-gray-50 rounded-xl shadow-inner border border-gray-200">

        {/* 1. View All Quizzes (Index Route) */}
        <QuizNavButton
          to=""
          icon={List}
          label="View All Quizzes"
          isActive={isSubRouteActive('')}
        />

        {/* 2. Create Quiz */}
        <QuizNavButton
          to="create"
          icon={PlusCircle}
          label="Create New Quiz"
          isActive={isSubRouteActive('create')}
        />

        {/* 3. Update Quiz (Dynamic Route) */}
        <QuizNavButton
          to="update/1"
          icon={Edit}
          label="Update (Demo)"
          isActive={isSubRouteActive('update')}
        />
      </nav>

      {/* THIS IS WHERE THE NESTED CRUD COMPONENTS ARE RENDERED */}
      <div className="mt-4 p-6 bg-white rounded-xl shadow-lg border border-gray-100 min-h-[400px]">
        <Outlet />
      </div>
    </div>
  );
};

export default Quizes;

