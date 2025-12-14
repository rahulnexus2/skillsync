import express from "express";

import { userSignup } from "../controllers/userSignup.js";
import { userLogin } from "../controllers/userLogin.js";
import { signupAuth } from "../Auth/signupAuth.js";

import { loginAuth } from "../Auth/loginAuth.js";
import { userAuth } from "../Auth/userAuth.js";

import { viewQuiz } from "../controllers/viewQuiz.js";
import { viewQuizById } from "../controllers/viewQuizById.js";
import { viewJobById } from "../controllers/viewJobById.js";
import { submitQuiz } from "../controllers/submitQuiz.js";
import { getQuizAttempts } from "../controllers/getQuizAttempts.js";
import { applyForJob } from "../controllers/applicationController.js";

const router = express.Router();

router.post("/signup", signupAuth, userSignup);
router.post("/login", loginAuth, userLogin);

// Quiz routes for users
router.get("/quizzes", viewQuiz);
router.get("/quizzes/:id", viewQuizById);
router.get("/jobs/:id", viewJobById);
router.post("/submitquiz", userAuth, submitQuiz);
router.get("/quizattempts", userAuth, getQuizAttempts);
router.post("/apply/:jobId", userAuth, applyForJob);



export default router;
