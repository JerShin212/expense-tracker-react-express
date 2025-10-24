import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Categories from '../pages/Categories';
import Transactions from '../pages/Transactions';
import Settings from '../pages/Settings';
import DashboardHome from '../pages/DashboardHome';

function Dashboard() {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('home');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setIsMobileMenuOpen(false); // Close drawer when tab is selected
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden mr-3 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    {isMobileMenuOpen ? (
                                        <path d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>

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

            {/* Mobile Drawer Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={closeMobileMenu}
                />
            )}

            {/* Main Layout */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Sidebar Navigation - Desktop */}
                    <div className="hidden lg:block lg:col-span-3">
                        <div className="bg-white rounded-xl shadow-md p-4 sticky top-24">
                            <nav className="space-y-2">
                                <button
                                    onClick={() => handleTabChange('home')}
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
                                    onClick={() => handleTabChange('transactions')}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === 'transactions'
                                            ? 'bg-indigo-50 text-indigo-600'
                                            : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <span className="font-medium">Transactions</span>
                                </button>

                                <button
                                    onClick={() => handleTabChange('categories')}
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
                                    onClick={() => handleTabChange('settings')}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === 'settings'
                                            ? 'bg-indigo-50 text-indigo-600'
                                            : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="font-medium">Settings</span>
                                </button>
                            </nav>

                            {/* Ad Space - Sidebar */}
                            <div className="mt-6">
                                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                    <p className="text-gray-400 text-xs mb-2">Advertisement</p>
                                    <div className="h-48 bg-white rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Drawer Navigation */}
                    <div
                        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                            }`}
                    >
                        <div className="p-6">
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Menu
                                </h2>
                                <button
                                    onClick={closeMobileMenu}
                                    className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Navigation Links */}
                            <nav className="space-y-2">
                                <button
                                    onClick={() => handleTabChange('home')}
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
                                    onClick={() => handleTabChange('transactions')}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === 'transactions'
                                            ? 'bg-indigo-50 text-indigo-600'
                                            : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <span className="font-medium">Transactions</span>
                                </button>

                                <button
                                    onClick={() => handleTabChange('categories')}
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
                                    onClick={() => handleTabChange('settings')}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === 'settings'
                                            ? 'bg-indigo-50 text-indigo-600'
                                            : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="font-medium">Settings</span>
                                </button>
                            </nav>

                            {/* User Info in Drawer */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="flex items-center space-x-3 px-4 py-2">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                        <span className="text-indigo-600 font-semibold text-lg">
                                            {(user?.firstName || user?.email || 'U')[0].toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {user?.firstName || 'User'}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {user?.email}
                                        </p>
                                    </div>
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
                        {activeTab === 'home' && <DashboardHome />}
                        {activeTab === 'transactions' && <Transactions />}
                        {activeTab === 'categories' && <Categories />}
                        {activeTab === 'settings' && <Settings />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;