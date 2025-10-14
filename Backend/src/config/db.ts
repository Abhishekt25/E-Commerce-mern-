import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || '';

export const connectDB = async (): Promise<void> => {
  if (!MONGO_URI) {
    console.error(' MongoDB URI not found in environment variables');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // optional: timeout for faster errors
    });
    console.log(' MongoDB Atlas connected successfully');
  } catch (error) {
    console.error(' MongoDB Atlas connection error:', error);
    process.exit(1);
  }
};
