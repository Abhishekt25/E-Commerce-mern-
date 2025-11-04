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
    console.log('🔑 Password: admin123');
    console.log('⚠️  Change this password immediately after first login!');
    
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdmin();