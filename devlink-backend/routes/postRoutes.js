// routes/postRoutes.js
import express from "express";
import Post from "../models/Post.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

/* GET /api/posts */
router.get("/", async (_req, res) => {
  const posts = await Post.find()
    .populate("author", "name email")
    .sort({ createdAt: -1 });
  res.json(posts);
});

/* GET /api/posts/me */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id })
      .populate("author", "name email")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch {
    res.status(500).json({ message: "Failed to fetch user posts" });
  }
});

/* POST /api/posts */
router.post("/", authMiddleware, async (req, res) => {
  const { content, tags = [] } = req.body;
  if (!content?.trim()) {
    return res.status(400).json({ message: "Content is required" });
  }

  const post = await Post.create({
    author: req.user.id,
    content: content.trim(),
    tags,
  });

  const full = await post.populate("author", "name email");
  res.status(201).json(full);
});

/* PUT /api/posts/:id (edit) */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { content, tags } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (content !== undefined) post.content = content.trim();
    if (tags !== undefined) post.tags = tags;

    await post.save();
    const updated = await post.populate("author", "name email");
    res.json(updated);
  } catch {
    res.status(500).json({ message: "Failed to update post" });
  }
});

/* 🗑️ DELETE /api/posts/:id */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // 1️⃣ Check exists
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // 2️⃣ Ownership check
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete" });
    }

    // 3️⃣ Delete
    await post.deleteOne();

    res.json({ message: "Post deleted", id: req.params.id });
  } catch {
    res.status(500).json({ message: "Failed to delete post" });
  }
});

export default router;
