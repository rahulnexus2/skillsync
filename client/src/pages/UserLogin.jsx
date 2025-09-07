import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";



export const UserLogin = () => {
  
   const {
    register,
    handleSubmit,
    setError,
    
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        data
        
      );
      alert(res.data.user.message);
    } catch (err) {
      const backendErrors = err.response?.data?.errors;
      const globalErrors = err.response?.data?.message;
      if (backendErrors) {
        Object.keys(backendErrors).forEach((field) => {
          setError(field, { type: "server", message: backendErrors[field] });
        });
      } else if (globalErrors) {
        setError("root", { type: "server", message: globalErrors });
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#3B38A0] to-[#647FBC] p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login your Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          

          
          <div>
            <input
              type="email"
              placeholder="Enter your Email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

         
          <div>
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register("password", {
                required: "Password is required",
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message:
                    "Password must be at least 8 characters, include uppercase, lowercase, number, and special character",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

         
          {errors.root && (
            <p className="text-red-600 text-center">{errors.root.message}</p>
          )}

         
          <button
            
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Login
          </button>
        </form>

      
        
      </div>
    </div>
  )
}


