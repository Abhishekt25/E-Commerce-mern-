import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import type { SubmitHandler, FieldValues } from "react-hook-form";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface SignInProps {
  onLoginSuccess?: (user: any) => void;
}

const SignIn: React.FC<SignInProps> = ({ onLoginSuccess }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const backendURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:2507";

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const response = await fetch(`${backendURL}/api/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Invalid email or password.");

      const result = await response.json();
      const { token, user } = result;

      localStorage.setItem("token", token);
      localStorage.setItem("userName", user.name);
      localStorage.setItem("userRole", user.role);

      onLoginSuccess?.(user);

      navigate(user.role === "admin" ? "/admin" : "/");
    } catch (error: any) {
      setErrorMessage(error.message || "Something went wrong.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        Welcome Back! Please Sign In
      </h2>

      {errorMessage && (
        <p className="text-red-600 text-center mb-4 font-medium">{errorMessage}</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

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
            {...register("password", { required: "Password is required" })}
            className="w-full mt-2 px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none pr-12"
            placeholder="Enter your password"
          />

          {/* Eye Icon */}
          <button
            type="button"
            className="absolute right-4 top-[60%] transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>

          {errors.password && (
            <span className="text-red-500 text-sm">{(errors.password as any)?.message}</span>
          )}
        </div>

        {/* Forgot Password */}
        <div className="text-right">
          <Link to="/forgot-password" className="text-blue-600 text-sm hover:underline">
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-all shadow-md"
        >
          Sign In
        </button>
      </form>

      {/* Bottom link */}
      <p className="text-center text-gray-600 mt-5">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-600 font-medium hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default SignIn;
