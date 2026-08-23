import mongoose from "mongoose";

const joinRequestSchema = new mongoose.Schema({
  team:      { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message:   { type: String, default: "" },
  status:    { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  type:      { type: String, enum: ["join", "invite"], default: "join" },
}, { timestamps: true });

joinRequestSchema.index({ team: 1, candidate: 1 }, { unique: true });

export default mongoose.model("JoinRequest", joinRequestSchema);
