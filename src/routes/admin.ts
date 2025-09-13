import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth";
import { getPendingSongs, updateSongStatus } from "../controller/admin.controller";

const router = Router();

// GET /admin/songs/pending - get all pending songs for admin review
router.get("/songs/pending", requireAuth, requireAdmin, getPendingSongs);

// PATCH /admin/songs/:id/status { status: approved|rejected, isActive?: boolean }
router.patch("/songs/:id/status", requireAuth, requireAdmin, updateSongStatus);

export default router;


