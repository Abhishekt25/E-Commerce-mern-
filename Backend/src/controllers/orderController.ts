import { Request, Response } from "express";
import Order from "../models/Order";

export const placeOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { items, subtotal, shippingCost, total, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const newOrder = await Order.create({
      userId,
      items,
      subtotal,
      shippingCost,
      total,
      status: paymentMethod === "cod" ? "Pending" : "Paid",
      paymentMethod: paymentMethod || "cod",
      shippingAddress,
    });

    return res.status(201).json({
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error: any) {
    console.error("Order Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Add this new function for fetching user orders
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // Find all orders for this user
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 }) // Most recent first
      .populate({
        path: "items.productId",
        select: "name image", // Only get name and image
      });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error: any) {
    console.error("Get User Orders Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'email name')
      .populate('items.productId', 'name')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


