import express from 'express';
import multer from 'multer';
import { scoreResume } from '../controllers/resumeController.js';
import { userAuth } from '../Auth/userAuth.js';

const router = express.Router();
console.log("Resume route loaded");


// Configure Multer (Memory Storage for temporary processing)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post('/analyze', userAuth, upload.single('resume'), scoreResume);

export default router;
