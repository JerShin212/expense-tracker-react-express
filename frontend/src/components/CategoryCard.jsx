function CategoryCard({ category, onEdit, onDelete }) {
    const isExpense = category.type === 'expense';

    return (
        <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition duration-200 overflow-hidden border border-gray-100 dark:border-gray-800"
            style={{ borderTop: `4px solid ${category.color}` }}
        >
            <div className="p-5">
                {/* Icon and Type Badge */}
                <div className="flex items-start justify-between mb-3">
                    <div
                        className="text-3xl w-12 h-12 flex items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${category.color}20` }}
                    >
                        {category.icon}
                    </div>
                    <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${isExpense
                                ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                                : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                            }`}
                    >
                        {category.type}
                    </span>
                </div>

                {/* Category Name */}
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg mb-2 truncate">
                    {category.name}
                </h3>

                {/* Default Badge */}
                {category.isDefault && (
                    <span className="inline-block text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full mb-3">
                        Default
                    </span>
                )}

                {/* Actions */}
                {!category.isDefault && (
                    <div className="flex space-x-2 mt-4">
                        <button
                            onClick={() => onEdit(category)}
                            className="flex-1 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 py-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition duration-200 font-medium text-sm"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(category)}
                            className="flex-1 bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-300 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/60 transition duration-200 font-medium text-sm"
                        >
                            Delete
                        </button>
                    </div>
                )}

                {category.isDefault && (
                    <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
                        Default categories cannot be modified
                    </div>
                )}
            </div>
        </div>
    );
}

export default CategoryCard;
