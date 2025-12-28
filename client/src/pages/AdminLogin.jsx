import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { Mail, Lock } from 'lucide-react';

const schema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export const AdminLogin = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    });

    const onSubmit = async (data) => {
        try {
            const response = await axiosInstance.post('/admin/login', data);
            localStorage.setItem('adminToken', response.data.token);
            alert('Admin Login Successful!');
            navigate('/admin/dashboard');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Admin Login Failed');
        }
    };

    return (
        <div className="max-w-md w-full mx-auto space-y-8">
            <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Admin Sign In
                </h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="rounded-md shadow-sm space-y-4">
                    <div className="relative">
                        <Mail className="absolute top-3 left-3 text-gray-400" size={20} />
                        <input
                            {...register('email')}
                            type="email"
                            placeholder="Email address"
                            className="pl-10 appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div className="relative">
                        <Lock className="absolute top-3 left-3 text-gray-400" size={20} />
                        <input
                            {...register('password')}
                            type="password"
                            placeholder="Password"
                            className="pl-10 appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    >
                        Sign in
                    </button>
                </div>
            </form>
            <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                    Need an admin account?{' '}
                    <Link to="/admin/signup" className="font-medium text-emerald-600 hover:text-emerald-500">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};
