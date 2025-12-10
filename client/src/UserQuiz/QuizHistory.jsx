import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, TrendingUp, Award, Eye } from 'lucide-react';

const QuizHistory = () => {
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('userToken');

            const res = await axios.get(
                "http://localhost:8000/api/v1/users/quizattempts",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setAttempts(res.data.attempts);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch quiz history");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading history...</p>
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

    if (attempts.length === 0) {
        return (
            <div className="text-center py-12">
                <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Quiz History</h3>
                <p className="text-gray-500 mb-6">You haven't taken any quizzes yet</p>
                <Link
                    to="/user/quizes"
                    className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Browse Quizzes
                </Link>
            </div>
        );
    }

    // Calculate statistics
    const totalAttempts = attempts.length;
    const averageScore = Math.round(
        attempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / totalAttempts
    );
    const bestScore = Math.max(...attempts.map(a => a.percentage));

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">📈 Quiz History</h1>
                <p className="text-gray-600">Track your progress and performance</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-700 font-semibold">Total Attempts</span>
                        <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-blue-900">{totalAttempts}</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-green-700 font-semibold">Average Score</span>
                        <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-3xl font-bold text-green-900">{averageScore}%</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-purple-700 font-semibold">Best Score</span>
                        <Award className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="text-3xl font-bold text-purple-900">{bestScore}%</div>
                </div>
            </div>

            {/* Attempts Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Quiz Title</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Score</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Percentage</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {attempts.map((attempt) => (
                                <tr key={attempt._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">
                                            {attempt.quizId?.title || 'Unknown Quiz'}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {attempt.quizId?.description?.substring(0, 50)}
                                            {attempt.quizId?.description?.length > 50 && '...'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {new Date(attempt.attemptedAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="font-semibold text-gray-900">
                                            {attempt.score}/{attempt.totalQuestions}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${attempt.percentage >= 80
                                                ? 'bg-green-100 text-green-800'
                                                : attempt.percentage >= 60
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                            {attempt.percentage}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${attempt.percentage >= 60
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                            {attempt.percentage >= 60 ? '✓ Passed' : '✗ Failed'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-8 text-center">
                <Link
                    to="/user/quizes"
                    className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium"
                >
                    <span>Take Another Quiz</span>
                    <span>→</span>
                </Link>
            </div>
        </div>
    );
};

export default QuizHistory;
