import Mongoose from "mongoose";

const userSchema = new Mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user"],
      default: "user"

    },

    otp: {
      type: String,
    },

    otpExpires: {
      type: Date,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    education: {
      type: String, // Keeping it simple for now, e.g., "B.Tech in CS"
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const User = Mongoose.model("User", userSchema) || Mongoose.models.User;

export default User;
