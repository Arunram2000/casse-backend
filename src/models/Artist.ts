import mongoose, { Schema, Document, Model } from "mongoose";

export interface IArtist extends Document {
  name: string;
  bio?: string;
  genres: string[];
  profileImageUrl?: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

const ArtistSchema = new Schema<IArtist>({
  name: { type: String, required: true, index: true },
  bio: String,
  genres: { type: [String], default: [] },
  profileImageUrl: String,
  verified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Artist: Model<IArtist> = mongoose.models.Artist || mongoose.model<IArtist>("Artist", ArtistSchema);
export default Artist;


