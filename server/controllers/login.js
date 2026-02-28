import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const user = req.user;   // set by loginAuth middleware
    const role = req.role;   // "user" or "admin"
     console.log("Login controller hit");
    console.log("req.user:", req.user);
    console.log("req.role:", req.role);

    const token = jwt.sign(
      { id: user._id, role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      role,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
