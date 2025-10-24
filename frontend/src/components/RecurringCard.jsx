import { formatCurrency } from '../utils/currencyFormatter';

function RecurringCard({ recurring, onEdit, onDelete, onGenerate, currency }) {


    const getFrequencyLabel = (frequency) => {
        const labels = {
            daily: 'Daily',
            weekly: 'Weekly',
            monthly: 'Monthly',
            yearly: 'Yearly'
        };
        return labels[frequency] || frequency;
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getDaysUntilNext = () => {
        const today = new Date();
        const nextDate = new Date(recurring.nextDate);
        const diffTime = nextDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'Overdue';
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        return `In ${diffDays} days`;
    };

    const isOverdue = () => {
        const today = new Date();
        const nextDate = new Date(recurring.nextDate);
        return nextDate < today && recurring.isActive;
    };

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-2 transition-all ${!recurring.isActive
                ? 'border-gray-300 dark:border-gray-600 opacity-60'
                : isOverdue()
                    ? 'border-orange-400 dark:border-orange-600'
                    : 'border-gray-200 dark:border-gray-700 hover:shadow-lg'
            }`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${recurring.category.color}20` }}
                    >
                        {recurring.category.icon}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                            {recurring.description}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {recurring.category.name} • {getFrequencyLabel(recurring.frequency)}
                        </p>
                    </div>
                </div>

                {/* Status Badge */}
                <div className="flex flex-col items-end space-y-1">
                    {!recurring.isActive && (
                        <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium">
                            Inactive
                        </span>
                    )}
                    {recurring.isActive && isOverdue() && (
                        <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-xs font-medium">
                            Overdue
                        </span>
                    )}
                </div>
            </div>

            {/* Amount */}
            <div className="mb-4">
                <p className={`text-2xl font-bold ${recurring.type === 'income'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                    {recurring.type === 'income' ? '+' : '-'}
                    {formatCurrency(recurring.amount, currency)}
                </p>
            </div>

            {/* Date Info */}
            <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Next Date</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                        {formatDate(recurring.nextDate)}
                    </p>
                    <p className={`text-xs font-medium mt-1 ${isOverdue()
                            ? 'text-orange-600 dark:text-orange-400'
                            : 'text-indigo-600 dark:text-indigo-400'
                        }`}>
                        {getDaysUntilNext()}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Last Generated</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                        {formatDate(recurring.lastGenerated)}
                    </p>
                </div>
            </div>

            {/* Date Range */}
            <div className="mb-4 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center justify-between">
                    <span>Start: {formatDate(recurring.startDate)}</span>
                    <span>End: {recurring.endDate ? formatDate(recurring.endDate) : 'No end date'}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-3 gap-2">
                {recurring.isActive && (
                    <button
                        onClick={() => onGenerate(recurring)}
                        className="px-3 py-2 text-sm bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition font-medium"
                    >
                        Generate
                    </button>
                )}
                <button
                    onClick={() => onEdit(recurring)}
                    className={`px-3 py-2 text-sm bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition font-medium ${!recurring.isActive ? 'col-span-2' : ''
                        }`}
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(recurring)}
                    className="px-3 py-2 text-sm bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition font-medium"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

export default RecurringCard;