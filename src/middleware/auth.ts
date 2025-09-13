import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import User, { IUser } from "../models/User";

export interface AuthRequest extends Request {
  user?: IUser;
  files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
    if (!token) {
      return res.status(401).json({ message: "Missing Authorization token" });
    }
    const payload = jwt.verify(token, config.JWT_SECRET) as { userId: string };
    const user = await User.findById(payload.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Invalid user" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};


