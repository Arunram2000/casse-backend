import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAlbum extends Document {
  title: string;
  artistIds: mongoose.Types.ObjectId[];
  releaseDate?: Date;
  albumType: "album" | "single" | "ep" | "compilation";
  totalTracks: number;
  genres: string[];
  coverImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

const AlbumSchema = new Schema<IAlbum>({
  title: { type: String, required: true },
  artistIds: [{ type: Schema.Types.ObjectId, ref: "Artist", required: true }],
  releaseDate: Date,
  albumType: { type: String, enum: ["album", "single", "ep", "compilation"], required: true },
  totalTracks: { type: Number, default: 0 },
  genres: { type: [String], default: [] },
  coverImageUrl: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Album: Model<IAlbum> = mongoose.models.Album || mongoose.model<IAlbum>("Album", AlbumSchema);
export default Album;


