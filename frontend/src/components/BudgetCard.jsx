import { formatCurrency } from "../utils/currencyFormatter";

export default function BudgetCard({ budget, onEdit, onDelete, currency }) {
    const getStatusColor = () => {
        if (budget.status === 'exceeded') return 'red';
        if (budget.status === 'warning') return 'yellow';
        return 'green';
    };

    const getStatusText = () => {
        if (budget.status === 'exceeded') return 'Over Budget';
        if (budget.status === 'warning') return 'Warning';
        return 'On Track';
    };

    const statusColor = getStatusColor();
    const statusText = getStatusText();

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${budget.category.color}20` }}
                    >
                        {budget.category.icon}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                            {budget.category.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {budget.period} Budget
                        </p>
                    </div>
                </div>

                {/* Status Badge */}
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor === 'red'
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        : statusColor === 'yellow'
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                            : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    }`}>
                    {statusText}
                </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                        Spent: {formatCurrency(budget.spentAmount, currency)}
                    </span>
                    <span className="font-medium text-gray-800 dark:text-gray-100">
                        {budget.percentage.toFixed(0)}%
                    </span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-300 ${statusColor === 'red'
                                ? 'bg-red-500'
                                : statusColor === 'yellow'
                                    ? 'bg-yellow-500'
                                    : 'bg-green-500'
                            }`}
                        style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                    />
                </div>
            </div>

            {/* Budget Info */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Budget</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        {formatCurrency(budget.budgetAmount, currency)}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Remaining</p>
                    <p className={`text-sm font-semibold ${budget.remaining >= 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                        {formatCurrency(Math.abs(budget.remaining), currency)}
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => onEdit(budget)}
                    className="flex-1 px-3 py-2 text-sm bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition"
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(budget)}
                    className="flex-1 px-3 py-2 text-sm bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}