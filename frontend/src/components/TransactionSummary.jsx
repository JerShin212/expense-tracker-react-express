import { formatCurrency } from "../utils/currencyFormatter";

function TransactionSummary({ summary, loading, currency }) {

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Income Card */}
            <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl shadow-md p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-green-600 mb-1">Total Income</p>
                        <p className="text-2xl sm:text-3xl font-bold text-green-700">
                            {formatCurrency(summary?.totalIncome || 0, currency)}
                        </p>
                    </div>
                    <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Expense Card */}
            <div className="bg-linear-to-br from-red-50 to-pink-50 rounded-xl shadow-md p-6 border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-red-600 mb-1">Total Expenses</p>
                        <p className="text-2xl sm:text-3xl font-bold text-red-700">
                            {formatCurrency(summary?.totalExpense || 0, currency)}
                        </p>
                    </div>
                    <div className="bg-red-500 w-12 h-12 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Balance Card */}
            <div className={`bg-linear-to-br ${(summary?.balance || 0) >= 0
                    ? 'from-indigo-50 to-purple-50 border-indigo-500'
                    : 'from-orange-50 to-red-50 border-orange-500'
                } rounded-xl shadow-md p-6 border-l-4`}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className={`text-sm font-medium mb-1 ${(summary?.balance || 0) >= 0 ? 'text-indigo-600' : 'text-orange-600'
                            }`}>
                            Balance
                        </p>
                        <p className={`text-2xl sm:text-3xl font-bold ${(summary?.balance || 0) >= 0 ? 'text-indigo-700' : 'text-orange-700'
                            }`}>
                            {formatCurrency(summary?.balance || 0, currency)}
                        </p>
                    </div>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${(summary?.balance || 0) >= 0 ? 'bg-indigo-500' : 'bg-orange-500'
                        }`}>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TransactionSummary;
