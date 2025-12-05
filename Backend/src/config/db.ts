import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || '';
const NODE_ENV = process.env.NODE_ENV || 'development';

export const connectDB = async (): Promise<void> => {
  if (!MONGO_URI) {
    console.error('MongoDB URI not found in environment variables');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // optional: faster error if connection fails
    });

    if (NODE_ENV === 'production') {
      console.log('MongoDB Atlas connected successfully');
    } else {
      console.log('Local MongoDB connected successfully');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
