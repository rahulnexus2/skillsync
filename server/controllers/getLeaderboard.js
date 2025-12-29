import QuizAttempt from '../models/QuizAttemptModel.js';
import User from '../models/UserModel.js';

export const getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await QuizAttempt.aggregate([
            {
                $group: {
                    _id: "$userId",
                    totalScore: { $sum: "$score" },
                    quizzesTaken: { $sum: 1 },
                    totalCorrect: { $sum: "$correctAnswers" }
                }
            },
            {
                $sort: { totalScore: -1 }
            },
            {
                $limit: 20
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $unwind: "$userDetails"
            },
            {
                $project: {
                    _id: 1,
                    totalScore: 1,
                    quizzesTaken: 1,
                    totalCorrect: 1,
                    username: "$userDetails.username"
                }
            }
        ]);

        res.status(200).json(leaderboard);
    } catch (error) {
        console.error("Leaderboard error:", error);
        res.status(500).json({ message: "Failed to fetch leaderboard", error: error.message });
    }
};
