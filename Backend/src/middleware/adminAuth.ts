import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.adminToken;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    req.admin = decoded; // attach admin to request
    next();

  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
