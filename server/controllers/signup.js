import bcrypt from "bcryptjs";
import User from "../models/UserModel.js";
import Admin from "../models/AdminModel.js";

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const role = req.role; // set by signupAuth middleware

    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === "admin") {
      const newAdmin = new Admin({ username, email, password: hashedPassword });
      await newAdmin.save();
      return res.status(201).json({ message: "Admin registered successfully", role: "admin" });
    } else {
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();
      return res.status(201).json({ message: "User registered successfully", role: "user" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
