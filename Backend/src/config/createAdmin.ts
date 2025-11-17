<<<<<<< HEAD
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Admin } from "../models/Admin";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mynode";

const createAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(" Connected to MongoDB");

    const existing = await Admin.findOne({ email: "admin@shopab.com" });
    if (existing) {
      console.log(" Admin already exists!");
      process.exit(0);
    }

    const admin = new Admin({
      name: "Super Admin",
      email: "admin@shopab.com",
      password: "admin123", // This will be hashed in your model pre-save hook
      role: "admin",
    });

    await admin.save();
    console.log(" Admin created successfully!");
    console.log(`Email: ${admin.email}`);
    console.log(`Password: admin123`);
    process.exit(0);
  } catch (error) {
    console.error(" Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
=======
import mongoose from 'mongoose';
import { User } from '../models/User';
import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const createAdmin = async () => {
  try {
    console.log('MONGO_URI:', process.env.MONGO_URI);
    
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    
    await mongoose.connect(process.env.MONGO_URI);

    // Delete existing admin if exists
    await User.deleteOne({ email: 'admin@shopab.com' });
    console.log('🗑️  Removed existing admin user');

    // Create new admin with pre-hashed password
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const admin = new User({
      name: 'Super Admin',
      email: 'admin@shopab.com',
      password: hashedPassword, // Use the hashed password
      role: 'admin'
    });

    await admin.save();
    console.log('✅ Admin user created successfully');
    console.log('📧 Email: admin@shopab.com');
    console.log('🔑 Password: 123');
    console.log('⚠️  Change this password immediately after first login!');
    
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdmin();
>>>>>>> ab-clean
