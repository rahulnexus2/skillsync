import Quiz from '../models/QuizModel.js';

export const viewQuizById = async (req, res) => {
    try {
        const { id } = req.params;
        const isAdmin = req.admin ? true : false;

        const quiz = await Quiz.findById(id);

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        if (!quiz.isActive) {
            return res.status(404).json({
                message: "Quiz is no longer available"
            });
        }

        // If user is not admin, remove correct answers from response
        if (!isAdmin) {
            const quizObj = quiz.toObject();
            quizObj.questions = quizObj.questions.map(q => ({
                _id: q._id,
                questionText: q.questionText,
                options: q.options
                // correctAnswer is excluded
            }));

            return res.status(200).json({
                message: "Quiz fetched successfully",
                quiz: quizObj
            });
        }

        // Admin gets full quiz data including correct answers
        res.status(200).json({
            message: "Quiz fetched successfully",
            quiz: quiz
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Cannot fetch quiz",
            error: error.message
        });
    }
};
