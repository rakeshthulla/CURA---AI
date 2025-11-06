import express from "express";
import { registerUser, loginUser, googleAuthUrl, googleAuthCallback, forgotPassword, resetPassword } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);

// Password reset endpoints
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Google OAuth flow
router.get("/google/url", googleAuthUrl);
router.get("/google/callback", googleAuthCallback);

export default router;
