import { Router } from "express";
import multer from "multer";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { uploadMusic, listActiveSongs } from "../controller/music.controller";

const router = Router();

// Use memory storage for Firebase uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

// POST /music/uploads
// multipart/form-data fields:
// - type (single|ep|album)
// - title (string)
// - artistName (string)
// - language (string)
// - primaryGenre (string)
// - releaseDate (DD/MM/YYYY) optional
// - releaseTime (HH:MM:SS) optional
// - lyrics (string) optional
// - tags[] (array of strings) optional
// - songNames[] (array of strings) optional
// - songs (array of files)
router.post("/uploads", requireAuth, upload.array("songs"), uploadMusic);

// GET /music/active - list active and approved songs for UI
router.get("/active", listActiveSongs as any);

export default router;


