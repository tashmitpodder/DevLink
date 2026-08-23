import express from "express";
import Position from "../models/Position.js";
import Team from "../models/Teams.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// GET /api/positions?teamId=xxx  — list positions for a team
router.get("/", async (req, res) => {
  try {
    const { teamId } = req.query;
    if (!teamId) return res.status(400).json({ message: "teamId required" });
    const positions = await Position.find({ team: teamId }).populate("filledBy", "name email");
    res.json(positions);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/positions  — owner creates a position
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { teamId, roleTitle, description, requiredSkills } = req.body;
    if (!teamId || !roleTitle) return res.status(400).json({ message: "teamId and roleTitle are required" });

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });
    if (team.owner.toString() !== req.user.id)
      return res.status(403).json({ message: "Only the owner can add positions" });

    const skills = Array.isArray(requiredSkills)
      ? requiredSkills
      : typeof requiredSkills === "string"
        ? requiredSkills.split(",").map(s => s.trim()).filter(Boolean)
        : [];

    const position = await Position.create({ team: teamId, roleTitle, description: description || "", requiredSkills: skills });
    res.status(201).json(position);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/positions/:id  — owner marks as Filled / Open, or deletes
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { status, filledBy } = req.body;
    const position = await Position.findById(req.params.id).populate("team");
    if (!position) return res.status(404).json({ message: "Position not found" });
    if (position.team.owner.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    if (status) position.status = status;
    if (filledBy !== undefined) position.filledBy = filledBy || null;
    await position.save();
    res.json(position);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/positions/:id  — owner deletes a position
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const position = await Position.findById(req.params.id).populate("team");
    if (!position) return res.status(404).json({ message: "Position not found" });
    if (position.team.owner.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });
    await Position.deleteOne({ _id: req.params.id });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
