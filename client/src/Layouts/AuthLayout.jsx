import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Briefcase, ChevronLeft, Sparkles } from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";

const AuthLayout = () => {
  const location = useLocation();
  const isSignup = location.pathname.includes("signup");
  const isForgot = location.pathname.includes("forgot");
  const isReset = location.pathname.includes("reset");

  const getTitle = () => {
    if (isSignup) return "Create account";
    if (isForgot) return "Forgot password";
    if (isReset) return "Reset password";
    return "Welcome back";
  };

  const getSubtitle = () => {
    if (isSignup) return "Join SkillSync to browse roles and track applications.";
    if (isForgot) return "We’ll email you a one-time code.";
    if (isReset) return "Enter your code and choose a new password.";
    return "Sign in to your candidate or recruiter workspace.";
  };

  return (
    <div className="auth-shell">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(var(--border)/0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--border)/0.4)_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-40 dark:opacity-20" />

      <div className="relative mx-auto flex min-h-screen max-w-lg flex-col px-4 py-10 sm:py-14">
        <div className="mb-8 flex items-center justify-between">
          <Link
            to="/"
            className="group inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to home
          </Link>
          <ThemeToggle />
        </div>

        <div className="card-panel shadow-lg">
          <div className="relative border-b border-border bg-gradient-to-br from-primary/[0.06] via-transparent to-transparent px-8 pb-6 pt-10 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md ring-4 ring-primary/10">
              <Briefcase className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <div className="mx-auto mb-2 inline-flex items-center gap-1.5 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              SkillSync
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              {getTitle()}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {getSubtitle()}
            </p>
          </div>

          {!isForgot && !isReset && (
            <div className="grid grid-cols-2 border-b border-border bg-muted/30 p-1">
              <Link
                to="/signup"
                className={`rounded-lg py-2.5 text-center text-sm font-medium transition-colors ${
                  isSignup
                    ? "bg-card text-foreground shadow-sm ring-1 ring-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign up
              </Link>
              <Link
                to="/login"
                className={`rounded-lg py-2.5 text-center text-sm font-medium transition-colors ${
                  !isSignup
                    ? "bg-card text-foreground shadow-sm ring-1 ring-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign in
              </Link>
            </div>
          )}

          <div className="p-8 sm:p-9">
            <Outlet />
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          By continuing you agree to use this demo responsibly.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
