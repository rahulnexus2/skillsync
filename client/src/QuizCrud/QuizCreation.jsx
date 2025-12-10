import React, { useState } from 'react';
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Plus, Trash2, Save } from 'lucide-react';

const QuizCreation = () => {
    const {
        register,
        handleSubmit,
        control,
        setError,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: '',
            description: '',
            questions: [
                {
                    questionText: '',
                    options: ['', '', '', ''],
                    correctAnswer: ''
                }
            ]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "questions"
    });

    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            const token = localStorage.getItem('adminToken');

            const res = await axios.post(
                "http://localhost:8000/api/v1/admin/createquiz",
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

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">📝 Create New Quiz</h2>

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
                            </div>

                            {/* Correct Answer */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Correct Answer <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter the correct answer exactly as written in options"
                                    {...register(`questions.${questionIndex}.correctAnswer`, {
                                        required: { value: true, message: "Correct answer is required" }
                                    })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                                {errors.questions?.[questionIndex]?.correctAnswer && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.questions[questionIndex].correctAnswer.message}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    Make sure this matches one of the options above exactly
                                </p>
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
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save className="w-5 h-5" />
                    <span>{isSubmitting ? 'Creating Quiz...' : 'Create Quiz'}</span>
                </button>
            </form>
        </div>
    );
};

export default QuizCreation;
