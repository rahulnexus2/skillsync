import bcrypt from "bcryptjs";
import User from "../models/UserModel.js";
import Admin from "../models/AdminModel.js";

export const loginAuth = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // First check User model
    let account = await User.findOne({ email });
    let role = "user";

    // If not found in users, check Admin model
    if (!account) {
      account = await Admin.findOne({ email });
      role = "admin";
    }

    if (!account) {
      return res.status(400).json({ message: "No account found with this email" });
    }

    const isMatch = await bcrypt.compare(password, account.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    req.user = account;
    req.role = role;

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};