import QuizAttempt from '../models/QuizAttemptModel.js';

export const getQuizAttempts = async (req, res) => {
    try {
        const { _id: userId } = req.user;

        // Fetch all quiz attempts for the user, populate quiz details
        const attempts = await QuizAttempt.find({ userId })
            .populate('quizId', 'title description')
            .sort({ attemptedAt: -1 }); // Most recent first

        res.status(200).json({
            message: "Quiz attempts fetched successfully",
            attempts
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Cannot fetch quiz attempts",
            error: error.message
        });
    }
};
