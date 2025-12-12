// File: src/Component/Jobs.jsx (The Level 2 Layout)

import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { PlusCircle, List, Edit } from 'lucide-react';

// Reusable component for the sub-navigation buttons
const JobNavButton = ({ to, icon: Icon, label, isActive }) => {
    // Styling logic for active/inactive state (using the same logic as AdminDashLayout)
    const activeClasses = 'bg-indigo-600 text-white shadow-md';
    const inactiveClasses = 'bg-white text-slate-700 hover:bg-slate-100';

    return (
        <Link
            // 'to' is relative: "" for index, "create" for creation, etc.
            to={to}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`}
        >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
        </Link>
    );
};


const Jobs = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const isAdmin = currentPath.startsWith('/admin');

    // Logic to determine if a sub-navigation button is active
    const isSubRouteActive = (pathSegment) => {
        if (pathSegment === '') {
            return currentPath.endsWith('/jobs') || currentPath.endsWith('/jobs/');
        }
        return currentPath.startsWith(`/admin/jobs/${pathSegment}`);
    };

    return (
        <div className="flex flex-col space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 border-b pb-2">
                {isAdmin ? '💼 Job Management Console' : '🚀 Browse Jobs'}
            </h2>

            {/* Sub-Navigation for CRUD Actions - ONLY FOR ADMIN */}
            {isAdmin && (
                <nav className="flex space-x-3 p-3 bg-gray-50 rounded-xl shadow-inner border border-gray-200">
                    <JobNavButton
                        to=""
                        icon={List}
                        label="View All Jobs"
                        isActive={isSubRouteActive('')}
                    />
                    <JobNavButton
                        to="create"
                        icon={PlusCircle}
                        label="Create New Job"
                        isActive={isSubRouteActive('create')}
                    />
                </nav>
            )}

            {/* Content Area */}
            <div className={`mt-4 ${isAdmin ? 'p-6 bg-white rounded-xl shadow-lg border border-gray-100' : ''} min-h-[400px]`}>
                <Outlet />
            </div>
        </div>
    );
};

export default Jobs;