import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { Mail } from 'lucide-react';

const schema = z.object({
    email: z.string().email("Invalid email address"),
});

export const ForgotPassword = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await axiosInstance.post('/auth/forgot-password', data);
            alert('OTP sent to your email!');
            // Pass email to reset page via state
            navigate('/reset-password', { state: { email: data.email } });
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
                    Forgot Password
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Enter your registered email and we'll send you an OTP.
                </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="relative">
                    <Mail className="absolute top-3 left-3 text-gray-400" size={20} />
                    <input
                        {...register('email')}
                        type="email"
                        placeholder="Email address"
                        className="pl-10 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {loading ? 'Sending...' : 'Send OTP'}
                </button>
            </form>

            <div className="text-center">
                <Link to="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    Back to Login
                </Link>
            </div>
        </div>
    );
};
