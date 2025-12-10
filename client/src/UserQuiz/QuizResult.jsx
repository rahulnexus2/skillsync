import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, RotateCcw, History, Home } from 'lucide-react';

const QuizResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const results = location.state?.results;

    if (!results) {
        return (
            <div className="max-w-2xl mx-auto text-center py-12">
                <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
                    <p className="text-yellow-700 font-semibold">No results found</p>
                    <p className="text-yellow-600 text-sm mt-2">Please take a quiz first</p>
                </div>
                <Link
                    to="/user/quizes"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Home className="w-5 h-5" />
                    <span>Go to Quizzes</span>
                </Link>
            </div>
        );
    }

    const { score, totalQuestions, percentage, detailedResults } = results;
    const passed = percentage >= 60;

    return (
        <div className="max-w-4xl mx-auto">
            {/* Score Card */}
            <div className={`rounded-2xl p-8 mb-8 text-center ${passed
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200'
                    : 'bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200'
                }`}>
                <div className="mb-4">
                    {passed ? (
                        <CheckCircle className="w-20 h-20 text-green-600 mx-auto" />
                    ) : (
                        <XCircle className="w-20 h-20 text-red-600 mx-auto" />
                    )}
                </div>

                <h1 className={`text-4xl font-bold mb-2 ${passed ? 'text-green-800' : 'text-red-800'}`}>
                    {passed ? '🎉 Congratulations!' : '📚 Keep Learning!'}
                </h1>
                <p className={`text-lg mb-6 ${passed ? 'text-green-700' : 'text-red-700'}`}>
                    {passed ? 'You passed the quiz!' : 'You can do better next time!'}
                </p>

                <div className="flex justify-center items-center space-x-8 mb-6">
                    <div>
                        <div className={`text-6xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
                            {percentage}%
                        </div>
                        <div className="text-gray-600 font-medium">Score</div>
                    </div>

                    <div className="h-20 w-px bg-gray-300"></div>

                    <div>
                        <div className={`text-6xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
                            {score}/{totalQuestions}
                        </div>
                        <div className="text-gray-600 font-medium">Correct</div>
                    </div>
                </div>

                <div className="flex justify-center space-x-4">
                    <button
                        onClick={() => navigate(-2)}
                        className="flex items-center space-x-2 px-6 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-semibold"
                    >
                        <RotateCcw className="w-5 h-5" />
                        <span>Retake Quiz</span>
                    </button>

                    <Link
                        to="/user/quizes/history"
                        className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                    >
                        <History className="w-5 h-5" />
                        <span>View History</span>
                    </Link>
                </div>
            </div>

            {/* Detailed Results */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Detailed Results</h2>

                <div className="space-y-4">
                    {detailedResults.map((result, index) => (
                        <div
                            key={result.questionId}
                            className={`border-2 rounded-xl p-6 ${result.isCorrect
                                    ? 'bg-green-50 border-green-200'
                                    : 'bg-red-50 border-red-200'
                                }`}
                        >
                            <div className="flex items-start space-x-3">
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${result.isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                                    }`}>
                                    {index + 1}
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                        {result.questionText}
                                    </h3>

                                    <div className="space-y-2">
                                        <div className="flex items-start space-x-2">
                                            <span className="font-semibold text-gray-700 min-w-[120px]">Your Answer:</span>
                                            <span className={`font-medium ${result.isCorrect ? 'text-green-700' : 'text-red-700'
                                                }`}>
                                                {result.userAnswer}
                                                {result.isCorrect && <CheckCircle className="inline w-5 h-5 ml-2" />}
                                                {!result.isCorrect && <XCircle className="inline w-5 h-5 ml-2" />}
                                            </span>
                                        </div>

                                        {!result.isCorrect && (
                                            <div className="flex items-start space-x-2">
                                                <span className="font-semibold text-gray-700 min-w-[120px]">Correct Answer:</span>
                                                <span className="text-green-700 font-medium">
                                                    {result.correctAnswer}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 text-center">
                <Link
                    to="/user/quizes"
                    className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium"
                >
                    <Home className="w-5 h-5" />
                    <span>Back to All Quizzes</span>
                </Link>
            </div>
        </div>
    );
};

export default QuizResult;
