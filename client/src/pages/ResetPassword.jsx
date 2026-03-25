import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { Lock, KeyRound } from "lucide-react";
import { toast } from "sonner";

const schema = z
  .object({
    otp: z
      .string()
      .length(6, "OTP must be 6 digits")
      .regex(/^\d+$/, "OTP must be numeric"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const email = location.state?.email;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  if (!email) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-muted-foreground">
          Session expired or invalid access.
        </p>
        <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
          Request a new code
        </Link>
      </div>
    );
  }

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axiosInstance.post("/auth/reset-password", {
        email,
        otp: data.otp,
        newPassword: data.newPassword,
      });
      toast.success("Password updated. You can sign in now.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <p className="text-center text-sm leading-relaxed text-muted-foreground">
        Code sent to{" "}
        <span className="font-medium text-foreground">{email}</span>
      </p>

      <div>
        <label htmlFor="reset-otp" className="form-label">
          One-time code
        </label>
        <div className="relative">
          <KeyRound
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.75}
          />
          <input
            id="reset-otp"
            {...register("otp")}
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            className="input-field pl-10 tracking-[0.35em]"
          />
        </div>
        {errors.otp && (
          <p className="mt-1 text-xs text-destructive">{errors.otp.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="reset-new" className="form-label">
          New password
        </label>
        <div className="relative">
          <Lock
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.75}
          />
          <input
            id="reset-new"
            {...register("newPassword")}
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            className="input-field pl-10"
          />
        </div>
        {errors.newPassword && (
          <p className="mt-1 text-xs text-destructive">{errors.newPassword.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="reset-confirm" className="form-label">
          Confirm password
        </label>
        <div className="relative">
          <Lock
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.75}
          />
          <input
            id="reset-confirm"
            {...register("confirmPassword")}
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            className="input-field pl-10"
          />
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary h-11 w-full font-semibold shadow-md shadow-primary/20"
      >
        {loading ? "Updating…" : "Update password"}
      </button>

      <div className="space-y-2 text-center">
        <Link
          to="/forgot-password"
          className="block text-sm font-medium text-primary hover:underline"
        >
          Resend code
        </Link>
        <Link to="/login" className="block text-sm font-medium text-primary hover:underline">
          Back to sign in
        </Link>
      </div>
    </form>
  );
};
