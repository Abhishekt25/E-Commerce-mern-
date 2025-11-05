import { useForm, type SubmitHandler, type FieldValues } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:2507";

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const response = await fetch(`${backendURL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Invalid credentials");

      const result = await response.json();
      const { token, user } = result;

      if (user.role !== "admin") {
        throw new Error("Access denied. Admins only.");
      }

      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminName", user.name);
      navigate("/admin/");
    } catch (error: any) {
      setErrorMessage(error.message || "An error occurred");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-semibold text-center mb-6">Admin Login</h2>
      {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          />
          {errors.email && <span className="text-red-500 text-sm">{(errors.email as any)?.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          />
          {errors.password && <span className="text-red-500 text-sm">{(errors.password as any)?.message}</span>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
