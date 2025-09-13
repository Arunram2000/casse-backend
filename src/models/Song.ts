import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISongLyrics {
  text?: string;
  language?: string;
}

export interface IAudioFiles {
  normal?: string;
  high?: string;
}

export type SongStatus = "pending" | "approved" | "rejected";

export interface ISong extends Document {
  title: string;
  artistIds: mongoose.Types.ObjectId[];
  albumId: mongoose.Types.ObjectId;
  trackNumber?: number;
  duration?: number; // ms
  genres: string[];
  audioFiles: IAudioFiles;
  lyrics?: ISongLyrics;
  releaseDate?: Date;
  status: SongStatus; // admin approval
  createdBy: mongoose.Types.ObjectId; // uploader user id
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

const LyricsSchema = new Schema<ISongLyrics>({
  text: String,
  language: String,
}, { _id: false });

const AudioFilesSchema = new Schema<IAudioFiles>({
  normal: String,
  high: String,
}, { _id: false });

const SongSchema = new Schema<ISong>({
  title: { type: String, required: true },
  artistIds: [{ type: Schema.Types.ObjectId, ref: "Artist", required: true }],
  albumId: { type: Schema.Types.ObjectId, ref: "Album", required: true },
  trackNumber: Number,
  duration: Number,
  genres: { type: [String], default: [] },
  audioFiles: { type: AudioFilesSchema, required: true },
  lyrics: { type: LyricsSchema, default: {} },
  releaseDate: Date,
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending", index: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  isActive: { type: Boolean, default: false, index: true },
}, { timestamps: true });

export const Song: Model<ISong> = mongoose.models.Song || mongoose.model<ISong>("Song", SongSchema);
export default Song;


