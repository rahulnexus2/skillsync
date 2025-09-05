import config from "../config/config.js";
import bcrypt from "bcryptjs";

import User from "../models/UserModel.js";

export const userSignup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const hashedPass = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPass,
    });

    await newUser.save();

    return res.status(201).json({
      user: {
        message: "user regestired sucessfully",
        id: newUser.id,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
