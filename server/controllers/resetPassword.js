import bcrypt from "bcryptjs";
import User from "../models/UserModel.js";
import Admin from "../models/AdminModel.js";

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Check both models
    let account = await User.findOne({ email });

    if (!account) {
      account = await Admin.findOne({ email });
    }

    if (!account) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    // Validate OTP
    if (!account.otp || account.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check expiry
    if (account.otpExpires < new Date()) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear OTP fields
    account.password = hashedPassword;
    account.otp = undefined;
    account.otpExpires = undefined;
    await account.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};