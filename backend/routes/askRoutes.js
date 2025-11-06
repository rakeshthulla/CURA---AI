import express from "express";
import { ask, getHistory } from "../controllers/askController.js";

const router = express.Router();

// POST /ask  or /api/ask
router.post("/", ask);

// GET /ask/history  (available at /ask/history and /api/ask/history)
router.get("/history", getHistory);

export default router;
