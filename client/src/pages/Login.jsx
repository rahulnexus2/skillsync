import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post("/auth/login", data);
      const { token, role } = response.data;

      if (role === "admin") {
        localStorage.setItem("adminToken", token);
        navigate("/admin/dashboard");
      } else {
        localStorage.setItem("token", token);
        navigate("/user/profile");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-4">
        <div>
          <label htmlFor="login-email" className="form-label">
            Email
          </label>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              strokeWidth={1.75}
            />
            <input
              id="login-email"
              {...register("email")}
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              className="input-field pl-10"
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="login-password" className="form-label mb-0">
              Password
            </label>
          </div>
          <div className="relative">
            <Lock
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              strokeWidth={1.75}
            />
            <input
              id="login-password"
              {...register("password")}
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="input-field pl-10"
            />
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary group h-11 text-base font-semibold shadow-md shadow-primary/20"
      >
        <span className="flex w-full items-center justify-center gap-2">
          {isSubmitting ? (
            "Signing in…"
          ) : (
            <>
              Sign in
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </span>
      </button>

      <div className="space-y-4 border-t border-border pt-6 text-center">
        <Link
          to="/forgot-password"
          className="text-sm font-medium text-primary hover:underline"
        >
          Forgot password?
        </Link>
        <p className="text-sm text-muted-foreground">
          No account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-foreground underline-offset-4 hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </form>
  );
};
