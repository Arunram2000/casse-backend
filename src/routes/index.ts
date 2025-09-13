import { Router } from "express";
import authRoutes from "./auth";
import musicRoutes from "./music";
import adminRoutes from "./admin";

const router = Router();

router.use("/auth", authRoutes);
router.use("/music", musicRoutes);
router.use("/admin", adminRoutes);

export default router;


