import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  question:  { type: String, required: true },
  answer:    { type: String, required: true },
  user:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  mode:      { type: String, enum: ["patient", "doctor"], default: "patient" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Conversation", conversationSchema);
