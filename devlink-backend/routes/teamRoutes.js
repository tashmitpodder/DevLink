// routes/teamRoutes.js
import express from "express";
import Team from "../models/Teams.js";
import { authMiddleware } from "../middleware/auth.js"; // your JWT middleware

const router = express.Router();

/**
 * Simple slug generator:
 * - lowercases name
 * - replace non-alphanum with hyphens
 * - collapse multiple hyphens
 * If slug exists, caller will append a suffix (handled in create endpoint).
 */
function makeSlug(name) {
  return name
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // non-alphanum -> dash
    .replace(/(^-|-$)+/g, "");   // trim leading/trailing dashes
}

// ----------------- LIST TEAMS -----------------
// GET /api/teams
// optional query: ?q=text  or ?tag=React
router.get("/", async (req, res) => {
  try {
    const { q, tag } = req.query; //what is happening here?
    const filter = {};

    if (q) {
      // simple text search on name or description (case-insensitive)
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    if (tag) {
      // find teams that have this tag
      filter.tags = tag;
    }

    // populate owner's name for UI convenience
    const teams = await Team.find(filter).populate("owner", "name").sort({ createdAt: -1 });
    res.json(teams);
  } catch (err) {
    console.error("GET /api/teams error:", err);
    res.status(500).json({ message: "Failed to list teams" });
  }
});

// -----------------  CREATE TEAM -----------------
// POST /api/teams
// Protected: must be logged in
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, description, tags = [], repo } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ message: "Name is required" });

    // build a base slug
    let baseSlug = makeSlug(name);
    let slug = baseSlug;

    // ensure unique slug - append number until unique (simple approach)
    let attempt = 0;
    while (await Team.findOne({ slug })) {
      attempt += 1;
      slug = `${baseSlug}-${attempt}`;
    }

    const ownerId = req.user.id; // set by authMiddleware

    const team = await Team.create({
      name: name.trim(),
      slug,
      description: description || "",
      tags: Array.isArray(tags) ? tags : (typeof tags === "string" ? tags.split(",").map(t => t.trim()).filter(Boolean) : []),
      repo: repo || "",
      owner: ownerId,
      members: [ownerId], // owner is initial member
    });

    // populate owner data for response (optional)
    await team.populate("owner", "name");

    res.status(201).json(team);
  } catch (err) {
    console.error("POST /api/teams error:", err);
    res.status(500).json({ message: "Failed to create team" });
  }
});

// ----------------- GET TEAM DETAILS -----------------
// GET /api/teams/:slug
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const team = await Team.findOne({ slug }).populate("owner", "name").populate("members", "name email");
    if (!team) return res.status(404).json({ message: "Team not found" });
    res.json(team);
  } catch (err) {
    console.error("GET /api/teams/:slug error:", err);
    res.status(500).json({ message: "Failed to fetch team" });
  }
});

// ----------------- JOIN TEAM -----------------
// POST /api/teams/:slug/join
// Protected: user must be logged in
router.post("/:slug/join", authMiddleware, async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user.id;

    // Atomic add: $addToSet prevents duplicates
    const updated = await Team.findOneAndUpdate(
      { slug },
      { $addToSet: { members: userId } },
      { new: true }
    ).populate("owner", "name");

    if (!updated) return res.status(404).json({ message: "Team not found" });

    res.json(updated);
  } catch (err) {
    console.error("POST /api/teams/:slug/join error:", err);
    res.status(500).json({ message: "Failed to join team" });
  }
});

// ----------------- LEAVE TEAM -----------------
// POST /api/teams/:slug/leave
// Protected: user must be logged in
router.post("/:slug/leave", authMiddleware, async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user.id;

    // Remove user from members array
    const updated = await Team.findOneAndUpdate(
      { slug },
      { $pull: { members: userId } },
      { new: true }
    ).populate("owner", "name");

    if (!updated) return res.status(404).json({ message: "Team not found" });

    res.json(updated);
  } catch (err) {
    console.error("POST /api/teams/:slug/leave error:", err);
    res.status(500).json({ message: "Failed to leave team" });
  }
});

// ----------------- DELETE TEAM (owner only) -----------------
// DELETE /api/teams/:slug
// Protected: only the owner may delete
router.delete("/:slug", authMiddleware, async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user.id;

    // Find team and ensure requester is owner
    const team = await Team.findOne({ slug });
    if (!team) return res.status(404).json({ message: "Team not found" });

    if (team.owner.toString() !== userId) {
      return res.status(403).json({ message: "Only the owner can delete this team" });
    }

    await Team.deleteOne({ slug });
    res.json({ message: "Team deleted" });
  } catch (err) {
    console.error("DELETE /api/teams/:slug error:", err);
    res.status(500).json({ message: "Failed to delete team" });
  }
});

export default router;
