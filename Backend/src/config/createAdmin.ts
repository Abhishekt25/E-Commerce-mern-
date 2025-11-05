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
