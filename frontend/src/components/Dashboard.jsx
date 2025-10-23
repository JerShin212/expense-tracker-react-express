import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
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

            {/* Main Layout with Sidebar for Ads */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Main Content - 9 columns on large screens */}
                    <div className="lg:col-span-9 space-y-6">
                        {/* Welcome Card */}
                        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                                Welcome to Your Dashboard! 🎉
                            </h2>

                            <div className="bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 sm:p-6 mb-6">
                                <h3 className="text-lg sm:text-xl font-semibold text-green-800 mb-2">
                                    ✅ Phase 3 Complete!
                                </h3>
                                <p className="text-green-700 text-sm sm:text-base">
                                    Authentication is fully working. You're now logged in!
                                </p>
                            </div>

                            {/* User Info */}
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
                                    <p className="text-gray-700 text-sm sm:text-base break-all">
                                        <span className="font-semibold">User ID:</span> {user?.id}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Ad Space - Between content */}
                        <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center">
                            <p className="text-gray-400 text-sm">Advertisement Space (728x90)</p>
                        </div>

                        {/* Next Steps Card */}
                        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                            <div className="bg-linear-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 sm:p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    🚀 Next Steps
                                </h3>
                                <p className="text-gray-700 text-sm sm:text-base">
                                    Ready to move to <strong>Phase 4: Categories Backend</strong>?
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - 3 columns on large screens, hidden on mobile */}
                    <div className="lg:col-span-3 hidden lg:block space-y-6">
                        {/* Ad Space - Sidebar */}
                        <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 text-center sticky top-20">
                            <p className="text-gray-400 text-sm mb-2">Advertisement</p>
                            <p className="text-gray-400 text-xs">(300x250)</p>
                            <div className="mt-4 h-64 bg-gray-50 rounded"></div>
                        </div>

                        {/* Another Ad Space */}
                        <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <p className="text-gray-400 text-sm mb-2">Advertisement</p>
                            <p className="text-gray-400 text-xs">(300x250)</p>
                            <div className="mt-4 h-64 bg-gray-50 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}