import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-indigo-600">
                                Expense Tracker
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700">
                                Hello, {user?.firstName || user?.email}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">
                        Welcome to Your Dashboard! 🎉
                    </h2>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                        <h3 className="text-xl font-semibold text-green-800 mb-2">
                            ✅ Phase 3 Complete!
                        </h3>
                        <p className="text-green-700">
                            Authentication is fully working. You're now logged in!
                        </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Your Account Information
                        </h3>
                        <div className="space-y-2">
                            <p className="text-gray-700">
                                <span className="font-semibold">Email:</span> {user?.email}
                            </p>
                            {user?.firstName && (
                                <p className="text-gray-700">
                                    <span className="font-semibold">First Name:</span> {user.firstName}
                                </p>
                            )}
                            {user?.lastName && (
                                <p className="text-gray-700">
                                    <span className="font-semibold">Last Name:</span> {user.lastName}
                                </p>
                            )}
                            <p className="text-gray-700">
                                <span className="font-semibold">User ID:</span> {user?.id}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            🚀 Next Steps
                        </h3>
                        <p className="text-gray-700">
                            Ready to move to <strong>Phase 4: Categories Backend</strong>?
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}