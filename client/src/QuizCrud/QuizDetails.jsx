import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Edit, Trash2, CheckCircle } from 'lucide-react';

const QuizDetails = () => {
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchQuizDetails();
    }, [quizId]);

    const fetchQuizDetails = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');

            const res = await axios.get(
                `http://localhost:8000/api/v1/admin/viewquiz/${quizId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setQuiz(res.data.quiz);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch quiz details");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading quiz details...</p>
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
                    to="/admin/quizes"
                    className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Quizzes</span>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <Link
                    to="/admin/quizes"
                    className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Quizzes</span>
                </Link>

                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{quiz.title}</h1>
                        <p className="text-gray-600">{quiz.description || "No description provided"}</p>
                        <p className="text-sm text-gray-500 mt-2">
                            Created by {quiz.createdBy?.username} • {quiz.questions.length} questions
                        </p>
                    </div>

                    <div className="flex space-x-2">
                        <Link
                            to={`/admin/quizes/update/${quiz._id}`}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Questions */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Questions</h2>

                {quiz.questions.map((question, index) => (
                    <div
                        key={question._id}
                        className="bg-white border border-gray-200 rounded-xl p-6"
                    >
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Question {index + 1}
                            </h3>
                            <p className="text-gray-700 mt-2">{question.questionText}</p>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-gray-600 mb-2">Options:</p>
                            {question.options.map((option, optionIndex) => (
                                <div
                                    key={optionIndex}
                                    className={`flex items-center space-x-3 p-3 rounded-lg ${option === question.correctAnswer
                                            ? 'bg-green-50 border-2 border-green-500'
                                            : 'bg-gray-50 border border-gray-200'
                                        }`}
                                >
                                    <span className="font-medium text-gray-700 w-8">
                                        {String.fromCharCode(65 + optionIndex)}.
                                    </span>
                                    <span className={option === question.correctAnswer ? 'text-green-700 font-medium' : 'text-gray-700'}>
                                        {option}
                                    </span>
                                    {option === question.correctAnswer && (
                                        <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-800">
                                <span className="font-semibold">Correct Answer:</span> {question.correctAnswer}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuizDetails;
