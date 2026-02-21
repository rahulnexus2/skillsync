import express from "express";
import { adminSignupAuth } from "../Auth/adminSignupAuth.js";
import { adminLoginAuth } from "../Auth/adminLoginAuth.js";

import { adminSignup } from "../controllers/adminSignup.js"
import { adminLogin } from "../controllers/adminLogin.js"

import { adminAuth } from '../Auth/adminAuth.js'

import { createJob } from '../controllers/createJob.js'
import { viewJob } from "../controllers/viewJob.js"
import { viewJobById } from "../controllers/viewJobById.js"
import { updateJob } from "../controllers/updateJob.js";
import { deleteJob } from "../controllers/deleteJob.js";

import { getAdminStats, updateAdminProfile } from "../controllers/adminProfileController.js";
import { getAdminApplications, updateApplicationStatus } from "../controllers/applicationController.js";

const router = express.Router();

router.post("/signup", adminSignupAuth, adminSignup);
router.post("/login", adminLoginAuth, adminLogin);


router.post("/createjob", adminAuth, createJob);
router.get("/viewjob", viewJob);
router.get("/viewjob/:id", viewJobById);
router.put("/updatejob/:id", adminAuth, updateJob);
router.delete("/deletejob/:id", adminAuth, deleteJob);

// Chat routes
import { getUsersForChat, getAdminChatHistory } from "../controllers/chatController.js";
router.get("/chat/users", adminAuth, getUsersForChat);
router.get("/chat/:userId", adminAuth, getAdminChatHistory);

// Admin Profile & Stats
router.get("/stats", adminAuth, getAdminStats);
router.put("/update-profile", adminAuth, updateAdminProfile);

// Application Management
router.get("/applications", adminAuth, getAdminApplications);
router.put("/application/:id", adminAuth, updateApplicationStatus);

export default router;
