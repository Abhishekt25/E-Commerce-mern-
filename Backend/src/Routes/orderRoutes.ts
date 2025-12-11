import express from "express";
import { placeOrder, getUserOrders , getAllOrders} from "../controllers/orderController";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/place", verifyToken, placeOrder);
router.get("/my-orders", verifyToken, getUserOrders); // Add this route

router.get('/all', verifyToken, getAllOrders);

export default router;