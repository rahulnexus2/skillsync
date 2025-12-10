import Quiz from '../models/QuizModel.js';

export const updateQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, questions } = req.body;

        const quiz = await Quiz.findById(id);

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        // Validate questions if provided
        if (questions) {
            if (questions.length === 0) {
                return res.status(400).json({
                    message: "Quiz must have at least one question"
                });
            }

            for (const question of questions) {
                if (!question.options || question.options.length < 2) {
                    return res.status(400).json({
                        message: "Each question must have at least 2 options"
                    });
                }
                if (!question.correctAnswer) {
                    return res.status(400).json({
                        message: "Each question must have a correct answer"
                    });
                }
            }
        }

        // Update fields
        if (title) quiz.title = title;
        if (description !== undefined) quiz.description = description;
        if (questions) quiz.questions = questions;

        await quiz.save();

        res.status(200).json({
            message: "Quiz updated successfully",
            quiz: quiz
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Cannot update quiz",
            error: error.message
        });
    }
};
