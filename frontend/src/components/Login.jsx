import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login({ onToggle, onBack }) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setloading] = useState(false);
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setloading(true);

        const result = await login(formData);

        if (!result.success) {
            setError(result.error);
            setloading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 dark:from-gray-900 dark:via-gray-950 dark:to-black flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Ad Space - Top */}
                <div className="bg-white/20 dark:bg-black/30 backdrop-blur-sm border border-white/30 dark:border-white/10 rounded-lg p-4 mb-4 text-center">
                    <p className="text-white/70 text-xs">Advertisement (320x50)</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 border border-transparent dark:border-gray-800">
                    {/* Back Button */}
                    <button
                        onClick={onBack}
                        className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4 transition"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to home
                    </button>

                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 text-center">
                        Welcome Back
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-center mb-6 sm:mb-8">
                        Sign in to continue to ExpenseFlow
                    </p>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-base placeholder-gray-300 dark:placeholder-gray-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-base placeholder-gray-300 dark:placeholder-gray-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-3 sm:py-4 rounded-lg font-semibold text-base hover:bg-indigo-700 transition duration-200 disabled:bg-indigo-400 disabled:cursor-not-allowed shadow-lg"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                            Don't have an account?{' '}
                            <button
                                onClick={onToggle}
                                className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300"
                            >
                                Create one free
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
