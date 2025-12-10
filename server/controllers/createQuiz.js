import Quiz from '../models/QuizModel.js';

export const createQuiz = async (req, res) => {
    try {
        const { title, description, questions } = req.body;
        const { _id, username } = req.admin;

        // Validate questions
        if (!questions || questions.length === 0) {
            return res.status(400).json({
                message: "Quiz must have at least one question"
            });
        }

        // Validate each question has 4 options
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

        const newQuiz = new Quiz({
            title,
            description,
            questions,
            createdBy: {
                id: _id,
                username: username
            }
        });

        await newQuiz.save();

        res.status(201).json({
            message: "Quiz created successfully",
            quiz: newQuiz
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Cannot create quiz",
            error: error.message
        });
    }
};
