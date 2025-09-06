import mongoose from "mongoose";

const oauthUserSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true }, // sparse allows null values
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  displayName: { type: String },
  photo: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("OAuthUser", oauthUserSchema);
