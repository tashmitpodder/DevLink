import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import Profile from "../models/Profile.js";
import Teams from "../models/Teams.js"; // ✅ NEW IMPORT

const router = express.Router();

// GET current user's profile + team count
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      // create a blank profile if not found
      profile = await Profile.create({ user: req.user.id });
    }
    // ✅ count how many teams user is part of
    const teamCount = await Teams.countDocuments({
      members: req.user.id,
    });

    // ✅ send profile + team count
    res.json({
      ...profile.toObject(),
      teamCount,
    });

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