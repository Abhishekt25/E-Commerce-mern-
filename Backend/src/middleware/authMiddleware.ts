// middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

export interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Try to get token from Authorization header first
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7); // Remove 'Bearer ' prefix
  }
  
  // If not in header, try cookies (for regular users)
  if (!token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token found" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      role: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Alias for backward compatibility
export const protect = verifyToken;

// Admin-only protection
export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  next();
};

// Combined middleware: verify token + admin check
export const adminAuth = [verifyToken, adminOnly];