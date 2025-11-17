import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/db';
<<<<<<< HEAD
import productRoutes from './Routes/productRoutes';
import AdminRoutes from './Routes/adminRoutes';
=======
import AuthRoutes from './Routes/authRoutes';
import AdminRoutes from './Routes/admin';
>>>>>>> ab-clean

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

<<<<<<< HEAD
// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// CORS Configuration
=======
>>>>>>> ab-clean
const allowedOrigins = [
  'http://localhost:5173',
  'https://shopab.vercel.app',
];

app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

<<<<<<< HEAD
// Routes
app.use('/api/products', productRoutes);
app.use('/api/', AdminRoutes);

// Start Server with DB connection 
=======
app.use('/api', AuthRoutes);
app.use('/api/admin', AdminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

>>>>>>> ab-clean
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
