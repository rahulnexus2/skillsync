import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, CheckCircle, Send } from 'lucide-react';

const QuizTake = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [answers, setAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);

    useEffect(() => {
        fetchQuiz();
    }, [quizId]);

    const fetchQuiz = async () => {
        try {
            setLoading(true);

            const res = await axios.get(`http://localhost:8000/api/v1/users/quizzes/${quizId}`);

            setQuiz(res.data.quiz);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch quiz");
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (questionId, selectedAnswer) => {
        setAnswers({
            ...answers,
            [questionId]: selectedAnswer
        });
    };

    const handleSubmit = async () => {
        // Check if all questions are answered
        const unansweredCount = quiz.questions.length - Object.keys(answers).length;
        if (unansweredCount > 0) {
            if (!window.confirm(`You have ${unansweredCount} unanswered question(s). Submit anyway?`)) {
                return;
            }
        }

        try {
            setIsSubmitting(true);
            const token = localStorage.getItem('userToken');

            // Format answers for API
            const formattedAnswers = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
                questionId,
                selectedAnswer
            }));

            const res = await axios.post(
                "http://localhost:8000/api/v1/users/submitquiz",
                {
                    quizId,
                    answers: formattedAnswers
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Navigate to results page
            navigate(`/user/quizes/result/${res.data.attemptId}`, {
                state: { results: res.data }
            });

        } catch (err) {
            alert(err.response?.data?.message || "Failed to submit quiz");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading quiz...</p>
                </div>
            </div>
        );
    }

    if (error || !quiz) {
        return (
            <div>
                <div className="p-6 bg-red-50 border border-red-200 rounded-lg mb-4">
                    <p className="text-red-600 font-semibold">{error || "Quiz not found"}</p>
                </div>
                <Link
                    to="/user/quizes"
                    className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Quizzes</span>
                </Link>
            </div>
        );
    }

    const progress = (Object.keys(answers).length / quiz.questions.length) * 100;

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <Link
                    to="/user/quizes"
                    className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Quizzes</span>
                </Link>

                <h1 className="text-3xl font-bold text-gray-800 mb-2">{quiz.title}</h1>
                <p className="text-gray-600">{quiz.description}</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{Object.keys(answers).length} / {quiz.questions.length} answered</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            {/* Questions */}
            <div className="space-y-6">
                {quiz.questions.map((question, index) => (
                    <div
                        key={question._id}
                        className="bg-white border border-gray-200 rounded-xl p-6"
                    >
                        <div className="flex items-start space-x-3 mb-4">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold ${answers[question._id] ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                }`}>
                                {answers[question._id] ? <CheckCircle className="w-5 h-5" /> : index + 1}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    {question.questionText}
                                </h3>

                                <div className="space-y-3">
                                    {question.options.map((option, optionIndex) => (
                                        <label
                                            key={optionIndex}
                                            className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${answers[question._id] === option
                                                    ? 'border-indigo-600 bg-indigo-50'
                                                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name={`question-${question._id}`}
                                                value={option}
                                                checked={answers[question._id] === option}
                                                onChange={() => handleAnswerSelect(question._id, option)}
                                                className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className={`flex-1 ${answers[question._id] === option ? 'font-medium text-indigo-900' : 'text-gray-700'
                                                }`}>
                                                {String.fromCharCode(65 + optionIndex)}. {option}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Submit Button */}
            <div className="mt-8 sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-4">
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || Object.keys(answers).length === 0}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                >
                    <Send className="w-5 h-5" />
                    <span>{isSubmitting ? 'Submitting...' : 'Submit Quiz'}</span>
                </button>
                {Object.keys(answers).length === 0 && (
                    <p className="text-center text-sm text-gray-500 mt-2">
                        Please answer at least one question to submit
                    </p>
                )}
            </div>
        </div>
    );
};

export default QuizTake;
