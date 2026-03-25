import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { Mail } from "lucide-react";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axiosInstance.post("/auth/forgot-password", data);
      console.log("API URL:", import.meta.env.VITE_API_URL);
      toast.success("OTP sent to your email.");
      navigate("/reset-password", { state: { email: data.email } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <p className="text-center text-sm leading-relaxed text-muted-foreground">
        Enter your registered email — we’ll send a one-time code to reset your password.
      </p>

      <div>
        <label htmlFor="fp-email" className="form-label">
          Email
        </label>
        <div className="relative">
          <Mail
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.75}
          />
          <input
            id="fp-email"
            {...register("email")}
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            className="input-field pl-10"
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <button type="submit" disabled={loading} className="btn-primary h-11 font-semibold shadow-md shadow-primary/20">
        {loading ? "Sending…" : "Send code"}
      </button>

      <div className="text-center">
        <Link to="/login" className="text-sm font-medium text-primary hover:underline">
          Back to sign in
        </Link>
      </div>
    </form>
  );
};
