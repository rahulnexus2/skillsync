import bcrypt from "bcryptjs";
import Admin from "../models/AdminModel.js";

export const adminLoginAuth = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });

    if (!existingAdmin) {
      return res.status(400).json({ message: "Email not registered" });
    }

    const isMatch = await bcrypt.compare(password, existingAdmin.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    req.user = existingAdmin; // ✅ keep this

    next();
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
