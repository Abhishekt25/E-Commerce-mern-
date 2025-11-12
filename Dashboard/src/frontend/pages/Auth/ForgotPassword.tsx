import { useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler, FieldValues } from "react-hook-form";

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

      setMessage("Reset link sent! Please check your email.");
      reset();
    } catch (error: any) {
      setError(error.message || "An error occurred. Try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-3xl font-semibold mb-6 text-center">Forgot Password</h2>
      {message && <p className="text-green-500 text-center mb-4">{message}</p>}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          />
          {errors.email && <span className="text-red-500 text-sm">{(errors.email as any)?.message}</span>}
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
