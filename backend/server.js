import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import askRoutes from "./routes/askRoutes.js";
dotenv.config();
connectDB();

const app = express();

// allow frontend origin; adjust as needed
const allowedOrigin = process.env.CLIENT_ORIGIN || "http://localhost:3000";
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (e.g., mobile apps, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigin === "*" || origin === allowedOrigin) return callback(null, true);
      return callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: false,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
// Add ask route available at both /ask and /api/ask
app.use("/ask", askRoutes);
app.use("/api/ask", askRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
