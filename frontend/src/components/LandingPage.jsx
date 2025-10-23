import { useState } from 'react';

function LandingPage({ onGetStarted }) {
    const [showLogin, setShowLogin] = useState(true);

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <div className="shrink-0">
                                <h1 className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    ExpenseFlow
                                </h1>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center space-x-4">
                            <a href="#features" className="text-gray-700 hover:text-indigo-600 transition">
                                Features
                            </a>
                            <a href="#how-it-works" className="text-gray-700 hover:text-indigo-600 transition">
                                How It Works
                            </a>
                            <a href="#pricing" className="text-gray-700 hover:text-indigo-600 transition">
                                Pricing
                            </a>
                            <button
                                onClick={() => onGetStarted(true)}
                                className="text-indigo-600 hover:text-indigo-700 font-medium transition"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => onGetStarted(false)}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
                            >
                                Get Started
                            </button>
                        </div>
                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => onGetStarted(false)}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm"
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-12 pb-16 md:pt-20 md:pb-24 bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Left Column - Text Content */}
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                                Take Control of Your
                                <span className="block bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Financial Future
                                </span>
                            </h1>
                            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                                Track expenses, manage budgets, and gain insights into your spending habits with our powerful yet simple expense tracker.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <button
                                    onClick={() => onGetStarted(false)}
                                    className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transform hover:scale-105 transition duration-200 shadow-lg"
                                >
                                    Start Free Today
                                </button>
                                <button
                                    onClick={() => onGetStarted(true)}
                                    className="bg-white text-indigo-600 border-2 border-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-50 transition duration-200"
                                >
                                    Sign In
                                </button>
                            </div>
                            <p className="mt-6 text-sm text-gray-500">
                                ✨ No credit card required • Free forever
                            </p>
                        </div>

                        {/* Right Column - Hero Image/Illustration */}
                        <div className="hidden md:block">
                            <div className="bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition duration-300">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                                        <span className="text-gray-700 font-medium">Income</span>
                                        <span className="text-2xl font-bold text-green-600">$5,420</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                                        <span className="text-gray-700 font-medium">Expenses</span>
                                        <span className="text-2xl font-bold text-red-600">$3,280</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg">
                                        <span className="text-gray-700 font-medium">Balance</span>
                                        <span className="text-2xl font-bold text-indigo-600">$2,140</span>
                                    </div>
                                    <div className="pt-4">
                                        <div className="h-32 bg-linear-to-r from-indigo-500 to-purple-500 rounded-lg opacity-20"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Ad Space 1 - Between Hero and Features */}
            <div className="bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <p className="text-gray-400 text-sm">Advertisement Space (728x90)</p>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <section id="features" className="py-16 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Everything You Need to Manage Your Money
                        </h2>
                        <p className="text-xl text-gray-600">
                            Powerful features to help you stay on top of your finances
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-8 hover:shadow-xl transition duration-300">
                            <div className="bg-indigo-600 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Visual Analytics</h3>
                            <p className="text-gray-600">
                                Beautiful charts and graphs to visualize your spending patterns and financial trends.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-xl p-8 hover:shadow-xl transition duration-300">
                            <div className="bg-purple-600 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Categories</h3>
                            <p className="text-gray-600">
                                Organize expenses with customizable categories and automatic transaction sorting.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-8 hover:shadow-xl transition duration-300">
                            <div className="bg-green-600 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Budget Goals</h3>
                            <p className="text-gray-600">
                                Set monthly budgets and receive alerts when you're approaching your limits.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-16 md:py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-gray-600">
                            Get started in three simple steps
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                        <div className="text-center">
                            <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                                1
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Create Account</h3>
                            <p className="text-gray-600">
                                Sign up for free in seconds. No credit card required.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                                2
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Track Expenses</h3>
                            <p className="text-gray-600">
                                Add your income and expenses quickly and easily.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-pink-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                                3
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Get Insights</h3>
                            <p className="text-gray-600">
                                Analyze your spending and make smarter financial decisions.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Ad Space 2 - Between sections */}
            <div className="bg-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <p className="text-gray-400 text-sm">Advertisement Space (728x90)</p>
                    </div>
                </div>
            </div>

            {/* Pricing/CTA Section */}
            <section id="pricing" className="py-16 md:py-24 bg-linear-to-br from-indigo-600 to-purple-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Ready to Take Control of Your Finances?
                    </h2>
                    <p className="text-xl text-indigo-100 mb-8">
                        Join thousands of users who are already managing their money smarter
                    </p>
                    <button
                        onClick={() => onGetStarted(false)}
                        className="bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition duration-200 shadow-xl"
                    >
                        Start Free Today
                    </button>
                    <p className="mt-6 text-indigo-100">
                        No credit card required • Cancel anytime • Free forever
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4 bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                ExpenseFlow
                            </h3>
                            <p className="text-gray-400">
                                Your smart financial companion
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                                <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
                                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition">About</a></li>
                                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                        <p>&copy; 2025 ExpenseFlow. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;