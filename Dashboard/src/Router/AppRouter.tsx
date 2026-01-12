// src/Router/AppRouter.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loading from "../admin/components/Loading";
import ContactUs from "../frontend/pages/ContactUs";

// Lazy load pages
const Layout = lazy(() => import("../frontend/HeaderandFooter/Layout"));
const FrontendHome = lazy(() => import("../frontend/Home"));
const FrontendProducts = lazy(() => import("../frontend/pages/ProductsPage/Products"));
const FrontendProductDetails = lazy(() => import("../frontend/pages/ProductDetails"));
const Cart = lazy(() => import("../frontend/pages/Cart"));
const Checkout = lazy(() => import("../frontend/pages/checkout/Checkout"));
const OrderSuccess = lazy(() => import("../frontend/pages/OrderSuccess"));
const OrdersPage = lazy(() => import("../frontend/pages/OrdersPage"));
const AdminRouter = lazy(() => import("./AdminRouter"));
const AdminLogin = lazy(() => import("../admin/Auth/AdminLogin"));

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
            path="/product/:id"
            element={
              <Layout>
                <FrontendProductDetails />
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
          <Route
            path="/order-success"
            element={
              <Layout>
                <OrderSuccess />
              </Layout>
            }
          />
          <Route
            path="/orders"
            element={
              <Layout>
                <OrdersPage />
              </Layout>
            }
          />

          {/* ---------- AUTH ROUTES (without Layout) ---------- */}
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* ---------- ADMIN ROUTES ---------- */}

          {/* Frontend routes wrapped in Layout */}
          <Route path="/" element={<Layout><FrontendHome /></Layout>} />
          <Route path="/products" element={<Layout><FrontendProducts /></Layout>} />
    
          {/* Admin Login route */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          
          {/* Protected Admin routes */}

          <Route path="/admin/*" element={<AdminRouter />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRouter;