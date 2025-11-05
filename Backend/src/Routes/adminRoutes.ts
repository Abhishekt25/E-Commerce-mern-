// routes/authRoutes.ts
import express, { Request, Response } from "express";
import { signup, signin } from "../controllers/authController";
import { verifyToken, AuthRequest } from "../middleware/authMiddleware";
import { User } from "../models/User";
import { adminLogin } from "../controllers/adminController";

const router = express.Router();

//Admin
router.post("/admin/login", adminLogin);  

//  Public routes
router.post("/signup", signup);
router.post("/signin", signin);

//  Protected route - Get logged-in user info
router.get("/user", verifyToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user?.id) {
      return res.status(404).json({ message: "User data not found" });
    }

    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
