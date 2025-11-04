// src/Router/AppRouter.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loading from "../admin/components/Loading";

const Layout = lazy(() => import("../frontend/Header/Layout"));
const FrontendHome = lazy(() => import("../frontend/Home"));
const FrontendProducts = lazy(() => import("../frontend/pages/Products"));
const AdminRouter = lazy(() => import("./AdminRouter"));
const AdminLogin = lazy(() => import("../admin/Adminpages/AdminLogin"));

const AppRouter = () => {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Frontend routes wrapped in Layout */}
          <Route path="/" element={<Layout><FrontendHome /></Layout>} />
          <Route path="/products" element={<Layout><FrontendProducts /></Layout>} />
    
          {/* Admin Login route */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Redirect /admin to /admin/login directly */}
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          
          {/* Protected Admin routes */}
          <Route path="/admin/*" element={<AdminRouter />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRouter;