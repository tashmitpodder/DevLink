// routes/posts.js
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("user", "name avatar");

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
