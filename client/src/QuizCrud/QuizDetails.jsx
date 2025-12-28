import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Edit, Calendar, User, HelpCircle } from 'lucide-react';

const QuizDetails = () => {
    const { id } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const res = await axios.get(
                    `http://localhost:8000/api/v1/admin/viewquiz/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setQuiz(res.data.quiz);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch quiz details");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchQuiz();
    }, [id]);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (error) return (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
            Error: {error}
        </div>
    );

    if (!quiz) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Link
                    to="/admin/quizes"
                    className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Quizzes
                </Link>
                <Link
                    to={`/admin/quizes/update/${id}`}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Quiz
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-8 border-b border-gray-100">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{quiz.title}</h1>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        {quiz.description || "No description provided."}
                    </p>

                    <div className="flex items-center gap-6 mt-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>Created by {quiz.createdBy?.username || 'Admin'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Created {new Date(quiz.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <HelpCircle className="w-4 h-4" />
                            <span>{quiz.questions?.length || 0} Questions</span>
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-gray-50">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Questions Preview</h3>
                    <div className="space-y-6">
                        {quiz.questions?.map((q, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                                <div className="flex gap-4">
                                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 font-bold rounded-full">
                                        {idx + 1}
                                    </span>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-4">{q.questionText}</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {q.options.map((opt, optIdx) => (
                                                <div
                                                    key={optIdx}
                                                    className={`p-3 rounded-lg border ${opt === q.correctAnswer
                                                            ? 'bg-green-50 border-green-200 text-green-700'
                                                            : 'bg-white border-gray-200 text-gray-600'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">{String.fromCharCode(65 + optIdx)}.</span>
                                                        <span>{opt}</span>
                                                        {opt === q.correctAnswer && (
                                                            <span className="ml-auto text-xs font-bold px-2 py-1 bg-green-200 text-green-800 rounded">Correct</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizDetails;
