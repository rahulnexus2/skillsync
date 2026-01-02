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

import { createQuiz } from "../controllers/createQuiz.js";
import { viewQuiz } from "../controllers/viewQuiz.js";
import { viewQuizById } from "../controllers/viewQuizById.js";
import { updateQuiz } from "../controllers/updateQuiz.js";
import { deleteQuiz } from "../controllers/deleteQuiz.js";
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

// Quiz routes
router.post("/createquiz", adminAuth, createQuiz);
router.get("/viewquiz", adminAuth, viewQuiz);
router.get("/viewquiz/:id", adminAuth, viewQuizById);
router.put("/updatequiz/:id", adminAuth, updateQuiz);
router.delete("/deletequiz/:id", adminAuth, deleteQuiz);

// Admin Profile & Stats
router.get("/stats", adminAuth, getAdminStats);
router.put("/update-profile", adminAuth, updateAdminProfile);

// Application Management
router.get("/applications", adminAuth, getAdminApplications);
router.put("/application/:id", adminAuth, updateApplicationStatus);

export default router;
