// server.js

// Import required modules
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"; //used for loading the environment variables  
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboard.js";
import profileRoutes from "./routes/profileRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";


// Load environment variables
dotenv.config();

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",       // Vite default
  "http://localhost:3000" 
]

// Create an Express app
const app = express();  //change so that you local port is also allowed -- it will help in makes quick changes.
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());    
// Routes
app.use("/api/auth", authRoutes);     // auth routes
app.use("/api", dashboardRoutes);     // dashboard route
app.use("/api", profileRoutes);  // import dashboard routes
app.use("/api/posts", postRoutes);
app.use("/api/teams", teamRoutes);

// Get PORT and MongoDB URI from .env
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log(" MongoDB connected"))
  .catch((err) => console.error(" MongoDB error:", err));

// Basic test route
app.get("/", (req, res) => {
  res.send("API is running... ");  
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
