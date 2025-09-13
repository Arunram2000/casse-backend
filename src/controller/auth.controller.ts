import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";
import { config } from "../config";
import Otp from "../models/Otp";
import User from "../models/User";

function generateOtpCode(): string {
  return "1234";
  // return Math.floor(100000 + Math.random() * 900000).toString();
}

export const requestOtp = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const { phoneNumber } = req.body
    if (!phoneNumber) return res.status(400).json({ message: "phoneNumber required" });

    const code = generateOtpCode();
    const expiresAt = dayjs().add(5, "minute").toDate();
    await Otp.create({ phoneNumber, code, expiresAt, used: false });
    return res.json({ message: "OTP sent", demo: code });
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const { phoneNumber, code } = req.body as { phoneNumber?: string; code?: string };
    if (!phoneNumber || !code) return res.status(400).json({ message: "phoneNumber and code required" });

    const otp = await Otp.findOne({ phoneNumber, code, used: false, expiresAt: { $gt: new Date() } }).sort({ createdAt: -1 });
    if (!otp) return res.status(400).json({ message: "Invalid or expired OTP" });

    otp.used = true;
    await otp.save();

    let user = await User.findOne({ phoneNumber });
    if (!user) {
      user = await User.create({ phoneNumber, isVerified: true });
    }

    const token = jwt.sign({ userId: (user._id as any).toString() }, config.JWT_SECRET, { expiresIn: "1y" });
    return res.json({ token, user: { id: user._id, phoneNumber: user.phoneNumber, role: user.role } });
  } catch (error) {
    next(error);
  }
};

export const verifyToken = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ valid: false });
  return res.json({
    valid: true,
    user: { id: req.user._id, phoneNumber: req.user.phoneNumber, role: req.user.role },
  });
};


