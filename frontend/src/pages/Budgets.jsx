import { useEffect, useState } from "react";
import { getBudgetStatus, createBudget, updateBudget, deleteBudget } from "../services/budgetService";
import { getUserCurrency } from "../utils/currencyFormatter";
import BudgetCard from "../components/BudgetCard";
import BudgetModal from "../components/BudgetModal";
import ConfirmModal from "../components/ConfirmModal";

export default function Budgets() {
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [period, setPeriod] = useState('monthly');

    // Modals
    const [showBudgetModal, setShowBudgetModal] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [budgetToDelete, setBudgetToDelete] = useState(null);

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
        fetchBudgets();
    }, [period]);

    const fetchBudgets = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await getBudgetStatus({ period });
            setBudgets(data.data || []);
        } catch (err) {
            setError(err.message || 'Failed to load budgets');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBudget = () => {
        setEditingBudget(null);
        setShowBudgetModal(true);
    };

    const handleEditBudget = (budget) => {
        setEditingBudget(budget);
        setShowBudgetModal(true);
    };

    const handleDeleteClick = (budget) => {
        setBudgetToDelete(budget);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteBudget(budgetToDelete.id);
            setSuccess('Budget deleted successfully!');
            setShowDeleteConfirm(false);
            setBudgetToDelete(null);
            await fetchBudgets();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to delete budget');
            setShowDeleteConfirm(false);
            setBudgetToDelete(null);
        }
    };

    const handleBudgetSubmit = async (budgetData) => {
        try {
            if (editingBudget) {
                await updateBudget(editingBudget.id, budgetData);
                setSuccess('Budget updated successfully!');
            } else {
                await createBudget(budgetData);
                setSuccess('Budget created successfully!');
            }
            setShowBudgetModal(false);
            await fetchBudgets();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            throw err;
        }
    };

    // Calculate overall summary
    const summary = budgets.reduce(
        (acc, budget) => {
            acc.totalBudget += budget.budgetAmount;
            acc.totalSpent += budget.spentAmount;
            if (budget.status === 'exceeded') acc.exceeded++;
            if (budget.status === 'warning') acc.warning++;
            if (budget.status === 'safe') acc.safe++;
            return acc;
        },
        { totalBudget: 0, totalSpent: 0, exceeded: 0, warning: 0, safe: 0 }
    );

    const overallPercentage = summary.totalBudget > 0
        ? (summary.totalSpent / summary.totalBudget) * 100
        : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
                        Budget Management
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Set and track your spending limits
                    </p>
                </div>
                <button
                    onClick={handleCreateBudget}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-200 font-semibold shadow-lg flex items-center justify-center"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Budget
                </button>
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

            {/* Period Filter */}
            <div className="flex bg-white dark:bg-gray-800 rounded-lg shadow-md p-1 w-fit border border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setPeriod('monthly')}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition ${period === 'monthly'
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                >
                    Monthly
                </button>
                <button
                    onClick={() => setPeriod('yearly')}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition ${period === 'yearly'
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                >
                    Yearly
                </button>
            </div>

            {/* Overall Summary */}
            {budgets.length > 0 && (
                <div className="bg-linear-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl shadow-lg p-6 border border-indigo-200 dark:border-indigo-800">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
                        Overall Budget Status
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Budget</p>
                            <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                RM {summary.totalBudget.toFixed(2)}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Spent</p>
                            <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                RM {summary.totalSpent.toFixed(2)}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Remaining</p>
                            <p className={`text-xl font-bold ${summary.totalBudget - summary.totalSpent >= 0
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                                }`}>
                                RM {Math.abs(summary.totalBudget - summary.totalSpent).toFixed(2)}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Overall</p>
                            <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                {overallPercentage.toFixed(0)}%
                            </p>
                        </div>
                    </div>

                    {/* Overall Progress Bar */}
                    <div className="mb-3">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-300 ${overallPercentage >= 100
                                    ? 'bg-red-500'
                                    : overallPercentage >= 70
                                        ? 'bg-yellow-500'
                                        : 'bg-green-500'
                                    }`}
                                style={{ width: `${Math.min(overallPercentage, 100)}%` }}
                            />
                        </div>
                    </div>

                    {/* Status Counts */}
                    <div className="flex items-center justify-center space-x-6 text-sm">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-gray-700 dark:text-gray-300">On Track: {summary.safe}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span className="text-gray-700 dark:text-gray-300">Warning: {summary.warning}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-gray-700 dark:text-gray-300">Exceeded: {summary.exceeded}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            )}

            {/* Empty State */}
            {!loading && budgets.length === 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 sm:p-12 text-center border border-gray-200 dark:border-gray-700">
                    <div className="text-6xl mb-4">💰</div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                        No Budgets Set
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Create your first budget to start tracking your spending limits
                    </p>
                    <button
                        onClick={handleCreateBudget}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-200 font-semibold"
                    >
                        Create Budget
                    </button>
                </div>
            )}

            {/* Budget Cards Grid */}
            {!loading && budgets.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                            Your Budgets ({budgets.length})
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {budgets.map((budget) => (
                            <BudgetCard
                                key={budget.id}
                                budget={budget}
                                onEdit={handleEditBudget}
                                onDelete={handleDeleteClick}
                                currency={currency}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Budget Modal */}
            {showBudgetModal && (
                <BudgetModal
                    budget={editingBudget}
                    onClose={() => setShowBudgetModal(false)}
                    onSubmit={handleBudgetSubmit}
                />
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={showDeleteConfirm}
                title="Delete Budget"
                message={`Are you sure you want to delete the budget for "${budgetToDelete?.category.name}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </div>
    );
}