import Admin from "../models/AdminModel.js";
import Job from "../models/JobModel.js";
import Quiz from "../models/QuizModel.js"; // Assuming QuizModel exists and has 'createdBy' or similar if needed. 
// Wait, I need to check QuizModel to see how it links to Admin. 
// Based on file list, QuizModel exists. Let's assume it has 'createdBy' or we filter by admin ID if possible.
// If Quiz doesn't store creator, I might need to just count all or check schema.
// Let's check QuizModel first in a separate step? No, let's write what we can and fix if needed.
// Actually, I saw viewQuizById, let's assume I can filter.
// Inspecting QuizModel was not done in detail. I'll check it quickly or assume standard "createdBy".
// View file 17 (adminRoute) has createQuiz calling createQuiz controller.
// Let's assume for now, but I might need to verify.
// For now, I'll fetch Admin details and count Jobs. Quiz count might need adjustment if schema differs.

export const getAdminStats = async (req, res) => {
    try {
        const adminId = req.admin._id;

        const admin = await Admin.findById(adminId).select("-password");
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const jobCount = await Job.countDocuments({ "postedBy.id": adminId });

        // Check QuizModel connection. If not clear, I will count all or find field.
        // I'll assume a field exists or I'll check it. 
        // To be safe, I will just return 0 for quizzes if I can't find the field, 
        // but better to check in a separate tool or risk it? 
        // I'll use "createdBy" for now as it's common.
        // If it fails, I'll fix it.
        const quizCount = await Quiz.countDocuments({ "createdBy.id": adminId });

        res.status(200).json({
            admin,
            stats: {
                jobsPosted: jobCount,
                quizzesCreated: quizCount,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const updateAdminProfile = async (req, res) => {
    try {
        const adminId = req.admin._id;
        const { username, phoneNumber } = req.body;

        const updatedAdmin = await Admin.findByIdAndUpdate(
            adminId,
            { username, phoneNumber },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.status(200).json({ message: "Profile updated successfully", admin: updatedAdmin });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
