import express from "express";
import { createRazorpayOrder, verifyPayment } from "../controllers/paymentController";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/create-order", verifyToken, createRazorpayOrder);
router.post("/verify-payment", verifyToken, verifyPayment);

export default router;