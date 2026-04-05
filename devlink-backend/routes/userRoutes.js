import express from "express";
import User from "../models/User.js";
import Team from "../models/Teams.js";

const router = express.Router();

// GET all users with team count
router.get("/", async (req, res) => {
  try {
    // get all users (exclude password)
    const users = await User.find().select("-password");

    // get all teams
    const teams = await Team.find();

    // map users with team count
    const result = users.map(user => {
      const teamCount = teams.filter(team =>
        team.members.includes(user._id)
      ).length;

      return {
        ...user.toObject(),
        teamCount
      };
    });

    res.json(result);
  } catch (err) {
    console.error("GET /api/users error:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

export default router;