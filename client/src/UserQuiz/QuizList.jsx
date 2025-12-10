import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Clock, PlayCircle } from 'lucide-react';

const QuizList = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            setLoading(true);

            const res = await axios.get("http://localhost:8000/api/v1/users/quizzes");

            setQuizzes(res.data.quizzes);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch quizzes");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading quizzes...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 font-semibold">{error}</p>
            </div>
        );
    }

    if (quizzes.length === 0) {
        return (
            <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Quizzes Available</h3>
                <p className="text-gray-500">Check back later for new quizzes!</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">📚 Available Quizzes</h1>
                <p className="text-gray-600">Test your knowledge and track your progress</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map((quiz) => (
                    <div
                        key={quiz._id}
                        className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                        <div className="mb-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <BookOpen className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex items-center space-x-1 text-sm text-gray-500">
                                    <Clock className="w-4 h-4" />
                                    <span>{quiz.questions.length * 2} min</span>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                                {quiz.title}
                            </h3>
                            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                {quiz.description || "Test your knowledge with this quiz"}
                            </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <div className="text-sm">
                                <span className="font-semibold text-indigo-600">
                                    {quiz.questions.length}
                                </span>{' '}
                                <span className="text-gray-500">
                                    {quiz.questions.length === 1 ? 'Question' : 'Questions'}
                                </span>
                            </div>

                            <Link
                                to={`/user/quizes/take/${quiz._id}`}
                                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105"
                            >
                                <PlayCircle className="w-4 h-4" />
                                <span className="font-medium">Start Quiz</span>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 text-center">
                <Link
                    to="/user/quizes/history"
                    className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium"
                >
                    <span>View Quiz History</span>
                    <span>→</span>
                </Link>
            </div>
        </div>
    );
};

export default QuizList;
