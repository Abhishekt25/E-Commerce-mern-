import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Admin login attempt for:', email);

    // 1️⃣ Find the user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ No user found with email:', email);
      return res.status(404).json({ message: 'User does not exist' });
    }

    // 2️⃣ Check active
    if (!user.isActive) {
      return res.status(403).json({ message: 'User inactive' });
    }

    // 3️⃣ Ensure admin
    if (user.role !== 'admin') {
      console.log('❌ User is not admin, role:', user.role);
      return res.status(403).json({ message: 'Admin access required' });
    }

    // 4️⃣ Validate password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('❌ Invalid password for user:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 5️⃣ Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    console.log('✅ Admin login successful for:', email);
    res.status(200).json({
      message: 'Admin login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('💥 Admin login error:', error);
    res.status(500).json({ message: 'Server error during admin login' });
  }
});


export default router;
