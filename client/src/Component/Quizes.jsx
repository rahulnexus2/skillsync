import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { PlusCircle, List, Edit } from 'lucide-react';

const QuizNavButton = ({ to, icon, label, isActive }) => {
  const Icon = icon;
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

  const isSubRouteActive = (pathSegment) => {
    if (pathSegment === '') {
      // Active only if the path ends exactly at /quizes or /quizes/
      return currentPath.endsWith('/quizes') || currentPath.endsWith('/quizes/');
    }
    return currentPath.includes(pathSegment);
  };

  return (
    <div className="flex flex-col space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 border-b pb-2">📚 Quiz Management</h2>

      {/* Sub-Navigation for CRUD Actions */}
      <nav className="flex space-x-3 p-3 bg-gray-50 rounded-xl shadow-inner border border-gray-200">

        <QuizNavButton
          to=""
          icon={List}
          label="All Quizzes"
          isActive={isSubRouteActive('') && !isSubRouteActive('create') && !isSubRouteActive('update') && !isSubRouteActive('view')}
        />

        <QuizNavButton
          to="create"
          icon={PlusCircle}
          label="Create New Quiz"
          isActive={isSubRouteActive('create')}
        />
      </nav>

      {/* NESTED CONTENT */}
      <div className="mt-4 p-6 bg-white rounded-xl shadow-lg border border-gray-100 min-h-[400px]">
        <Outlet />
      </div>
    </div>
  );
};

export default Quizes;
