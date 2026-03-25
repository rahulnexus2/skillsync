import express from "express";
import rateLimit from "express-rate-limit";
import { signupAuth } from "../Auth/signupAuth.js";
import { loginAuth } from "../Auth/loginAuth.js";
import { signup } from "../controllers/signup.js";
import { login } from "../controllers/login.js";
import { forgotPassword } from "../controllers/forgotPassword.js";
import { resetPassword } from "../controllers/resetPassword.js";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests. Try again later." },
});

const router = express.Router();

router.post("/signup", authLimiter, signupAuth, signup);
router.post("/login", authLimiter, loginAuth, login);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", authLimiter, resetPassword);

export default router;
