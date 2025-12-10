import Mongoose from 'mongoose';

const questionSchema = new Mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true }
});

const quizSchema = new Mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  questions: [questionSchema],
  createdBy: {
    id: { type: Mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
    username: { type: String, required: true }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Quiz = Mongoose.model("Quiz", quizSchema);

export default Quiz;
