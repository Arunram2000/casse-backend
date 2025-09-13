import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUserProfile {
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  bio?: string;
}

export interface IUser extends Document {
  email?: string;
  username?: string;
  phoneNumber: string;
  profile?: IUserProfile;
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  isVerified: boolean;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
}

const UserProfileSchema = new Schema<IUserProfile>({
  firstName: String,
  lastName: String,
  profileImageUrl: String,
  bio: String,
}, { _id: false });

const UserSchema = new Schema<IUser>({
  email: { type: String, index: true, sparse: true },
  username: { type: String, index: true, sparse: true },
  phoneNumber: { type: String, required: true, unique: true, index: true },
  profile: { type: UserProfileSchema, default: {} },
  followers: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  following: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  isVerified: { type: Boolean, default: false },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  lastLoginAt: Date,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;


