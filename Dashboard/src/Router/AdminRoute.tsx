import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, loading, checkAuth } = useAuth();
  const navigate = useNavigate();

  console.log('AdminRoute - User:', user);
  console.log('AdminRoute - Loading:', loading);

  useEffect(() => {
    console.log('AdminRoute - Checking auth...');
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!loading) {
      console.log('AdminRoute - Auth check complete');
      console.log('AdminRoute - User exists:', !!user);
      console.log('AdminRoute - User role:', user?.role);
      
      if (!user || user.role !== 'admin') {
        console.log('AdminRoute - Redirecting to login');
        navigate('/admin/login', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    console.log('AdminRoute - Showing loading state');
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    console.log('AdminRoute - No user or not admin, showing nothing');
    return null;
  }

  console.log('AdminRoute - Rendering admin content');
  return <>{children}</>;
};