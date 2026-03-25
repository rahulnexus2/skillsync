import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { User, Mail, Lock, Key, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
  adminKey: z.string().optional(),
});

export const Signup = () => {
  const navigate = useNavigate();
  const [showAdminKey, setShowAdminKey] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const payload = { ...data };
      if (!payload.adminKey?.trim()) delete payload.adminKey;

      const response = await axiosInstance.post("/auth/signup", payload);
      const { role } = response.data;

      toast.success(`Account created as ${role}. Sign in to continue.`);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-4">
        <div>
          <label htmlFor="su-user" className="form-label">
            Username
          </label>
          <div className="relative">
            <User
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              strokeWidth={1.75}
            />
            <input
              id="su-user"
              {...register("username")}
              type="text"
              autoComplete="username"
              placeholder="jane-doe"
              className="input-field pl-10"
            />
          </div>
          {errors.username && (
            <p className="mt-1.5 text-xs text-destructive">{errors.username.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="su-email" className="form-label">
            Email
          </label>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              strokeWidth={1.75}
            />
            <input
              id="su-email"
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
          <label htmlFor="su-pass" className="form-label">
            Password
          </label>
          <div className="relative">
            <Lock
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              strokeWidth={1.75}
            />
            <input
              id="su-pass"
              {...register("password")}
              type="password"
              autoComplete="new-password"
              placeholder="8+ chars, upper, lower, number, symbol"
              className="input-field pl-10"
            />
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs text-destructive">{errors.password.message}</p>
          )}
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Use a strong password — mix of letters, numbers, and symbols.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-border bg-muted/20 p-3">
        <button
          type="button"
          onClick={() => setShowAdminKey(!showAdminKey)}
          className="flex w-full items-center justify-between text-left text-sm font-medium text-foreground transition-colors hover:text-primary"
        >
          <span>Recruiter / admin signup</span>
          {showAdminKey ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {showAdminKey && (
          <div className="relative mt-3 border-t border-border pt-3">
            <label htmlFor="su-admin" className="form-label">
              Admin key
            </label>
            <div className="relative">
              <Key
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                strokeWidth={1.75}
              />
              <input
                id="su-admin"
                {...register("adminKey")}
                type="password"
                placeholder="Secret from server env"
                className="input-field pl-10"
              />
            </div>
            {errors.adminKey && (
              <p className="mt-1.5 text-xs text-destructive">{errors.adminKey.message}</p>
            )}
            <p className="mt-2 text-xs text-muted-foreground">
              Leave blank to register as a candidate.
            </p>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary group h-11 text-base font-semibold shadow-md shadow-primary/20"
      >
        <span className="flex w-full items-center justify-center gap-2">
          {isSubmitting ? (
            "Creating account…"
          ) : (
            <>
              Create account
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </span>
      </button>

      <p className="border-t border-border pt-6 text-center text-sm text-muted-foreground">
        Already registered?{" "}
        <Link
          to="/login"
          className="font-semibold text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
};
