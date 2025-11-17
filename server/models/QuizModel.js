import Mongoose from 'mongoose';

const questionSchema = new Mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true }
});

const quizSchema = new Mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  questions: [questionSchema]  
});

const Quiz= Mongoose.model("Quiz", quizSchema);

export default Quiz;
