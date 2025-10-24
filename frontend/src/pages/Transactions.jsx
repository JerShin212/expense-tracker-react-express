import { useState, useEffect } from 'react';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction, getTransactionSummary } from '../services/transactionService';
import { getCategories } from '../services/categoryService';
import { exportPDF } from '../services/exportService';
import { getUserCurrency } from "../utils/currencyFormatter";
import TransactionSummary from '../components/TransactionSummary';
import TransactionCard from '../components/TransactionCard';
import TransactionModal from '../components/TransactionModal';
import ConfirmModal from '../components/ConfirmModal';

function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [summaryLoading, setSummaryLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [exportLoading, setExportLoading] = useState(false);

    // Filters with date range
    const [filters, setFilters] = useState({
        type: 'all',
        categoryId: 'all',
        search: '',
        startDate: '',
        endDate: ''
    });

    // Modals
    const [showModal, setShowModal] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState(null);
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

    useEffect(() => {
        // Set default to current month on first load
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        setFilters(prev => ({
            ...prev,
            startDate: firstDay.toISOString().split('T')[0],
            endDate: today.toISOString().split('T')[0]
        }));
    }, []);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (filters.startDate || filters.endDate || filters.type !== 'all' || filters.categoryId !== 'all' || filters.search) {
            fetchTransactions();
            fetchSummary();
        }
    }, [filters]);

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data.data || []);
        } catch (err) {
            console.error('Failed to load categories:', err);
        }
    };

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            setError('');

            const params = {};
            if (filters.type !== 'all') params.type = filters.type;
            if (filters.categoryId !== 'all') params.categoryId = filters.categoryId;
            if (filters.search) params.search = filters.search;
            if (filters.startDate) params.startDate = filters.startDate;
            if (filters.endDate) params.endDate = filters.endDate;

            const data = await getTransactions(params);
            setTransactions(data.data || []);
        } catch (err) {
            setError(err.message || 'Failed to load transactions');
        } finally {
            setLoading(false);
        }
    };

    const fetchSummary = async () => {
        try {
            setSummaryLoading(true);
            const params = {};
            if (filters.startDate) params.startDate = filters.startDate;
            if (filters.endDate) params.endDate = filters.endDate;

            const data = await getTransactionSummary(params);
            setSummary(data.data);
        } catch (err) {
            console.error('Failed to load summary:', err);
        } finally {
            setSummaryLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters({
            ...filters,
            [key]: value
        });
    };

    const setQuickFilter = (filterType) => {
        const today = new Date();
        let startDate, endDate;

        if (filterType === 'month') {
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            endDate = today;
        } else if (filterType === 'year') {
            startDate = new Date(today.getFullYear(), 0, 1);
            endDate = today;
        } else {
            // All time
            startDate = null;
            endDate = null;
        }

        setFilters({
            ...filters,
            startDate: startDate ? startDate.toISOString().split('T')[0] : '',
            endDate: endDate ? endDate.toISOString().split('T')[0] : ''
        });
    };

    const handleCreateTransaction = () => {
        setEditingTransaction(null);
        setShowModal(true);
    };

    const handleEditTransaction = (transaction) => {
        setEditingTransaction(transaction);
        setShowModal(true);
    };

    const handleDeleteClick = (transaction) => {
        setTransactionToDelete(transaction);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteTransaction(transactionToDelete.id);
            setSuccess('Transaction deleted successfully!');
            setShowDeleteConfirm(false);
            setTransactionToDelete(null);
            await fetchTransactions();
            await fetchSummary();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to delete transaction');
            setShowDeleteConfirm(false);
            setTransactionToDelete(null);
        }
    };

    const handleModalSubmit = async (transactionData) => {
        try {
            if (editingTransaction) {
                await updateTransaction(editingTransaction.id, transactionData);
                setSuccess('Transaction updated successfully!');
            } else {
                await createTransaction(transactionData);
                setSuccess('Transaction created successfully!');
            }
            setShowModal(false);
            await fetchTransactions();
            await fetchSummary();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to save transaction');
        }
    };

    const clearFilters = () => {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        setFilters({
            type: 'all',
            categoryId: 'all',
            search: '',
            startDate: firstDay.toISOString().split('T')[0],
            endDate: today.toISOString().split('T')[0]
        });
    };

    const hasActiveFilters = filters.type !== 'all' ||
        filters.categoryId !== 'all' ||
        filters.search;

    const getDateRangeParams = () => {
        const params = {};

        if (filters.startDate) {
            params.startDate = filters.startDate;
        }

        if (filters.endDate) {
            params.endDate = filters.endDate;
        }

        return params;
    };

    const handleExportPDF = async () => {
        try {
            setExportLoading(true);

            const params = { ...getDateRangeParams() };
            if (filters.type !== 'all') params.type = filters.type;
            if (filters.categoryId !== 'all') params.categoryId = filters.categoryId;

            await exportPDF(params);
            setSuccess('PDF exported successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to export PDF');
            setTimeout(() => setError(''), 3000);
        } finally {
            setExportLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">Transactions</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Track your income and expenses</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleExportPDF}
                        disabled={exportLoading || transactions.length === 0}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-200 font-semibold shadow-lg flex items-center justify-center disabled:bg-gray-500 disabled:text-gray-300 disabled:cursor-not-allowed"
                    >
                        {exportLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Exporting...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Export PDF
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleCreateTransaction}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-200 font-semibold shadow-lg flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Transaction
                    </button>
                </div>
            </div>

            {/* Success/Error Messages */}
            {success && (
                <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-200 px-4 py-3 rounded-lg">
                    {success}
                </div>
            )}

            {error && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Quick Date Filters */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setQuickFilter('month')}
                    className="px-4 py-2 bg-white dark:bg-gray-800 border-2 border-indigo-600 dark:border-indigo-500/70 text-indigo-600 dark:text-indigo-300 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 transition duration-200 font-medium text-sm"
                >
                    This Month
                </button>
                <button
                    onClick={() => setQuickFilter('year')}
                    className="px-4 py-2 bg-white dark:bg-gray-800 border-2 border-indigo-600 dark:border-indigo-500/70 text-indigo-600 dark:text-indigo-300 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 transition duration-200 font-medium text-sm"
                >
                    This Year
                </button>
                <button
                    onClick={() => setQuickFilter('all')}
                    className="px-4 py-2 bg-white dark:bg-gray-800 border-2 border-indigo-600 dark:border-indigo-500/70 text-indigo-600 dark:text-indigo-300 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 transition duration-200 font-medium text-sm"
                >
                    All Time
                </button>
            </div>

            {/* Summary Cards */}
            <TransactionSummary summary={summary} loading={summaryLoading} currency={currency} />

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">Filters</h3>
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Type Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Type
                        </label>
                        <select
                            value={filters.type}
                            onChange={(e) => handleFilterChange('type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        >
                            <option value="all">All Types</option>
                            <option value="expense">Expenses</option>
                            <option value="income">Income</option>
                        </select>
                    </div>

                    {/* Category Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Category
                        </label>
                        <select
                            value={filters.categoryId}
                            onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        >
                            <option value="all">All Categories</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.icon} {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Start Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Start Date
                        </label>
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => handleFilterChange('startDate', e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                    </div>

                    {/* End Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            End Date
                        </label>
                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => handleFilterChange('endDate', e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                    </div>
                </div>

                {/* Search */}
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Search
                    </label>
                    <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        placeholder="Search by description..."
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none placeholder-gray-300 dark:placeholder-gray-500"
                    />
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            )}

            {/* Empty State */}
            {!loading && transactions.length === 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 sm:p-12 text-center border border-gray-200 dark:border-gray-700">
                    <div className="text-6xl mb-4">💳</div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">No Transactions Yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {hasActiveFilters || filters.startDate || filters.endDate
                            ? 'No transactions match your filters. Try adjusting your search criteria.'
                            : 'Start tracking your finances by adding your first transaction'}
                    </p>
                    {!hasActiveFilters && (
                        <button
                            onClick={handleCreateTransaction}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-200 font-semibold"
                        >
                            Add Transaction
                        </button>
                    )}
                </div>
            )}

            {/* Transactions Grid */}
            {!loading && transactions.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Showing {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {transactions.map((transaction) => (
                            <TransactionCard
                                key={transaction.id}
                                transaction={transaction}
                                onEdit={handleEditTransaction}
                                onDelete={handleDeleteClick}
                                currency={currency}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Transaction Modal */}
            {showModal && (
                <TransactionModal
                    transaction={editingTransaction}
                    onClose={() => setShowModal(false)}
                    onSubmit={handleModalSubmit}
                />
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={showDeleteConfirm}
                title="Delete Transaction"
                message={`Are you sure you want to delete this transaction? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </div>
    );
}

export default Transactions;
