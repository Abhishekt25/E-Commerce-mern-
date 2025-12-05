import express from "express";
import { placeOrder, getUserOrders } from "../controllers/orderController";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/place", verifyToken, placeOrder);
router.get("/my-orders", verifyToken, getUserOrders); // Add this route

export default router;