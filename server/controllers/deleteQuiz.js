import Quiz from '../models/QuizModel.js';

export const deleteQuiz = async (req, res) => {
    try {
        const { id } = req.params;

        const quiz = await Quiz.findById(id);

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        // Soft delete - set isActive to false
        quiz.isActive = false;
        await quiz.save();

        res.status(200).json({
            message: "Quiz deleted successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Cannot delete quiz",
            error: error.message
        });
    }
};
