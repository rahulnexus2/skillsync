// File: src/Component/Jobs.jsx (The Level 2 Layout)

import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { PlusCircle, List, Edit } from 'lucide-react';

// Reusable component for the sub-navigation buttons
const JobNavButton = ({ to, icon, label, isActive }) => {
    const Icon = icon;
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

    // Logic to determine if a sub-navigation button is active
    const isSubRouteActive = (pathSegment) => {
        // Handle the index route (View All)
        if (pathSegment === '') {
            // Active only if the path ends exactly at /jobs
            return currentPath.endsWith('/jobs') || currentPath.endsWith('/jobs/');
        }

        // Handle other routes (e.g., check if currentPath includes /jobs/create or /jobs/update)
        // We use startsWith to catch dynamic IDs, e.g., /jobs/update/15
        return currentPath.startsWith(`/admin/jobs/${pathSegment}`);
    };

    return (
        <div className="flex flex-col space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 border-b pb-2">💼 Job Management Console</h2>

            {/* Sub-Navigation for CRUD Actions */}
            <nav className="flex space-x-3 p-3 bg-gray-50 rounded-xl shadow-inner border border-gray-200">

                {/* 1. View All Jobs (Index Route: /admin/jobs) */}
                <JobNavButton
                    to=""
                    icon={List}
                    label="View All Jobs"
                    isActive={isSubRouteActive('')}
                />

                {/* 2. Create Job (Route: /admin/jobs/create) */}
                <JobNavButton
                    to="create"
                    icon={PlusCircle}
                    label="Create New Job"
                    isActive={isSubRouteActive('create')}
                />

                {/* 3. Update Job (Dynamic Route: /admin/jobs/update/1) */}
                {/* Note: In a real app, this link is usually on the ViewAll table */}
                <JobNavButton
                    to="update/1"
                    icon={Edit}
                    label="Update (Demo)"
                    isActive={isSubRouteActive('update')}
                />
            </nav>

            {/* 🔑 THIS IS WHERE THE NESTED CRUD COMPONENTS ARE RENDERED (Level 3) */}
            <div className="mt-4 p-6 bg-white rounded-xl shadow-lg border border-gray-100 min-h-[400px]">
                <Outlet />
            </div>
        </div>
    );
};

export default Jobs;