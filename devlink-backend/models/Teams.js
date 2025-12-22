import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true }, // makes it url-friendly and SEO optimised
  description: { type: String, trim: true },
  tags: [{ type: String, trim: true }],
  repo: { type: String, trim: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // includes owner
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("Team", teamSchema);
