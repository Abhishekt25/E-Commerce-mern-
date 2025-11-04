// routes/authRoutes.ts
import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = express.Router();

// Admin Login
// Add this route to your existing authRoutes.ts
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(' Admin login attempt for:', email);

    // Find user
    const user = await User.findOne({ email });
    if (!user || !user.isActive) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if admin
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    console.log(' Admin login successful for:', email);
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('💥 Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Check current user
router.get("/me", authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
