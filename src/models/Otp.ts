import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOtp extends Document {
  phoneNumber: string;
  code: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

const OtpSchema = new Schema<IOtp>({
  phoneNumber: { type: String, required: true, index: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: true },
  used: { type: Boolean, default: false },
}, { timestamps: { createdAt: true, updatedAt: false } });

OtpSchema.index({ phoneNumber: 1, code: 1, used: 1 });

export const Otp: Model<IOtp> = mongoose.models.Otp || mongoose.model<IOtp>("Otp", OtpSchema);
export default Otp;


