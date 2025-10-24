import { useEffect, useState } from "react";
import { formatCurrency, getUserCurrency } from "../utils/currencyFormatter";

function TransactionCard({ transaction, onEdit, onDelete, currency }) {
    const isIncome = transaction.type === 'income';

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-xl transition duration-200 overflow-hidden border border-gray-100 dark:border-gray-800">
            <div className="p-5">
                {/* Header - Icon, Name, Amount */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3 flex-1">
                        <div
                            className="text-2xl w-10 h-10 flex items-center justify-center rounded-lg shrink-0"
                            style={{ backgroundColor: `${transaction.category.color}20` }}
                        >
                            {transaction.category.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-gray-800 dark:text-gray-100 truncate">
                                {transaction.category.name}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(transaction.date)}</p>
                        </div>
                    </div>
                    <div className={`font-bold text-lg ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                        {isIncome ? '+' : '-'}{formatCurrency(transaction.amount, currency)}
                    </div>
                </div>

                {/* Description */}
                {transaction.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                        {transaction.description}
                    </p>
                )}

                {/* Type Badge */}
                <div className="mb-3">
                    <span
                        className={`inline-block text-xs font-semibold px-2 py-1 rounded-full ${isIncome
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                            }`}
                    >
                        {transaction.type}
                    </span>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <button
                        onClick={() => onEdit(transaction)}
                        className="flex-1 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 py-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition duration-200 font-medium text-sm"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(transaction)}
                        className="flex-1 bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-300 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/60 transition duration-200 font-medium text-sm"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TransactionCard;
