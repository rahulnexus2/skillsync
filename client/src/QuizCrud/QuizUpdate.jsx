import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';

const QuizUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        reset,
        setError,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: '',
            description: '',
            questions: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "questions"
    });

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const res = await axios.get(
                    `http://localhost:8000/api/v1/admin/viewquiz/${id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                // Populate form with fetched data
                reset({
                    title: res.data.quiz.title,
                    description: res.data.quiz.description,
                    questions: res.data.quiz.questions
                });
            } catch (err) {
                console.error("Failed to fetch quiz", err);
                alert("Failed to load quiz details");
                navigate('/admin/quizes');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchQuiz();
    }, [id, reset, navigate]);

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            const token = localStorage.getItem('adminToken');

            const res = await axios.put(
                `http://localhost:8000/api/v1/admin/updatequiz/${id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert(res.data.message);
            navigate('/admin/quizes');

        } catch (err) {
            const backendErrors = err.response?.data?.errors;
            const globalErrors = err.response?.data?.message;
            if (backendErrors) {
                Object.keys(backendErrors).forEach((field) => {
                    setError(field, { type: "server", message: backendErrors[field] });
                });
            } else if (globalErrors) {
                setError("root", { type: "server", message: globalErrors });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const addQuestion = () => {
        append({
            questionText: '',
            options: ['', '', '', ''],
            correctAnswer: ''
        });
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-800">✏️ Edit Quiz</h2>
                <button
                    type="button"
                    onClick={() => navigate('/admin/quizes')}
                    className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
                >
                    <ArrowLeft className="w-5 h-5" /> Cancel
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Quiz Title */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Quiz Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter quiz title"
                        {...register("title", {
                            required: { value: true, message: "Quiz title is required" },
                            maxLength: { value: 100, message: "Title cannot exceed 100 characters" }
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                    {errors.title && (
                        <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                    )}
                </div>

                {/* Quiz Description */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description
                    </label>
                    <textarea
                        placeholder="Enter quiz description (optional)"
                        {...register("description")}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                </div>

                {/* Questions */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-800">Questions</h3>
                        <button
                            type="button"
                            onClick={addQuestion}
                            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Question</span>
                        </button>
                    </div>

                    {fields.map((field, questionIndex) => (
                        <div key={field.id} className="p-6 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                            <div className="flex justify-between items-start">
                                <h4 className="text-lg font-semibold text-gray-700">
                                    Question {questionIndex + 1}
                                </h4>
                                {fields.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => remove(questionIndex)}
                                        className="text-red-500 hover:text-red-700 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                )}
                            </div>

                            {/* Question Text */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Question Text <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter question"
                                    {...register(`questions.${questionIndex}.questionText`, {
                                        required: { value: true, message: "Question text is required" }
                                    })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                                {errors.questions?.[questionIndex]?.questionText && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.questions[questionIndex].questionText.message}
                                    </p>
                                )}
                            </div>

                            {/* Options */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Options <span className="text-red-500">*</span>
                                </label>
                                {[0, 1, 2, 3].map((optionIndex) => (
                                    <div key={optionIndex} className="flex items-center space-x-2">
                                        <span className="text-sm font-medium text-gray-600 w-8">
                                            {String.fromCharCode(65 + optionIndex)}.
                                        </span>
                                        <input
                                            type="text"
                                            placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                                            {...register(`questions.${questionIndex}.options.${optionIndex}`, {
                                                required: { value: true, message: "Option is required" }
                                            })}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>
                                ))}
                                <p className="text-xs text-gray-500 mt-1">
                                    Select one of the options above as the correct answer
                                </p>
                            </div>

                            {/* Correct Answer */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Correct Answer <span className="text-red-500">*</span>
                                </label>
                                <select
                                    {...register(`questions.${questionIndex}.correctAnswer`, {
                                        required: { value: true, message: "Correct answer is required" }
                                    })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="">Select correct answer</option>
                                    {[0, 1, 2, 3].map((optIdx) => {
                                        const optionValue = watch(`questions.${questionIndex}.options.${optIdx}`);
                                        return (
                                            <option key={optIdx} value={optionValue}>
                                                {optionValue || `Option ${String.fromCharCode(65 + optIdx)}`}
                                            </option>
                                        );
                                    })}
                                </select>
                                {errors.questions?.[questionIndex]?.correctAnswer && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.questions[questionIndex].correctAnswer.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Error Message */}
                {errors.root && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600">{errors.root.message}</p>
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save className="w-5 h-5" />
                        <span>{isSubmitting ? 'Updating...' : 'Update Quiz'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default QuizUpdate;
