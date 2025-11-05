import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import type { SubmitHandler, FieldValues } from "react-hook-form";

const ResetPassword: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const location = useLocation();

  const backendURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:2507";

  // Extract token from the URL (e.g. /reset-password?token=123abc)
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!token) {
      setErrorMessage("Invalid or missing token. Please check your email link.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const response = await fetch(`${backendURL}/api/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reset password. Please try again.");
      }

      setSuccessMessage("Password reset successful! Redirecting to Sign In...");
      setTimeout(() => navigate("/signin"), 2500); // Redirect after 2.5s
    } catch (error: any) {
      setErrorMessage(error.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        Reset Password
      </h2>

      {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
      {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">New Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Minimum 6 characters" },
            })}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.password && (
            <span className="text-red-500 text-sm">{(errors.password as any)?.message}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-sm">{(errors.confirmPassword as any)?.message}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
