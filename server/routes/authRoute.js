import express from "express";
import { signupAuth } from "../Auth/signupAuth.js";
import { loginAuth } from "../Auth/loginAuth.js";
import { signup } from "../controllers/signup.js";
import { login } from "../controllers/login.js";
import { forgotPassword } from "../controllers/forgotPassword.js";
import { resetPassword } from "../controllers/resetPassword.js";


const router = express.Router();

router.post("/signup", signupAuth, signup);
router.post("/login", loginAuth, login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
