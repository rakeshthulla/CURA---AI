import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import Conversation from "../models/Conversation.js";

// POST /ask handler
export const ask = async (req, res) => {
  try {
    const { question, mode } = req.body || {};
    if (!question || typeof question !== "string" || !question.trim()) {
      return res.status(400).json({ message: "Question is required" });
    }

    let answer = null;
    const MODEL_URL = process.env.MODEL_URL; // set to your Flask/ngrok URL if Node should forward to Flask

    // Try external model server (Flask) if configured
    if (MODEL_URL) {
      try {
        const endpoint = `${MODEL_URL.replace(/\/$/, "")}/ask`;
        const resp = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, mode }),
        });
        if (resp.ok) {
          const data = await resp.json().catch(() => ({}));
          answer = data?.answer || data?.reply || data?.result || null;
        } else {
          const text = await resp.text().catch(() => "");
          console.warn("Model server returned", resp.status, text);
        }
      } catch (err) {
        console.warn("Error calling model server:", err?.message || err);
      }
    }

    // Final fallback: echo
    if (!answer) {
      answer = `Echo (${mode || "patient"}): ${question}`;
    }

    // Extract user id from Bearer token (optional)
    let userId = null;
    try {
      const authHeader = req.headers.authorization || "";
      if (authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded?.id || decoded?._id || null;
      }
    } catch (e) {
      // ignore invalid token
    }

    // Save conversation to MongoDB (non-blocking)
    try {
      await Conversation.create({
        question,
        answer,
        user: userId || undefined,
        mode: mode || "patient",
      });
    } catch (saveErr) {
      console.error("Failed to save conversation:", saveErr);
      // continue — still return answer
    }

    return res.status(200).json({ answer });
  } catch (err) {
    console.error("Ask handler error:", err);
    return res.status(500).json({ message: "Server error handling ask request" });
  }
};

// New: return conversation history for authenticated user
export const getHistory = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization required" });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const userId = decoded?.id || decoded?._id;
    if (!userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const conversations = await Conversation.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return res.status(200).json({ conversations });
  } catch (err) {
    console.error("getHistory error:", err);
    return res.status(500).json({ message: "Server error fetching history" });
  }
};
