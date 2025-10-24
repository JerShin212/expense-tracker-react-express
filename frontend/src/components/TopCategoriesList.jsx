import { formatCurrency } from '../utils/currencyFormatter';

function TopCategoriesList({ categories, loading, type = 'expense', currency }) {

    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                        <div className="flex items-center justify-between mb-2">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!categories || categories.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400 dark:text-gray-500">
                <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <p className="text-sm">No categories found</p>
            </div>
        );
    }

    // Calculate total for percentage bars
    const total = categories.reduce((sum, cat) => sum + parseFloat(cat.total), 0);

    return (
        <div className="space-y-4">
            {categories.map((category, index) => {
                const percentage = total > 0 ? (parseFloat(category.total) / total) * 100 : 0;

                return (
                    <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2 flex-1">
                            <span className="text-xl">{category.categoryIcon}</span>
                            <span className="font-medium text-gray-800 dark:text-gray-100 truncate">
                                {category.categoryName}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                ({category.count})
                            </span>
                        </div>
                        <span className={`font-semibold shrink-0 ${type === 'income' ? 'text-green-600 dark:text-green-300' : 'text-red-600 dark:text-red-300'
                            }`}>
                                {formatCurrency(category.total, currency)}
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                            <div
                                className="h-2 rounded-full transition-all duration-300"
                                style={{
                                    width: `${percentage}%`,
                                    backgroundColor: category.categoryColor
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default TopCategoriesList;
