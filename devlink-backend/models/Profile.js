import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bio: { type: String, default: "" },
    skills: { type: [String], default: [] }, //what does string in [] mean? - is it a syntax for javascript?
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    location: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
