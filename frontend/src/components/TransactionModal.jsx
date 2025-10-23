import { useState, useEffect } from 'react';
import { getCategories } from '../services/categoryService';

function TransactionModal({ transaction, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        categoryId: '',
        amount: '',
        type: 'expense',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCategories();
        if (transaction) {
            setFormData({
                categoryId: transaction.categoryId,
                amount: transaction.amount,
                type: transaction.type,
                description: transaction.description || '',
                date: transaction.date
            });
        }
    }, [transaction]);

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data.data || []);
        } catch (err) {
            setError('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        setError('');
    };

    const handleTypeChange = (type) => {
        setFormData({
            ...formData,
            type,
            categoryId: '' // Reset category when type changes
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!formData.categoryId) {
            setError('Please select a category');
            return;
        }

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        if (!formData.date) {
            setError('Please select a date');
            return;
        }

        // Find selected category to verify type matches
        const selectedCategory = categories.find(c => c.id === formData.categoryId);
        if (selectedCategory && selectedCategory.type !== formData.type) {
            setError(`Selected category is for ${selectedCategory.type}, but transaction type is ${formData.type}`);
            return;
        }

        onSubmit({
            ...formData,
            amount: parseFloat(formData.amount)
        });
    };

    // Filter categories by selected type
    const filteredCategories = categories.filter(cat => cat.type === formData.type);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <h2 className="text-xl font-bold text-gray-800">
                        {transaction ? 'Edit Transaction' : 'New Transaction'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Type Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => handleTypeChange('expense')}
                                className={`py-3 px-4 rounded-lg font-medium transition ${formData.type === 'expense'
                                        ? 'bg-red-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                💸 Expense
                            </button>
                            <button
                                type="button"
                                onClick={() => handleTypeChange('income')}
                                className={`py-3 px-4 rounded-lg font-medium transition ${formData.type === 'income'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                💰 Income
                            </button>
                        </div>
                    </div>

                    {/* Category Selection */}
                    <div>
                        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                        </label>
                        {loading ? (
                            <div className="text-sm text-gray-500">Loading categories...</div>
                        ) : (
                            <select
                                id="categoryId"
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                            >
                                <option value="">Select a category</option>
                                {filteredCategories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.icon} {category.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Amount */}
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                            Amount
                        </label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                            min="0.01"
                            step="0.01"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                            placeholder="0.00"
                        />
                    </div>

                    {/* Date */}
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                            Date
                        </label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            max={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Description (Optional)
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            maxLength="255"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none"
                            placeholder="Add a note about this transaction..."
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {formData.description.length}/255 characters
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition duration-200 font-semibold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-200 font-semibold"
                        >
                            {transaction ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TransactionModal;