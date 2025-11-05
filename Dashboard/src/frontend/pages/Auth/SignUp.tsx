import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import type { SubmitHandler, FieldValues } from "react-hook-form";

const SignUp: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
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
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-3xl font-semibold mb-6 text-center">Sign Up</h2>
      {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
      {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          />
          {errors.name && <span className="text-red-500 text-sm">{(errors.name as any)?.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          />
          {errors.email && <span className="text-red-500 text-sm">{(errors.email as any)?.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Minimum 6 characters" },
            })}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          />
          {errors.password && <span className="text-red-500 text-sm">{(errors.password as any)?.message}</span>}
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
          Sign Up
        </button>
      </form>

      <p className="text-center text-gray-600 mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-500 font-medium hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
