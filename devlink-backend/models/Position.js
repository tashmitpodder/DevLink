import mongoose from "mongoose";

const positionSchema = new mongoose.Schema({
  team:           { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
  roleTitle:      { type: String, required: true, trim: true },
  description:    { type: String, default: "" },
  requiredSkills: [{ type: String, trim: true }],
  status:         { type: String, enum: ["Open", "Filled"], default: "Open" },
  filledBy:       { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
}, { timestamps: true });

export default mongoose.model("Position", positionSchema);
