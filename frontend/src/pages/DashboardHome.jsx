import { useState, useEffect } from 'react';
import {
    getSummary,
    getCategoryBreakdown,
    getMonthlyTrends,
    getDailyPattern,
    getRecentTransactions,
    getTopCategories
} from '../services/analyticsService';
import { formatCurrency, getUserCurrency } from '../utils/currencyFormatter';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import MonthlyTrendsChart from '../components/charts/MonthlyTrendsChart';
import RecentTransactionsList from '../components/RecentTransactionsList';
import TopCategoriesList from '../components/TopCategoriesList';
import TransactionModal from '../components/TransactionModal';

function DashboardHome() {
    const [currency, setCurrency] = useState('USD');

    useEffect(() => {
        let isMounted = true;

        const loadCurrency = async () => {
            const userCurrency = await getUserCurrency();
            if (isMounted) {
                setCurrency(userCurrency);
            }
        };

        loadCurrency();

        return () => {
            isMounted = false;
        };
    }, []);

    // State
    const [summary, setSummary] = useState(null);
    const [expenseBreakdown, setExpenseBreakdown] = useState([]);
    const [trendsData, setTrendsData] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [topExpenses, setTopExpenses] = useState([]);

    // Loading states
    const [summaryLoading, setSummaryLoading] = useState(true);
    const [breakdownLoading, setBreakdownLoading] = useState(true);
    const [trendsLoading, setTrendsLoading] = useState(true);
    const [recentLoading, setRecentLoading] = useState(true);
    const [topLoading, setTopLoading] = useState(true);

    const [error, setError] = useState('');

    // Date filter - default to current month
    const [dateFilter, setDateFilter] = useState('month'); // 'month', 'year', 'all'

    // Quick add transaction modal
    const [showTransactionModal, setShowTransactionModal] = useState(false);

    useEffect(() => {
        fetchAllData();
    }, [dateFilter]);

    const fetchAllData = async () => {
        const params = getDateParams();

        try {
            // Fetch summary
            setSummaryLoading(true);
            const summaryData = await getSummary(params);
            setSummary(summaryData.data);
        } catch (err) {
            setError('Failed to load summary');
        } finally {
            setSummaryLoading(false);
        }

        try {
            // Fetch expense breakdown
            setBreakdownLoading(true);
            const breakdownData = await getCategoryBreakdown({ ...params, type: 'expense' });
            setExpenseBreakdown(breakdownData.data.breakdown || []);
        } catch (err) {
            console.error('Failed to load breakdown:', err);
        } finally {
            setBreakdownLoading(false);
        }

        try {
            // Fetch trends data based on filter
            setTrendsLoading(true);
            await fetchTrendsData();
        } catch (err) {
            console.error('Failed to load trends:', err);
        } finally {
            setTrendsLoading(false);
        }

        try {
            // Fetch recent transactions
            setRecentLoading(true);
            const recentData = await getRecentTransactions({ limit: 5 });
            setRecentTransactions(recentData.data || []);
        } catch (err) {
            console.error('Failed to load recent transactions:', err);
        } finally {
            setRecentLoading(false);
        }

        try {
            // Fetch top expense categories
            setTopLoading(true);
            const topData = await getTopCategories({ ...params, limit: 5, type: 'expense' });
            setTopExpenses(topData.data || []);
        } catch (err) {
            console.error('Failed to load top categories:', err);
        } finally {
            setTopLoading(false);
        }
    };

    const fetchTrendsData = async () => {
        const today = new Date();

        if (dateFilter === 'month') {
            // Use daily pattern for current month
            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            const params = {
                startDate: firstDay.toISOString().split('T')[0],
                endDate: today.toISOString().split('T')[0]
            };

            const dailyData = await getDailyPattern(params);
            setTrendsData(dailyData.data || []);
        } else if (dateFilter === 'year') {
            // Use monthly trends for current year (12 months)
            const params = { months: 12 };
            const monthlyData = await getMonthlyTrends(params);

            // Filter only current year data
            const currentYear = today.getFullYear();
            const filteredData = (monthlyData.data || []).filter(item => {
                return item.month.startsWith(currentYear.toString());
            });

            setTrendsData(filteredData);
        } else {
            // Use monthly trends for all time (12 months)
            const params = { months: 12 };
            const monthlyData = await getMonthlyTrends(params);
            setTrendsData(monthlyData.data || []);
        }
    };

    const getDateParams = () => {
        const params = {};
        const today = new Date();

        if (dateFilter === 'month') {
            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            params.startDate = firstDay.toISOString().split('T')[0];
            params.endDate = today.toISOString().split('T')[0];
        } else if (dateFilter === 'year') {
            const firstDay = new Date(today.getFullYear(), 0, 1);
            params.startDate = firstDay.toISOString().split('T')[0];
            params.endDate = today.toISOString().split('T')[0];
        }
        // For 'all', don't add date parameters

        return params;
    };

    const getTrendsTitle = () => {
        if (dateFilter === 'month') {
            return 'This Month (Daily)';
        } else if (dateFilter === 'year') {
            return 'This Year (Monthly)';
        } else {
            return 'Last 12 Months';
        }
    };

    const handleQuickAddTransaction = () => {
        setShowTransactionModal(true);
    };

    const handleTransactionSubmit = async (transactionData) => {
        try {
            await createTransaction(transactionData);
            setSuccess('Transaction added successfully!');
            setShowTransactionModal(false);

            // Refresh all data
            await fetchAllData();

            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to add transaction');
            setTimeout(() => setError(''), 3000);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-gray-600 mt-1">Overview of your financial health</p>
                </div>

                {/* Date Filter */}
                <div className="flex bg-white rounded-lg shadow-md p-1">
                    <button
                        onClick={() => setDateFilter('month')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition ${dateFilter === 'month'
                            ? 'bg-indigo-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        This Month
                    </button>
                    <button
                        onClick={() => setDateFilter('year')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition ${dateFilter === 'year'
                            ? 'bg-indigo-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        This Year
                    </button>
                    <button
                        onClick={() => setDateFilter('all')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition ${dateFilter === 'all'
                            ? 'bg-indigo-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        All Time
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Total Income */}
                <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl shadow-md p-6 border-l-4 border-green-500">
                    {summaryLoading ? (
                        <div className="animate-pulse">
                            <div className="h-4 bg-green-200 rounded w-1/2 mb-3"></div>
                            <div className="h-8 bg-green-200 rounded w-3/4"></div>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm font-medium text-green-600 mb-1">Total Income</p>
                            <p className="text-2xl font-bold text-green-700">
                                {formatCurrency(summary?.totalIncome || 0, currency)}
                            </p>
                            <p className="text-xs text-green-600 mt-2">
                                {summary?.incomeCount || 0} transactions
                            </p>
                        </>
                    )}
                </div>

                {/* Total Expenses */}
                <div className="bg-linear-to-br from-red-50 to-pink-50 rounded-xl shadow-md p-6 border-l-4 border-red-500">
                    {summaryLoading ? (
                        <div className="animate-pulse">
                            <div className="h-4 bg-red-200 rounded w-1/2 mb-3"></div>
                            <div className="h-8 bg-red-200 rounded w-3/4"></div>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm font-medium text-red-600 mb-1">Total Expenses</p>
                            <p className="text-2xl font-bold text-red-700">
                                {formatCurrency(summary?.totalExpense || 0, currency)}
                            </p>
                            <p className="text-xs text-red-600 mt-2">
                                {summary?.expenseCount || 0} transactions
                            </p>
                        </>
                    )}
                </div>

                {/* Balance */}
                <div className={`bg-linear-to-br ${(summary?.balance || 0) >= 0
                    ? 'from-indigo-50 to-purple-50 border-indigo-500'
                    : 'from-orange-50 to-red-50 border-orange-500'
                    } rounded-xl shadow-md p-6 border-l-4`}>
                    {summaryLoading ? (
                        <div className="animate-pulse">
                            <div className="h-4 bg-indigo-200 rounded w-1/2 mb-3"></div>
                            <div className="h-8 bg-indigo-200 rounded w-3/4"></div>
                        </div>
                    ) : (
                        <>
                            <p className={`text-sm font-medium mb-1 ${(summary?.balance || 0) >= 0 ? 'text-indigo-600' : 'text-orange-600'
                                }`}>
                                Balance
                            </p>
                            <p className={`text-2xl font-bold ${(summary?.balance || 0) >= 0 ? 'text-indigo-700' : 'text-orange-700'
                                }`}>
                                {formatCurrency(summary?.balance || 0, currency)}
                            </p>
                            <p className={`text-xs mt-2 ${(summary?.balance || 0) >= 0 ? 'text-indigo-600' : 'text-orange-600'
                                }`}>
                                {summary?.transactionCount || 0} total transactions
                            </p>
                        </>
                    )}
                </div>

                {/* Average Expense */}
                <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-xl shadow-md p-6 border-l-4 border-purple-500">
                    {summaryLoading ? (
                        <div className="animate-pulse">
                            <div className="h-4 bg-purple-200 rounded w-1/2 mb-3"></div>
                            <div className="h-8 bg-purple-200 rounded w-3/4"></div>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm font-medium text-purple-600 mb-1">Avg Expense</p>
                            <p className="text-2xl font-bold text-purple-700">
                                {formatCurrency(summary?.avgExpense || 0, currency)}
                            </p>
                            <p className="text-xs text-purple-600 mt-2">
                                per transaction
                            </p>
                        </>
                    )}
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Expense Breakdown */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Expense Breakdown</h2>
                    <CategoryPieChart data={expenseBreakdown} loading={breakdownLoading} currency={currency} />
                </div>

                {/* Trends Chart - Dynamic */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">{getTrendsTitle()}</h2>
                    <MonthlyTrendsChart
                        data={trendsData}
                        loading={trendsLoading}
                        isDaily={dateFilter === 'month'}
                        currency={currency}
                    />
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Spending Categories */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Top Spending Categories</h2>
                    <TopCategoriesList
                        categories={topExpenses}
                        loading={topLoading}
                        type="expense"
                        currency={currency}
                    />
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Transactions</h2>
                    <RecentTransactionsList
                        transactions={recentTransactions}
                        loading={recentLoading}
                        currency={currency}
                    />
                </div>
            </div>
            {/* Floating Action Button (FAB) */}
            <button
                onClick={handleQuickAddTransaction}
                className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 z-30 group"
                aria-label="Add Transaction"
            >
                <svg
                    className="w-8 h-8 transition-transform group-hover:rotate-90"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>

                {/* Tooltip */}
                <span className="absolute right-full mr-3 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Add Transaction
                </span>
            </button>

            {/* Quick Add Transaction Modal */}
            {showTransactionModal && (
                <TransactionModal
                    transaction={null}
                    onClose={() => setShowTransactionModal(false)}
                    onSubmit={handleTransactionSubmit}
                />
            )}
        </div>
    );
}

export default DashboardHome;