import express from "express";
import multer from "multer";
import rateLimit from "express-rate-limit";
import { scoreResume } from "../controllers/resumeController.js";
import { userAuth } from "../Auth/userAuth.js";

const resumeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many resume analyses. Try again later." },
});

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post(
  "/analyze",
  resumeLimiter,
  userAuth,
  upload.single("resume"),
  scoreResume
);

export default router;
