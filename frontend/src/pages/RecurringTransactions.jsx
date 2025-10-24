import { useState, useEffect } from 'react';
import {
    getRecurringTransactions,
    getUpcomingRecurring,
    createRecurringTransaction,
    updateRecurringTransaction,
    deleteRecurringTransaction,
    generateRecurringTransactions,
    generateSingleRecurring
} from '../services/recurringService';
import { getUserCurrency } from '../utils/currencyFormatter';
import RecurringCard from '../components/RecurringCard';
import RecurringModal from '../components/RecurringModal';
import ConfirmModal from '../components/ConfirmModal';

function RecurringTransactions() {
    const [recurringTransactions, setRecurringTransactions] = useState([]);
    const [upcomingTransactions, setUpcomingTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [upcomingLoading, setUpcomingLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [filter, setFilter] = useState('all'); // all, active, inactive

    // Modals
    const [showRecurringModal, setShowRecurringModal] = useState(false);
    const [editingRecurring, setEditingRecurring] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [recurringToDelete, setRecurringToDelete] = useState(null);
    const [showGenerateConfirm, setShowGenerateConfirm] = useState(false);
    const [recurringToGenerate, setRecurringToGenerate] = useState(null);
    const [generating, setGenerating] = useState(false);

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
        fetchRecurringTransactions();
        fetchUpcomingTransactions();
    }, []);

    const fetchRecurringTransactions = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await getRecurringTransactions();
            setRecurringTransactions(data.data || []);
        } catch (err) {
            setError(err.message || 'Failed to load recurring transactions');
        } finally {
            setLoading(false);
        }
    };

    const fetchUpcomingTransactions = async () => {
        try {
            setUpcomingLoading(true);
            const data = await getUpcomingRecurring({ days: 30 });
            setUpcomingTransactions(data.data || []);
        } catch (err) {
            console.error('Failed to load upcoming transactions:', err);
        } finally {
            setUpcomingLoading(false);
        }
    };

    const handleCreateRecurring = () => {
        setEditingRecurring(null);
        setShowRecurringModal(true);
    };

    const handleEditRecurring = (recurring) => {
        setEditingRecurring(recurring);
        setShowRecurringModal(true);
    };

    const handleDeleteClick = (recurring) => {
        setRecurringToDelete(recurring);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteRecurringTransaction(recurringToDelete.id);
            setSuccess('Recurring transaction deleted successfully!');
            setShowDeleteConfirm(false);
            setRecurringToDelete(null);
            await fetchRecurringTransactions();
            await fetchUpcomingTransactions();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to delete recurring transaction');
            setShowDeleteConfirm(false);
            setRecurringToDelete(null);
        }
    };

    const handleRecurringSubmit = async (recurringData) => {
        try {
            if (editingRecurring) {
                await updateRecurringTransaction(editingRecurring.id, recurringData);
                setSuccess('Recurring transaction updated successfully!');
            } else {
                await createRecurringTransaction(recurringData);
                setSuccess('Recurring transaction created successfully!');
            }
            setShowRecurringModal(false);
            await fetchRecurringTransactions();
            await fetchUpcomingTransactions();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            throw err;
        }
    };

    const handleGenerateClick = (recurring) => {
        setRecurringToGenerate(recurring);
        setShowGenerateConfirm(true);
    };

    const handleGenerateConfirm = async () => {
        try {
            setGenerating(true);
            await generateSingleRecurring(recurringToGenerate.id);
            setSuccess('Transaction generated successfully!');
            setShowGenerateConfirm(false);
            setRecurringToGenerate(null);
            await fetchRecurringTransactions();
            await fetchUpcomingTransactions();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to generate transaction');
            setShowGenerateConfirm(false);
            setRecurringToGenerate(null);
        } finally {
            setGenerating(false);
        }
    };

    const handleGenerateAll = async () => {
        try {
            setGenerating(true);
            const result = await generateRecurringTransactions();
            setSuccess(result.message || 'Transactions generated successfully!');
            await fetchRecurringTransactions();
            await fetchUpcomingTransactions();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to generate transactions');
        } finally {
            setGenerating(false);
        }
    };

    // Filter recurring transactions
    const filteredRecurring = recurringTransactions.filter(recurring => {
        if (filter === 'active') return recurring.isActive;
        if (filter === 'inactive') return !recurring.isActive;
        return true;
    });

    // Calculate stats
    const stats = {
        total: recurringTransactions.length,
        active: recurringTransactions.filter(r => r.isActive).length,
        inactive: recurringTransactions.filter(r => !r.isActive).length,
        upcoming: upcomingTransactions.length
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
                        Recurring Transactions
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Automate your regular income and expenses
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleGenerateAll}
                        disabled={generating || stats.active === 0}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-200 font-semibold shadow-lg flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {generating ? (
                            <>
                                <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Generate All
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleCreateRecurring}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-200 font-semibold shadow-lg flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Recurring
                    </button>
                </div>
            </div>

            {/* Success/Error Messages */}
            {success && (
                <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg">
                    {success}
                </div>
            )}

            {error && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total</p>
                    <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{stats.total}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.active}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Inactive</p>
                    <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">{stats.inactive}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Upcoming (30d)</p>
                    <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stats.upcoming}</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-white dark:bg-gray-800 rounded-lg shadow-md p-1 w-fit border border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition ${filter === 'all'
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                >
                    All ({stats.total})
                </button>
                <button
                    onClick={() => setFilter('active')}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition ${filter === 'active'
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                >
                    Active ({stats.active})
                </button>
                <button
                    onClick={() => setFilter('inactive')}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition ${filter === 'inactive'
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                >
                    Inactive ({stats.inactive})
                </button>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            )}

            {/* Empty State */}
            {!loading && filteredRecurring.length === 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 sm:p-12 text-center border border-gray-200 dark:border-gray-700">
                    <div className="text-6xl mb-4">🔄</div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                        {filter === 'all' ? 'No Recurring Transactions' : `No ${filter} Recurring Transactions`}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {filter === 'all'
                            ? 'Create your first recurring transaction to automate regular income and expenses'
                            : `You don't have any ${filter} recurring transactions`
                        }
                    </p>
                    {filter === 'all' && (
                        <button
                            onClick={handleCreateRecurring}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-200 font-semibold"
                        >
                            Create Recurring Transaction
                        </button>
                    )}
                </div>
            )}

            {/* Recurring Cards Grid */}
            {!loading && filteredRecurring.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                            {filter === 'all' ? 'All' : filter === 'active' ? 'Active' : 'Inactive'} Recurring Transactions ({filteredRecurring.length})
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRecurring.map((recurring) => (
                            <RecurringCard
                                key={recurring.id}
                                recurring={recurring}
                                onEdit={handleEditRecurring}
                                onDelete={handleDeleteClick}
                                onGenerate={handleGenerateClick}
                                currency={currency}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Recurring Modal */}
            {showRecurringModal && (
                <RecurringModal
                    recurring={editingRecurring}
                    onClose={() => setShowRecurringModal(false)}
                    onSubmit={handleRecurringSubmit}
                />
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={showDeleteConfirm}
                title="Delete Recurring Transaction"
                message={`Are you sure you want to delete "${recurringToDelete?.description}"? This will not delete any transactions that were already generated.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setShowDeleteConfirm(false)}
            />

            {/* Generate Confirmation Modal */}
            <ConfirmModal
                isOpen={showGenerateConfirm}
                title="Generate Transaction"
                message={`Generate a transaction now for "${recurringToGenerate?.description}"? This will create a new transaction and update the next scheduled date.`}
                confirmText={generating ? 'Generating...' : 'Generate'}
                cancelText="Cancel"
                type="info"
                onConfirm={handleGenerateConfirm}
                onCancel={() => setShowGenerateConfirm(false)}
            />
        </div>
    );
}

export default RecurringTransactions;