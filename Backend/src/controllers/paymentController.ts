import { Request, Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order";

// Debug: Check if environment variables are loaded
console.log("RAZORPAY_KEY_ID exists:", !!process.env.RAZORPAY_KEY_ID);
console.log("RAZORPAY_KEY_SECRET exists:", !!process.env.RAZORPAY_KEY_SECRET);

// Initialize Razorpay with validation
let razorpay: Razorpay;

try {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay credentials not found in environment variables");
  }

  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  console.log("Razorpay initialized successfully");
} catch (error: any) {
  console.error("Razorpay initialization error:", error.message);
  throw error;
}

// Create Razorpay Order
export const createRazorpayOrder = async (req: Request, res: Response) => {
  try {
    const { amount, currency = "INR" } = req.body;
    const userId = (req as any).user.id;

    console.log("Creating Razorpay order for:", {
      amount,
      currency,
      userId,
    });

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    // Generate a shorter receipt (max 40 characters)
    // Using timestamp and short userId (first 8 chars)
    const shortUserId = userId.toString().slice(-8);
    const timestamp = Date.now().toString().slice(-10);
    const receipt = `rcpt_${timestamp}_${shortUserId}`;
    
    // Ensure receipt is not longer than 40 characters
    const receiptFinal = receipt.length > 40 ? receipt.slice(0, 40) : receipt;

    const options = {
      amount: Math.round(amount * 100), // Convert to paisa
      currency,
      receipt: receiptFinal,
      payment_capture: 1, // Auto capture
    };

    console.log("Razorpay order options:", options);
    console.log("Receipt length:", receiptFinal.length);

    const order = await razorpay.orders.create(options);

    console.log("Razorpay order created successfully:", order.id);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    });
  } catch (error: any) {
    console.error("Razorpay Order Creation Error Details:");
    console.error("Error Message:", error.message);
    console.error("Error Code:", error.error?.code);
    console.error("Error Description:", error.error?.description);
    console.error("Full Error:", JSON.stringify(error, null, 2));
    
    // Handle specific Razorpay errors
    if (error.error?.code === "BAD_REQUEST_ERROR") {
      return res.status(400).json({
        success: false,
        message: error.error.description || "Invalid request to Razorpay",
      });
    }
    
    if (error.error?.code === "UNAUTHORIZED") {
      return res.status(401).json({
        success: false,
        message: "Invalid Razorpay credentials",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create payment order",
      error: error.message || "Unknown error",
      details: error.error?.description,
    });
  }
};

// Verify Payment
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = req.body;

    const userId = (req as any).user.id;

    console.log("Verifying payment for order:", razorpay_order_id);

    // Generate signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      console.error("Payment verification failed: Invalid signature");
      return res.status(400).json({
        success: false,
        message: "Payment verification failed - Invalid signature",
      });
    }

    // Save order to database
    const { items, subtotal, shippingCost, total, shippingAddress } = orderData;

    const newOrder = await Order.create({
      userId,
      items,
      subtotal,
      shippingCost,
      total,
      status: "Paid",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      paymentMethod: "razorpay",
      shippingAddress,
    });

    console.log("Payment verified and order saved:", newOrder._id);

    res.status(200).json({
      success: true,
      message: "Payment verified and order placed successfully",
      order: newOrder,
    });
  } catch (error: any) {
    console.error("Payment Verification Error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
};