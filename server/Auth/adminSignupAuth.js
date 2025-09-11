import Admin from "../models/AdminModel.js";

export const adminSignupAuth = async (req, res, next) => {
  try {
    const { email } = req.body; 

    const ExistingAdmin = await Admin.findOne({ email });

    if (ExistingAdmin) {
      return res.status(400).json({ message: "Email is already registerd " });
    }

    next();

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
