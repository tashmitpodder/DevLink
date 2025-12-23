// server.js

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboard.js";
import profileRoutes from "./routes/profileRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";

dotenv.config();

const app = express();

// ✅ 1. CORS MUST COME FIRST
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// ✅ 2. HANDLE PREFLIGHT REQUESTS (THIS FIXES YOUR ERROR)
app.options("*", cors());

// ✅ 3. JSON PARSER (must be after CORS)
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", profileRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/teams", teamRoutes);

// Port & DB
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
   

// Connect to MongoDB
mongoose.connect(MONGO_URI)                   
  .then(() => console.log("✅ MongoDB connected"))  
  .catch((err) => console.error("❌ MongoDB error:", err)); 

// Basic test route
app.get("/", (req, res) => {
  res.send("API is running... 🚀");  //who will make this get message?
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
