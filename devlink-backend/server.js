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

// Create an Express app
const app = express();  //why do we need to create an express app? -- it is easier to create the middleware and routes using express and it's inbuilt functions.
app.use(cors({
  origin: "devlink-ruby.vercel.app",
  credentials: true
}));          
app.use(express.json());    //still can't figure out this middleware part

// Routes
app.use("/api/auth", authRoutes);     // auth routes
app.use("/api", dashboardRoutes);     // dashboard route
app.use("/api", profileRoutes); // import dashboard routes
app.use("/api/posts", postRoutes);
app.use("/api/teams", teamRoutes);

// Get PORT and MongoDB URI from .env
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
