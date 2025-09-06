import express from "express";
import {adminSignupAuth} from "../Auth/adminSignupAuth.js";
import {adminLoginAuth} from "../Auth/adminLoginAuth.js";

import {adminSignup} from  "../controllers/adminSignup.js"
import {adminLogin} from "../controllers/adminLogin.js"


const router = express.Router();

router.post("/signup", adminSignupAuth, adminSignup);
router.post("/login", adminLoginAuth, adminLogin);

export default router;
