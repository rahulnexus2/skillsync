import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { User, Mail, Lock, Key, ChevronDown, ChevronUp } from 'lucide-react';

const schema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string()
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

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    });

    const onSubmit = async (data) => {
        try {
            // Remove adminKey from payload if empty
            if (!data.adminKey) delete data.adminKey;

            const response = await axiosInstance.post('/auth/signup', data);
            const { role } = response.data;

            alert(`Signup Successful! You are registered as ${role}.`);

            if (role === 'admin') {
                navigate('/login');
            } else {
                navigate('/login');
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Signup Failed');
        }
    };

    return (
        <div className="max-w-md w-full mx-auto space-y-8">
            <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create your account
                </h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="rounded-md shadow-sm space-y-4">
                    <div className="relative">
                        <User className="absolute top-3 left-3 text-gray-400" size={20} />
                        <input
                            {...register('username')}
                            type="text"
                            placeholder="Username"
                            className="pl-10 appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        />
                        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                    </div>

                    <div className="relative">
                        <Mail className="absolute top-3 left-3 text-gray-400" size={20} />
                        <input
                            {...register('email')}
                            type="email"
                            placeholder="Email address"
                            className="pl-10 appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    <div className="relative">
                        <Lock className="absolute top-3 left-3 text-gray-400" size={20} />
                        <input
                            {...register('password')}
                            type="password"
                            placeholder="Password"
                            className="pl-10 appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>
                </div>

                {/* Optional Admin Key Section */}
                <div>
                    <button
                        type="button"
                        onClick={() => setShowAdminKey(!showAdminKey)}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
                    >
                        {showAdminKey ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        Registering as Admin?
                    </button>

                    {showAdminKey && (
                        <div className="relative mt-2">
                            <Key className="absolute top-3 left-3 text-gray-400" size={20} />
                            <input
                                {...register('adminKey')}
                                type="password"
                                placeholder="Enter Admin Key"
                                className="pl-10 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            />
                            {errors.adminKey && <p className="text-red-500 text-xs mt-1">{errors.adminKey.message}</p>}
                            <p className="text-xs text-gray-400 mt-1">Leave empty to register as a regular user.</p>
                        </div>
                    )}
                </div>

                <div>
                    <button
                        type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Sign up
                    </button>
                </div>
            </form>

            <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};
