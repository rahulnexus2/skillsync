import express from "express";

import { userSignup } from "../controllers/userSignup.js";
import { userLogin } from "../controllers/userLogin.js";
import { signupAuth } from "../Auth/signupAuth.js";

import { loginAuth } from "../Auth/loginAuth.js";

const router = express.Router();

router.post("/signup", signupAuth, userSignup);
router.post("/login", loginAuth, userLogin);

export default router;
