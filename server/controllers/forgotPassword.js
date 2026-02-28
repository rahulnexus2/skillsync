
import crypto from "crypto";
import User from "../models/UserModel.js";
import Admin from "../models/AdminModel.js";
import transporter from "../config/nodemailer.js";

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check both models
    let account = await User.findOne({ email });
    let model = "user";

    if (!account) {
      account = await Admin.findOne({ email });
      model = "admin";
    }

    if (!account) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save OTP to the account
    account.otp = otp;
    account.otpExpires = otpExpires;
    await account.save();

    // Send OTP email
    await transporter.sendMail({
      from: `"Job Portal" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #4f46e5;">Password Reset Request</h2>
          <p>Hi <strong>${account.username}</strong>,</p>
          <p>Use the OTP below to reset your password. It expires in <strong>15 minutes</strong>.</p>
          <div style="text-align: center; margin: 32px 0;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #4f46e5;">${otp}</span>
          </div>
          <p style="color: #6b7280; font-size: 13px;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
  res.status(500).json({ message: "Server error", error: error.message });
  
  }
};










