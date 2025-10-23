import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import Categories from "../pages/Categories";

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('home');

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                ExpenseFlow
                            </h1>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <span className="text-gray-700 text-sm sm:text-base hidden sm:inline">
                                Hello, {user?.firstName || user?.email}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-3 py-2 sm:px-4 rounded-lg hover:bg-red-600 transition duration-200 text-sm sm:text-base"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Layout */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-xl shadow-md p-4 sticky top-24">
                            <nav className="space-y-2">
                                <button
                                    onClick={() => setActiveTab('home')}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === 'home'
                                            ? 'bg-indigo-50 text-indigo-600'
                                            : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    <span className="font-medium">Dashboard</span>
                                </button>

                                <button
                                    onClick={() => setActiveTab('categories')}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === 'categories'
                                            ? 'bg-indigo-50 text-indigo-600'
                                            : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    <span className="font-medium">Categories</span>
                                </button>

                                <button
                                    disabled
                                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 cursor-not-allowed"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <span className="font-medium">Transactions</span>
                                    <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">Soon</span>
                                </button>

                                <button
                                    disabled
                                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 cursor-not-allowed"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <span className="font-medium">Reports</span>
                                    <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">Soon</span>
                                </button>
                            </nav>

                            {/* Ad Space - Sidebar */}
                            <div className="mt-6 hidden lg:block">
                                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                    <p className="text-gray-400 text-xs mb-2">Advertisement</p>
                                    <div className="h-48 bg-white rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-9">
                        {/* Ad Space - Top of content */}
                        <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mb-6">
                            <p className="text-gray-400 text-sm">Advertisement Space (728x90)</p>
                        </div>

                        {/* Content Area */}
                        {activeTab === 'home' && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                                        Welcome to Your Dashboard! 🎉
                                    </h2>

                                    <div className="bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 sm:p-6 mb-6">
                                        <h3 className="text-lg sm:text-xl font-semibold text-green-800 mb-2">
                                            ✅ Phase 5 Complete!
                                        </h3>
                                        <p className="text-green-700 text-sm sm:text-base">
                                            Categories management is now available. Click "Categories" in the sidebar to get started!
                                        </p>
                                    </div>

                                    <div className="bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 sm:p-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                            Your Account Information
                                        </h3>
                                        <div className="space-y-2">
                                            <p className="text-gray-700 text-sm sm:text-base">
                                                <span className="font-semibold">Email:</span> {user?.email}
                                            </p>
                                            {user?.firstName && (
                                                <p className="text-gray-700 text-sm sm:text-base">
                                                    <span className="font-semibold">First Name:</span> {user.firstName}
                                                </p>
                                            )}
                                            {user?.lastName && (
                                                <p className="text-gray-700 text-sm sm:text-base">
                                                    <span className="font-semibold">Last Name:</span> {user.lastName}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Next Steps */}
                                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                                    <div className="bg-linear-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 sm:p-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                            🚀 Next Steps
                                        </h3>
                                        <p className="text-gray-700 text-sm sm:text-base">
                                            Ready to move to <strong>Phase 6: Transactions Backend</strong>?
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'categories' && <Categories />}
                    </div>
                </div>
            </div>
        </div>
    );
}