import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { PlusCircle, List } from "lucide-react";
import { PageHeader } from "../components/PageHeader";

const JobNavButton = ({ to, icon: Icon, label, isActive }) => (
  <Link
    to={to}
    className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
      isActive
        ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
        : "border border-transparent text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground"
    }`}
  >
    <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
    {label}
  </Link>
);

const Jobs = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isSubRouteActive = (pathSegment) => {
    if (pathSegment === "") {
      return currentPath.endsWith("/jobs") || currentPath.endsWith("/jobs/");
    }
    return currentPath.includes(`/admin/jobs/${pathSegment}`);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Jobs"
        description="Create listings, edit open roles, and remove posts you no longer need."
      />

      <nav className="flex flex-wrap gap-2 rounded-xl border border-border bg-muted/30 p-2">
        <JobNavButton
          to=""
          icon={List}
          label="All listings"
          isActive={isSubRouteActive("")}
        />
        <JobNavButton
          to="create"
          icon={PlusCircle}
          label="New job"
          isActive={isSubRouteActive("create")}
        />
      </nav>

      <div className="card-panel min-h-[320px] p-5 sm:p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default Jobs;
