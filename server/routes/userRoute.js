import express from "express";

import { userSignup } from "../controllers/userSignup.js";
import { userLogin } from "../controllers/userLogin.js";
import { signupAuth } from "../Auth/signupAuth.js";
import { getChatStatus } from "../controllers/applicationController.js";


import { loginAuth } from "../Auth/loginAuth.js";
import { userAuth } from "../Auth/userAuth.js";

import { viewJobById } from "../controllers/viewJobById.js";
import { applyForJob } from "../controllers/applicationController.js";
const router = express.Router();

router.post("/signup", signupAuth, userSignup);
router.post("/login", loginAuth, userLogin);

// Chat route
import { getUserChatHistory } from "../controllers/chatController.js";
router.get("/chat", userAuth, getUserChatHistory);

router.get(
  "/application/chat-status",
  userAuth,
  getChatStatus
);


router.post("/apply/:jobId", userAuth, applyForJob);

// User Profile
import { getUserProfile, updateUserProfile } from "../controllers/userProfileController.js";
router.get("/profile", userAuth, getUserProfile);
router.put("/profile", userAuth, updateUserProfile);



export default router;
