import express from "express";
import JoinRequest from "../models/JoinRequest.js";
import Team from "../models/Teams.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// POST /api/join-requests — candidate applies to a team
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { teamId, message } = req.body;
    if (!teamId) return res.status(400).json({ message: "teamId is required" });

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    // Already a member?
    if (team.members.map(String).includes(req.user.id))
      return res.status(400).json({ message: "You are already a member" });

    const request = await JoinRequest.create({
      team: teamId,
      candidate: req.user.id,
      message: message || "",
      type: "join",
    });

    res.status(201).json(request);
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: "You already have a pending request for this team" });
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/join-requests/team/:teamId — owner sees all requests for their team
router.get("/team/:teamId", authMiddleware, async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });
    if (team.owner.toString() !== req.user.id)
      return res.status(403).json({ message: "Only the owner can view requests" });

    const requests = await JoinRequest.find({ team: req.params.teamId, status: "pending" })
      .populate("candidate", "name email");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/join-requests/:id — owner accepts or rejects
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body; // "accepted" or "rejected"
    if (!["accepted", "rejected"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const jr = await JoinRequest.findById(req.params.id).populate("team");
    if (!jr) return res.status(404).json({ message: "Request not found" });
    if (jr.team.owner.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    jr.status = status;
    await jr.save();

    // If accepted, add candidate to team members
    if (status === "accepted") {
      await Team.findByIdAndUpdate(jr.team._id, {
        $addToSet: { members: jr.candidate },
      });
    }

    res.json(jr);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/join-requests/my?teamId=xxx — check current user request status for a team
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const { teamId } = req.query;
    if (!teamId) return res.status(400).json({ message: "teamId required" });
    const jr = await JoinRequest.findOne({ team: teamId, candidate: req.user.id });
    res.json(jr || null);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
