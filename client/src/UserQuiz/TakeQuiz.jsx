import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, AlertCircle } from 'lucide-react';

const TakeQuiz = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [token] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/v1/users/quizzes/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setQuiz(res.data.quiz);
            } catch (err) {
                setError("Failed to load quiz.");
            } finally {
                setLoading(false);
            }
        };
        if (token) fetchQuiz();
        else navigate('/user/login');
    }, [id, token, navigate]);

    const handleOptionSelect = (questionId, option) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: option
        }));
    };

    const handleSubmit = async () => {
        // Validation: Ensure all questions are answered
        const unanswered = quiz.questions.filter(q => !answers[q._id]);
        if (unanswered.length > 0) {
            alert(`Please answer all questions before submitting.`);
            return;
        }

        if (!window.confirm("Are you sure you want to submit your quiz?")) return;

        setSubmitting(true);
        try {
            // Transform answers to matches backend expectation if necessary
            const payload = {
                quizId: id,
                answers: Object.entries(answers).map(([qId, ans]) => ({
                    questionId: qId,
                    selectedAnswer: ans
                }))
            };

            const res = await axios.post("http://localhost:8000/api/v1/users/submitquiz", payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert(`Quiz Submitted! Score: ${res.data.score}/${res.data.totalQuestions}`);
            navigate('/user/quiz-history');

        } catch (err) {
            console.error(err);
            alert("Failed to submit quiz. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Quiz...</div>;
    if (error) return <div className="p-10 text-center text-red-600">{error}</div>;

    return (
        <div className="max-w-3xl mx-auto py-8">
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden mb-8">
                <div className="bg-indigo-700 px-8 py-6 text-white">
                    <h1 className="text-2xl font-bold">{quiz.title}</h1>
                    <p className="opacity-90 mt-2">{quiz.description}</p>
                </div>

                <div className="p-8 space-y-8">
                    {quiz.questions.map((q, idx) => (
                        <div key={q._id} className="border-b border-gray-100 last:border-0 pb-8 last:pb-0">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                <span className="text-indigo-600 mr-2">{idx + 1}.</span>
                                {q.questionText}
                            </h3>

                            <div className="space-y-3 pl-8">
                                {q.options.map((opt, optIdx) => (
                                    <label
                                        key={optIdx}
                                        className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${answers[q._id] === opt
                                            ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600'
                                            : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name={q._id}
                                            value={opt}
                                            checked={answers[q._id] === opt}
                                            onChange={() => handleOptionSelect(q._id, opt)}
                                            className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                        />
                                        <span className="ml-3 text-gray-700">{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center"
                    >
                        {submitting ? 'Submitting...' : 'Submit Quiz'}
                        {!submitting && <CheckCircle className="ml-2 w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TakeQuiz;
