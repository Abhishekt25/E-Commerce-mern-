import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { connectDB } from "./config/db";
import productRoutes from "./Routes/productRoutes";
import AdminRoutes from "./Routes/adminRoutes";
import orderRoutes from "./Routes/orderRoutes";
import paymentRoutes from "./Routes/paymentRoutes"; 


const app = express();
const port = process.env.PORT || 5000;

// For normal JSON routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static images
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "https://shopab.vercel.app"],
    credentials: true,
  })
);



// ROUTES
app.use("/api/products", productRoutes);
app.use("/api", AdminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes); 


// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    razorpayConfigured: !!process.env.RAZORPAY_KEY_ID,
  });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () =>
      console.log(`Server running on http://localhost:${port}`)
    );
  } catch (error) {
    console.error("Server startup error:", error);
  }
};

startServer();