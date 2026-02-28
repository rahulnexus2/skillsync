import User from "../models/UserModel.js";
import Admin from "../models/AdminModel.js";
export const signupAuth = async (req, res, next) => {
  try {
    const { email, adminKey } = req.body;

    // Check if email already exists in either model
    const existingUser = await User.findOne({ email });
    const existingAdmin = await Admin.findOne({ email });

    if (existingUser || existingAdmin) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // If adminKey is provided, validate it
    if (adminKey) {
      const validAdminKey = process.env.ADMIN_KEY;

      if (adminKey !== validAdminKey) {
        return res.status(403).json({ message: "Invalid admin key" });
      }

      req.role = "admin";
    } else {
      req.role = "user";
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};








