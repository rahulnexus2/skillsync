import express from "express";



import { getChatStatus } from "../controllers/applicationController.js";



import { userAuth } from "../Auth/userAuth.js";


import { applyForJob } from "../controllers/applicationController.js";
const router = express.Router();



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
