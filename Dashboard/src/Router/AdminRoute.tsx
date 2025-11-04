// src/components/AdminRoute.tsx
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Once loading finishes, check user role
    if (!loading) {
      if (!user) {
        console.log("🚫 No user found, redirecting to admin login");
        navigate("/admin/login", { replace: true });
      } else if (user.role !== "admin") {
        console.log("🚫 User is not admin, access denied");
        navigate("/admin/login", { replace: true });
      }
    }
  }, [user, loading, navigate]);

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-600 animate-pulse">Checking admin access...</div>
      </div>
    );
  }

  // Prevent rendering if not admin
  if (!user || user.role !== "admin") {
    return null;
  }

  console.log("✅ Admin authenticated, rendering admin content");
  return <>{children}</>;
};

export default AdminRoute;
