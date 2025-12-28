import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Trophy, Medal, User } from 'lucide-react';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchLevel = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get("http://localhost:8000/api/v1/users/leaderboard", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setLeaderboard(res.data);

                // Decode token to get current user ID for highlighting (optional)
                // For now, we'll just display the list
            } catch (err) {
                console.error("Failed to fetch leaderboard", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLevel();
    }, []);

    if (loading) return <div className="p-10 text-center">Loading Rankings...</div>;

    const getRankIcon = (index) => {
        switch (index) {
            case 0: return <Trophy className="w-6 h-6 text-yellow-500" />;
            case 1: return <Medal className="w-6 h-6 text-gray-400" />;
            case 2: return <Medal className="w-6 h-6 text-orange-400" />;
            default: return <span className="font-bold text-gray-500">#{index + 1}</span>;
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                    <Trophy className="w-8 h-8 text-indigo-600" />
                    <h2 className="text-3xl font-bold text-gray-800">Global Leaderboard</h2>
                </div>
                <Link to="/user/quizes" className="text-indigo-600 hover:underline"> // Add explicit Link import if needed, assuming it's there or user has it? Wait, Leaderboard.jsx didn't have Link imported!
                    &larr; Back to Quizzes
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-600">Rank</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">User</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Quizzes Taken</th>
                            <th className="px-6 py-4 font-semibold text-gray-600 text-right">Total Score</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {leaderboard.length > 0 ? (
                            leaderboard.map((user, index) => (
                                <tr key={user._id} className="hover:bg-indigo-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            {getRankIcon(index)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                        {user.username}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {user.quizzesTaken}
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-indigo-600">
                                        {user.totalScore}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                    No rankings available yet. Be the first to take a quiz!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Leaderboard;
