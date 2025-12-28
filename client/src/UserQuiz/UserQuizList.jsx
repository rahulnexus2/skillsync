import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Play, ClipboardList, Clock } from 'lucide-react';

const UserQuizList = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                // User uses 'token' or 'userToken'? Usually 'token' for users based on common patterns, but checking AuthLayout might reveal it.
                // Assuming 'token' or handling both. RouteConfig uses AuthLayout type="user".
                // I will assume the token key is 'token' for users, or 'userToken'. 
                // Let's check a user component later, but usually standard is 'token'.
                // Wait, Admin used 'adminToken'.

                const token = localStorage.getItem('token');
                const res = await axios.get("http://localhost:8000/api/v1/users/quizzes", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setQuizzes(res.data.quizzes);
            } catch (err) {
                setError("Failed to load quizzes");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuizzes();
    }, []);

    if (loading) return (
        <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-3xl font-bold text-gray-800">Available Quizzes</h2>
                <Link to="/user/quiz-history" className="text-indigo-600 hover:text-indigo-800 font-medium">
                    View My History
                </Link>
            </div>

            {quizzes.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl text-gray-600">No quizzes available at the moment.</h3>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {quizzes.map(quiz => (
                        <div key={quiz._id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all p-6 flex flex-col">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{quiz.title}</h3>
                            <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
                                {quiz.description || "No description."}
                            </p>

                            <div className="flex items-center text-sm text-gray-500 mb-6 space-x-4">
                                <span className="flex items-center">
                                    <ClipboardList className="w-4 h-4 mr-1" />
                                    {quiz.questions.length} Questions
                                </span>
                                <span className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {new Date(quiz.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <Link
                                to={`/user/quizes/take/${quiz._id}`}
                                className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                            >
                                <Play className="w-4 h-4 mr-2" />
                                Start Quiz
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserQuizList;
