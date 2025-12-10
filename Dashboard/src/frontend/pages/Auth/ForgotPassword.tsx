import { useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler, FieldValues } from "react-hook-form";
import { Link } from "react-router-dom";


const ForgotPassword: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const backendURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:2507";

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const response = await fetch(`${backendURL}/api/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      if (!response.ok) throw new Error("Failed to send reset link.");

      setMessage("Reset link sent! Check your email.");
      reset();
    } catch (error: any) {
      setError(error.message || "Something went wrong.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        Forgot Password
      </h2>

      {message && <p className="text-green-600 text-center mb-4">{message}</p>}
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

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

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition shadow-md"
        >
          Send Reset Link
        </button>

        <Link to="/login" className="text-blue-600 hover:underline text-sm block text-center">
          Remembered your password? Sign In
        </Link>

      </form>
    </div>
  );
};

export default ForgotPassword;
