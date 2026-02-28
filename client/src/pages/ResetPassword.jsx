import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { Lock, KeyRound } from 'lucide-react';

const schema = z.object({
    otp: z.string().length(6, "OTP must be 6 digits").regex(/^\d+$/, "OTP must be numeric"),
    newPassword: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[a-z]/, "Must contain at least one lowercase letter")
        .regex(/[0-9]/, "Must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    // Email passed from ForgotPassword page
    const email = location.state?.email;

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    });

    // If user landed here directly without email, redirect back
    if (!email) {
        return (
            <div className="max-w-md w-full mx-auto text-center space-y-4 mt-16">
                <p className="text-gray-600">Session expired or invalid access.</p>
                <Link to="/forgot-password" className="text-indigo-600 font-medium hover:text-indigo-500">
                    Request a new OTP
                </Link>
            </div>
        );
    }

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await axiosInstance.post('/auth/reset-password', {
                email,
                otp: data.otp,
                newPassword: data.newPassword,
            });
            alert('Password reset successful! Please login.');
            navigate('/login');
        } catch (error) {
            alert(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md w-full mx-auto space-y-8">
            <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Reset Password
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Enter the OTP sent to <span className="font-medium text-indigo-600">{email}</span>
                </p>
            </div>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                {/* OTP */}
                <div className="relative">
                    <KeyRound className="absolute top-3 left-3 text-gray-400" size={20} />
                    <input
                        {...register('otp')}
                        type="text"
                        maxLength={6}
                        placeholder="Enter 6-digit OTP"
                        className="pl-10 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm tracking-widest"
                    />
                    {errors.otp && <p className="text-red-500 text-xs mt-1">{errors.otp.message}</p>}
                </div>

                {/* New Password */}
                <div className="relative">
                    <Lock className="absolute top-3 left-3 text-gray-400" size={20} />
                    <input
                        {...register('newPassword')}
                        type="password"
                        placeholder="New password"
                        className="pl-10 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
                </div>

                {/* Confirm Password */}
                <div className="relative">
                    <Lock className="absolute top-3 left-3 text-gray-400" size={20} />
                    <input
                        {...register('confirmPassword')}
                        type="password"
                        placeholder="Confirm new password"
                        className="pl-10 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {loading ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>

            <div className="text-center space-y-2">
                <p className="text-sm text-gray-500">
                    Didn't receive the OTP?{' '}
                    <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Resend
                    </Link>
                </p>
                <Link to="/login" className="block text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    Back to Login
                </Link>
            </div>
        </div>
    );
};
