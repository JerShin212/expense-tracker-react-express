import { useState, useEffect } from 'react';

function CategoryModal({ category, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        name: '',
        type: 'expense',
        color: '#6366f1',
        icon: '📁'
    });
    const [error, setError] = useState('');

    const colors = [
        '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#6366f1',
        '#8b5cf6', '#ec4899', '#f97316', '#14b8a6', '#06b6d4',
        '#84cc16', '#22c55e', '#0ea5e9', '#6b7280', '#64748b'
    ];

    const icons = [
        '🍔', '🚗', '🛍️', '🎬', '💡', '💊', '📚', '✈️', '💅', '📦',
        '💰', '💼', '📈', '🏢', '💵', '🏠', '📱', '☕', '🎮', '⚡',
        '🎨', '🏃', '🎵', '📷', '🎁', '🔧', '🌟', '💳', '🎯', '📁'
    ];

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name,
                type: category.type,
                color: category.color,
                icon: category.icon
            });
        }
    }, [category]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            setError('Category name is required');
            return;
        }

        if (formData.name.length > 50) {
            setError('Category name must be less than 50 characters');
            return;
        }

        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                        {category ? 'Edit Category' : 'New Category'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Category Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Category Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            maxLength={50}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition placeholder-gray-300 dark:placeholder-gray-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                            placeholder="e.g., Groceries"
                        />
                    </div>

                    {/* Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Type
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'expense' })}
                                className={`py-3 px-4 rounded-lg font-medium transition ${formData.type === 'expense'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                            >
                                💸 Expense
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'income' })}
                                className={`py-3 px-4 rounded-lg font-medium transition ${formData.type === 'income'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                            >
                                💰 Income
                            </button>
                        </div>
                    </div>

                    {/* Color */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Color
                        </label>
                        <div className="grid grid-cols-8 gap-2">
                            {colors.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, color })}
                                    className={`w-10 h-10 rounded-lg transition-transform ${formData.color === color ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : 'hover:scale-105'
                                        }`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Icon */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Icon
                        </label>
                        <div className="grid grid-cols-10 gap-2 max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-2">
                            {icons.map((icon) => (
                                <button
                                    key={icon}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, icon })}
                                    className={`text-2xl p-2 rounded-lg transition-all flex items-center justify-center ${formData.icon === icon
                                            ? 'bg-indigo-100 dark:bg-indigo-900/40 ring-2 ring-indigo-500 dark:ring-indigo-400'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    {icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="bg-gray-50 dark:bg-gray-900/60 rounded-lg p-4">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Preview</p>
                        <div
                            className="bg-white dark:bg-gray-800 rounded-lg p-4 border-t-4 flex items-center space-x-3"
                            style={{ borderColor: formData.color }}
                        >
                            <div
                                className="text-3xl w-12 h-12 flex items-center justify-center rounded-lg"
                                style={{ backgroundColor: `${formData.color}20` }}
                            >
                                {formData.icon}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-gray-100">
                                    {formData.name || 'Category Name'}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{formData.type}</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-200 font-semibold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-200 font-semibold"
                        >
                            {category ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CategoryModal;
