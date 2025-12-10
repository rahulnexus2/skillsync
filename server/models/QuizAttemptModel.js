import Mongoose from 'mongoose';

const quizAttemptSchema = new Mongoose.Schema({
    userId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    quizId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        required: true
    },
    answers: [{
        questionId: { type: Mongoose.Schema.Types.ObjectId, required: true },
        selectedAnswer: { type: String, required: true }
    }],
    score: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    correctAnswers: {
        type: Number,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    },
    attemptedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const QuizAttempt = Mongoose.model("QuizAttempt", quizAttemptSchema);

export default QuizAttempt;
