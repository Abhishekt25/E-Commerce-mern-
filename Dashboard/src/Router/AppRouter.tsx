// src/Router/AppRouter.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loading from "../admin/components/Loading";

// Lazy load pages
const Layout = lazy(() => import("../frontend/HeaderandFooter/Layout"));
const FrontendHome = lazy(() => import("../frontend/Home"));
const FrontendProducts = lazy(() => import("../frontend/pages/Products"));
import ContactUs from "../frontend/pages/ContactUs";
const Cart = lazy(() => import("../frontend/pages/Cart"));
const Checkout = lazy(() => import("../frontend/pages/Checkout"));
const AdminRouter = lazy(() => import("./AdminRouter"));

// Auth pages
const SignIn = lazy(() => import("../frontend/pages/Auth/SignIn"));
const SignUp = lazy(() => import("../frontend/pages/Auth/SignUp"));
const ForgotPassword = lazy(() => import("../frontend/pages/Auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../frontend/pages/Auth/ResetPassword"));

const AppRouter = () => {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* ---------- FRONTEND ROUTES ---------- */}
          <Route
            path="/"
            element={
              <Layout>
                <FrontendHome />
              </Layout>
            }
          />
          <Route
            path="/products"
            element={
              <Layout>
                <FrontendProducts />
              </Layout>
            }
          />
          <Route
            path="/contact"
            element={
              <Layout>
                <ContactUs />
              </Layout>
            }
          />
          <Route
            path="/cart"
            element={
              <Layout>
                <Cart />
              </Layout>
            }
          />
          <Route
            path="/checkout"
            element={
              <Layout>
                <Checkout />
              </Layout>
            }
          />

          {/* ---------- AUTH ROUTES (without Layout) ---------- */}
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* ---------- ADMIN ROUTES ---------- */}
          <Route path="/admin/*" element={<AdminRouter />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRouter;
