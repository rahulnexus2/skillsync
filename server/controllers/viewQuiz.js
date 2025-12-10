import Quiz from '../models/QuizModel.js';

export const viewQuiz = async (req, res) => {
    try {
        const isAdmin = req.admin ? true : false;

        // Fetch only active quizzes
        const quizzes = await Quiz.find({ isActive: true });

        // If user is not admin, remove correct answers from response
        if (!isAdmin) {
            const sanitizedQuizzes = quizzes.map(quiz => {
                const quizObj = quiz.toObject();
                quizObj.questions = quizObj.questions.map(q => ({
                    _id: q._id,
                    questionText: q.questionText,
                    options: q.options
                    // correctAnswer is excluded
                }));
                return quizObj;
            });

            return res.status(200).json({
                message: "Quizzes fetched successfully",
                quizzes: sanitizedQuizzes
            });
        }

        // Admin gets full quiz data including correct answers
        res.status(200).json({
            message: "Quizzes fetched successfully",
            quizzes: quizzes
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Cannot fetch quizzes",
            error: error.message
        });
    }
};
