import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import type { SubmitHandler, FieldValues } from "react-hook-form";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const SignUp: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const backendURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:2507";

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const response = await fetch(`${backendURL}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Signup failed. Please try again.");

      setSuccessMessage("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error: any) {
      setErrorMessage(error.message || "An error occurred. Try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl mt-20">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        Create Your Account
      </h2>

      {errorMessage && <p className="text-red-600 text-center mb-4">{errorMessage}</p>}
      {successMessage && <p className="text-green-600 text-center mb-4">{successMessage}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="w-full mt-2 px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter your full name"
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{(errors.name as any)?.message}</span>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full mt-2 px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter your email"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{(errors.email as any)?.message}</span>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">Password</label>

          <input
            type={showPassword ? "text" : "password"}
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Minimum 6 characters" },
            })}
            className="w-full mt-2 px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none pr-12"
            placeholder="Enter your password"
          />

          {/* Eye Button */}
          <button
            type="button"
            className="absolute right-4 top-[60%] -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>

          {errors.password && (
            <span className="text-red-500 text-sm">{(errors.password as any)?.message}</span>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition shadow-md"
        >
          Sign Up
        </button>

      </form>

      <p className="text-center text-gray-600 mt-5">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 font-medium hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
