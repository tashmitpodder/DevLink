import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import Profile from "../models/Profile.js";

const router = express.Router();

// GET current user's profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      // create a blank profile if not found
      profile = await Profile.create({ user: req.user.id });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const updates = req.body;
    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: updates },
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
