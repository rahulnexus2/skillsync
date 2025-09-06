import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
  try {
    const admin = req.user;
    const token = jwt.sign(
      {
        id: admin._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      token,
      message: "admin logged in sucessfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "server error ",
      error: error.message,
    });
  }
};
