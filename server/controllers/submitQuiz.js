import Quiz from '../models/QuizModel.js';
import QuizAttempt from '../models/QuizAttemptModel.js';

export const submitQuiz = async (req, res) => {
    try {
        const { quizId, answers } = req.body;
        const { _id: userId } = req.user;

        // Fetch the quiz
        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        if (!quiz.isActive) {
            return res.status(400).json({
                message: "Quiz is no longer available"
            });
        }

        // Validate answers format
        if (!answers || !Array.isArray(answers)) {
            return res.status(400).json({
                message: "Invalid answers format"
            });
        }

        // Calculate score
        let correctAnswers = 0;
        const totalQuestions = quiz.questions.length;
        const detailedResults = [];

        quiz.questions.forEach((question) => {
            const userAnswer = answers.find(
                a => a.questionId.toString() === question._id.toString()
            );

            const isCorrect = userAnswer && userAnswer.selectedAnswer === question.correctAnswer;

            if (isCorrect) {
                correctAnswers++;
            }

            detailedResults.push({
                questionId: question._id,
                questionText: question.questionText,
                userAnswer: userAnswer?.selectedAnswer || "Not answered",
                correctAnswer: question.correctAnswer,
                isCorrect: isCorrect
            });
        });

        const percentage = Math.round((correctAnswers / totalQuestions) * 100);

        // Save quiz attempt
        const quizAttempt = new QuizAttempt({
            userId,
            quizId,
            answers,
            score: correctAnswers,
            totalQuestions,
            correctAnswers,
            percentage
        });

        await quizAttempt.save();

        res.status(200).json({
            message: "Quiz submitted successfully",
            attemptId: quizAttempt._id,
            score: correctAnswers,
            totalQuestions,
            percentage,
            detailedResults
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Cannot submit quiz",
            error: error.message
        });
    }
};
