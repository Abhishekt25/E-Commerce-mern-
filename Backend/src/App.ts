import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/db';
import productRoutes from './Routes/productRoutes';
import AdminRoutes from './Routes/adminRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://shopab.vercel.app',
  // Add more domains if needed
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like Postman or Curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // allow cookies, sessions, tokens
}));


// Routes
app.use('/api/products', productRoutes);
app.use('/api/', AdminRoutes);

// Start Server with DB connection 
const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
};

startServer();
