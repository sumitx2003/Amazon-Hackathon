import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  greenCredits: { type: Number, default: 0 },
  
  // ⚡ FIX: Added avatar configuration to save image Base64 buffers permanently
  avatar: { type: String, default: "" },
  
  // ⚡ FIX: Added location property used by ProfilePortfolio input bindings
  location: { type: String, default: "Jaipur, India" },
  
  // ⚡ FIX: Added joinedDate context property to match profile card metadata
  joinedDate: { type: String, default: "2026-01" },

  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model("User", userSchema);