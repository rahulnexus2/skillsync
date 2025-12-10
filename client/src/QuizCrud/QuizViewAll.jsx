import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Eye, Edit, Trash2, BookOpen } from 'lucide-react';

const QuizViewAll = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');

            const res = await axios.get(
                "http://localhost:8000/api/v1/admin/viewquiz",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setQuizzes(res.data.quizzes);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch quizzes");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (quizId, quizTitle) => {
        if (!window.confirm(`Are you sure you want to delete "${quizTitle}"?`)) {
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');

            await axios.delete(
                `http://localhost:8000/api/v1/admin/deletequiz/${quizId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Quiz deleted successfully");
            fetchQuizzes(); // Refresh the list
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete quiz");
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
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Quizzes Yet</h3>
                <p className="text-gray-500 mb-6">Create your first quiz to get started!</p>
                <Link
                    to="/admin/quizes/create"
                    className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Create Quiz
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    All Quizzes ({quizzes.length})
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map((quiz) => (
                    <div
                        key={quiz._id}
                        className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                    >
                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                                {quiz.title}
                            </h3>
                            <p className="text-gray-600 text-sm line-clamp-3">
                                {quiz.description || "No description provided"}
                            </p>
                        </div>

                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                            <div className="text-sm text-gray-500">
                                <span className="font-semibold text-indigo-600">
                                    {quiz.questions.length}
                                </span>{' '}
                                {quiz.questions.length === 1 ? 'Question' : 'Questions'}
                            </div>
                            <div className="text-xs text-gray-400">
                                By {quiz.createdBy?.username || 'Admin'}
                            </div>
                        </div>

                        <div className="flex space-x-2">
                            <Link
                                to={`/admin/quizes/view/${quiz._id}`}
                                className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                                <Eye className="w-4 h-4" />
                                <span className="text-sm font-medium">View</span>
                            </Link>

                            <Link
                                to={`/admin/quizes/update/${quiz._id}`}
                                className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                            >
                                <Edit className="w-4 h-4" />
                                <span className="text-sm font-medium">Edit</span>
                            </Link>

                            <button
                                onClick={() => handleDelete(quiz._id, quiz.title)}
                                className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span className="text-sm font-medium">Delete</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuizViewAll;
