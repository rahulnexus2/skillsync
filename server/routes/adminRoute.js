import express from "express";
import {adminSignupAuth} from "../Auth/adminSignupAuth.js";
import {adminLoginAuth} from "../Auth/adminLoginAuth.js";

import {adminSignup} from  "../controllers/adminSignup.js"
import {adminLogin} from "../controllers/adminLogin.js"

import {adminAuth} from '../Auth/adminAuth.js'

import {createJob} from '../controllers/createJob.js'
import { viewJob } from "../controllers/viewJob.js"
import { updateJob } from "../controllers/updateJob.js";
import { deleteJob } from "../controllers/deleteJob.js";

const router = express.Router();

router.post("/signup", adminSignupAuth, adminSignup);
router.post("/login", adminLoginAuth, adminLogin);


router.post("/createjob",adminAuth,createJob);
router.get("/viewjob",viewJob);
router.put("/updatejob/:id",adminAuth,updateJob);
router.delete("/deletejob/:id",adminAuth,deleteJob);

export default router;
