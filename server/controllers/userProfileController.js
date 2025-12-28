import User from "../models/UserModel.js";
import QuizAttempt from "../models/QuizAttemptModel.js";
import Application from "../models/ApplicationModel.js";

// Get User Profile with Aggregated Stats
export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. Fetch Basic User Info
        const user = await User.findById(userId).select("-password -otp -otpExpires");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 2. Aggregate Quiz Stats
        const quizStats = await QuizAttempt.aggregate([
            { $match: { userId: userId } },
            {
                $group: {
                    _id: null,
                    totalScore: { $sum: "$score" },
                    quizzesTaken: { $sum: 1 },
                    averagePercentage: { $avg: "$percentage" }
                }
            }
        ]);

        const stats = quizStats.length > 0 ? quizStats[0] : { totalScore: 0, quizzesTaken: 0, averagePercentage: 0 };

        // 3. Fetch Job Applications
        const applications = await Application.find({ userId: userId })
            .populate({
                path: 'jobId',
                select: 'jobTitle company location jobType'
            })
            .sort({ appliedAt: -1 });

        // Combine everything
        res.status(200).json({
            user,
            stats: {
                totalScore: stats.totalScore,
                quizzesTaken: stats.quizzesTaken,
                averagePercentage: Math.round(stats.averagePercentage || 0)
            },
            applications
        });

    } catch (error) {
        console.error("Profile Fetch Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Update User Profile (Phone, Education, Skills)
export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { phone, education, skills } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    phone,
                    education,
                    skills, // Expecting array of strings
                }
            },
            { new: true, runValidators: true }
        ).select("-password -otp -otpExpires");

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("Profile Update Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
