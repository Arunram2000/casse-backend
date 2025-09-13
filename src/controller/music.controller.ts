import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Album from "../models/Album";
import Song from "../models/Song";
import Artist from "../models/Artist";
import { uploadToFirebase } from "../utils/firebaseStorage";

export const uploadMusic = async (req: AuthRequest, res: Response) => {
  try {
    const { 
      type: releaseType, 
      title, 
      artistName, 
      language, 
      primaryGenre, 
      releaseDate, 
      releaseTime, 
      lyrics, 
      tags,
      songNames 
    } = req.body as any;

    // Create or find artist
    let artist = await Artist.findOne({ name: artistName });
    if (!artist) {
      artist = await Artist.create({
        name: artistName,
        genres: [primaryGenre],
        verified: false,
      });
    }

    // Parse tags array
    const tagsArray = Array.isArray(tags) ? tags : (tags ? [tags] : []);
    const genres = [primaryGenre, ...tagsArray];

    // Parse release date and time
    let releaseDateTime;
    if (releaseDate) {
      const [day, month, year] = releaseDate.split('/');
      releaseDateTime = new Date(`${year}-${month}-${day}`);
      if (releaseTime) {
        const [hours, minutes, seconds] = releaseTime.split(':');
        releaseDateTime.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds));
      }
    }

    // Create album/release
    const album = await Album.create({
      title,
      artistIds: [artist._id],
      albumType: releaseType,
      genres,
      releaseDate: releaseDateTime,
      totalTracks: Array.isArray(req.files) ? req.files.length : 0,
    });

    // Create songs
    const files = (req.files as Express.Multer.File[]) || [];
    const songNamesArray = Array.isArray(songNames) ? songNames : (songNames ? [songNames] : []);
    const createdSongs = [] as any[];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const songName = songNamesArray[i] || file.originalname;
      
      // Upload to Firebase Storage
      const uploadResult = await uploadToFirebase(file, "songs");
      
      const song = await Song.create({
        title: songName,
        artistIds: [artist._id],
        albumId: album._id,
        trackNumber: i + 1,
        genres,
        audioFiles: { 
          normal: uploadResult.url,
          high: uploadResult.url // Same URL for now, can be different quality later
        },
        lyrics: lyrics ? { text: lyrics, language } : undefined,
        releaseDate: releaseDateTime,
        status: "pending",
        createdBy: req.user!._id,
        isActive: false,
      });
      createdSongs.push(song);
    }

    return res.json({ 
      success: true, 
      data: { 
        album, 
        songs: createdSongs,
        artist 
      } 
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ 
      success: false,
      message: "Upload failed" 
    });
  }
};

export const listActiveSongs = async (_req: AuthRequest, res: Response) => {
  const songs = await Song.find({ isActive: true, status: "approved" }).sort({ createdAt: -1 });
  return res.json({ songs });
};


