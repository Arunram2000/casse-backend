import { Request, Response } from "express";
import Song from "../models/Song";
import Album from "../models/Album";
import Artist from "../models/Artist";

export const getPendingSongs = async (_req: Request, res: Response) => {
  try {
    const songs = await Song.find({ status: "pending" })
      .populate("artistIds", "name")
      .populate("albumId", "title albumType")
      .populate("createdBy", "phoneNumber")
      .sort({ createdAt: -1 });
    
    return res.json({ songs });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch pending songs" });
  }
};

export const updateSongStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, isActive } = req.body as { status?: string; isActive?: boolean };
  if (!status || !["approved", "rejected", "pending"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }
  const song = await Song.findByIdAndUpdate(id, { status, isActive: true }, { new: true });
  if (!song) return res.status(404).json({ message: "Song not found" });
  return res.json({ song });
};


