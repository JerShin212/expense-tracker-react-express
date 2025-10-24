import { useState, useEffect } from 'react';
import { formatCurrency, getUserCurrency } from '../utils/currencyFormatter';

function RecentTransactionsList({ transactions, loading, currency }) {

    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                        <div className="flex-1">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!transactions || transactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400 dark:text-gray-500">
                <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-sm">No recent transactions</p>
            </div>
        );
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-2">
            {transactions.map((transaction) => (
                <div
                    key={transaction.id}
                    className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition"
                >
                    {/* Category Icon */}
                    <div
                        className="w-10 h-10 flex items-center justify-center rounded-lg text-xl shrink-0"
                        style={{ backgroundColor: `${transaction.category.color}20` }}
                    >
                        {transaction.category.icon}
                    </div>

                    {/* Transaction Info */}
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 dark:text-gray-100 truncate">
                            {transaction.category.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(transaction.date)}
                            {transaction.description && ` • ${transaction.description}`}
                        </p>
                    </div>

                    {/* Amount */}
                    <div className={`font-semibold shrink-0 ${transaction.type === 'income' ? 'text-green-600 dark:text-green-300' : 'text-red-600 dark:text-red-300'
                        }`}>
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount, currency)}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default RecentTransactionsList;
