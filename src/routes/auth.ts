import { Router } from "express";
import { requestOtp, verifyOtp, verifyToken } from "../controller/auth.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);
router.get("/verify-token", requireAuth, verifyToken);

export default router;


