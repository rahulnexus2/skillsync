import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Award, Calendar, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuizHistory = () => {
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get("http://localhost:8000/api/v1/users/quizattempts", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAttempts(res.data.attempts || []);
            } catch (err) {
                console.error("Failed to load history", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) return <div className="p-10 text-center">Loading History...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-800">My Quiz Attempts</h2>
                <Link to="/user/quizes" className="text-indigo-600 hover:underline">
                    &larr; Back to Quizzes
                </Link>
            </div>

            {attempts.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">You haven't taken any quizzes yet.</p>
                    <Link to="/user/quizes" className="text-indigo-600 hover:underline mt-2 inline-block">Browse Quizzes</Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    {attempts.map(attempt => {
                        const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);
                        let gradeColor = 'text-red-500';
                        if (percentage >= 80) gradeColor = 'text-green-600';
                        else if (percentage >= 60) gradeColor = 'text-yellow-600';

                        return (
                            <div key={attempt._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{attempt.quizId?.title || "Deleted Quiz"}</h3>
                                    <div className="flex items-center text-sm text-gray-500 mt-2 gap-4">
                                        <span className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            {new Date(attempt.createdAt).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center">
                                            <Award className="w-4 h-4 mr-1" />
                                            Score: {attempt.score}/{attempt.totalQuestions}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className={`text-3xl font-bold ${gradeColor}`}>
                                        {percentage}%
                                    </div>
                                    <div className="text-right text-xs text-gray-400">
                                        {percentage >= 60 ? 'PASSED' : 'FAILED'}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default QuizHistory;
