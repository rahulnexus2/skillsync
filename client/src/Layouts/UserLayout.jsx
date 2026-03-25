import { Outlet, Link, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  User,
  Briefcase,
  MessageCircle,
  Menu,
  X,
  Sparkles,
  FileText,
} from "lucide-react";
import { DashboardNavItem } from "../components/DashboardNavItem";
import { ThemeToggle } from "../components/ThemeToggle";

export const UserDashLayout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(
    location.pathname || "/user/profile"
  );

  const navItems = [
    { to: "/user/profile", icon: User, label: "Profile" },
    { to: "/user/jobs", icon: Briefcase, label: "Jobs" },
    { to: "/user/chatroom", icon: MessageCircle, label: "Chat" },
    { to: "/user/resume-scorer", icon: FileText, label: "Resume AI" },
  ];

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveItem(location.pathname);
  }, [location]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            to="/user/profile"
            className="flex min-w-0 items-center gap-2.5"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Sparkles className="h-4 w-4" strokeWidth={1.75} />
            </div>
            <div className="min-w-0 text-left">
              <p className="truncate text-sm font-semibold tracking-tight text-foreground">
                SkillSync
              </p>
              <p className="text-xs text-muted-foreground">Candidate</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <DashboardNavItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                isActive={activeItem === item.to}
                onClick={() => setActiveItem(item.to)}
              />
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div
          className={`border-t border-border bg-card md:hidden ${
            isMobileMenuOpen ? "max-h-96 py-3" : "max-h-0 overflow-hidden py-0"
          } transition-all duration-200 ease-out`}
        >
          <nav className="flex flex-col gap-1 px-4 pb-2">
            {navItems.map((item) => (
              <DashboardNavItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                mobile
                isActive={activeItem === item.to}
                onClick={() => setActiveItem(item.to)}
              />
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 md:pb-8 pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="min-h-[min(70vh,720px)] rounded-xl border border-border bg-card p-5 shadow-soft sm:p-8 lg:p-10">
            <Outlet />
          </div>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-md md:hidden">
        <div className="mx-auto flex max-w-lg items-stretch justify-around px-1 py-1.5">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setActiveItem(item.to)}
              className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg py-2 transition-colors ${
                activeItem === item.to
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" strokeWidth={1.75} />
              <span className="max-w-[4.5rem] truncate text-[10px] font-medium">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};
