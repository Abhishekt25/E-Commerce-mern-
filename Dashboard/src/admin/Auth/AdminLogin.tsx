import { useForm, type SubmitHandler, type FieldValues } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const backendURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:2509";

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const response = await fetch(`${backendURL}/api/admin/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("Login Response:", result);

      if (!response.ok) {
        throw new Error(result?.message || "Invalid credentials");
      }

      // Your backend returns: result.token & result.user
      const token = result?.token;
      const user = result?.user;

      if (!token || !user) {
        throw new Error("Invalid server response (missing token or user)");
      }

      if (user.role !== "admin") {
        throw new Error("Access denied. Admins only.");
      }

      // Save to localStorage
      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminName", user.name);
      localStorage.setItem("adminEmail", user.email);
      localStorage.setItem("adminRole", user.role);

      // Navigate to admin dashboard
      navigate("/admin");
    } catch (error: any) {
      setErrorMessage(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access the admin dashboard
          </p>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="admin@example.com"
              />
              {errors.email && (
                <span className="text-red-500 text-sm mt-1">
                  {(errors.email as any)?.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                {...register("password", { 
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
              {errors.password && (
                <span className="text-red-500 text-sm mt-1">
                  {(errors.password as any)?.message}
                </span>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;