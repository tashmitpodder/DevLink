//what is happening here?

import express from "express";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Example of a protected route
router.get("/dashboard", authMiddleware, (req, res) => {
  res.json({ message: "Welcome to your dashboard!", user: req.user });
});

export default router;