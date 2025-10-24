import { useState, useEffect } from "react";
import { getCategories, initializeCategories, createCategory, updateCategory, deleteCategory } from "../services/categoryService";
import CategoryCard from "../components/CategoryCard";
import CategoryModal from "../components/CategoryModal";
import ConfirmModal from "../components/ConfirmModal";

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all'); // 'all', 'expense', 'income'
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [success, setSuccess] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, [filter]);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError('');
            const filterType = filter === 'all' ? null : filter;
            const data = await getCategories(filterType);
            setCategories(data.data || []);
        } catch (err) {
            setError(err.message || 'Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleInitialize = async () => {
        try {
            setLoading(true);
            await initializeCategories();
            setSuccess('Default categories initialized successfully!');
            await fetchCategories();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to initialize categories');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCategory = () => {
        setEditingCategory(null);
        setShowModal(true);
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setShowModal(true);
    };

    const handleDeleteClick = (category) => {
        setCategoryToDelete(category);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteCategory(categoryToDelete.id);
            setSuccess('Category deleted successfully!');
            setShowDeleteConfirm(false);
            setCategoryToDelete(null);
            await fetchCategories();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to delete category');
            setShowDeleteConfirm(false);
            setCategoryToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteConfirm(false);
        setCategoryToDelete(null);
    };

    const handleModalSubmit = async (categoryData) => {
        try {
            if (editingCategory) {
                await updateCategory(editingCategory.id, categoryData);
                setSuccess('Category updated successfully!');
            } else {
                await createCategory(categoryData);
                setSuccess('Category created successfully!');
            }
            setShowModal(false);
            await fetchCategories();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to save category');
        }
    };

    const expenseCategories = categories.filter(cat => cat.type === 'expense');
    const incomeCategories = categories.filter(cat => cat.type === 'income');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">Categories</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your expense and income categories</p>
                </div>
                <button
                    onClick={handleCreateCategory}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-200 font-semibold shadow-lg flex items-center justify-center"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Category
                </button>
            </div>

            {/* Success Message */}
            {success && (
                <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-200 px-4 py-3 rounded-lg">
                    {success}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Filter Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-2 flex space-x-2 border border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setFilter('all')}
                    className={`flex-1 py-2 px-4 rounded-md font-medium transition ${filter === 'all'
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                >
                    All ({categories.length})
                </button>
                <button
                    onClick={() => setFilter('expense')}
                    className={`flex-1 py-2 px-4 rounded-md font-medium transition ${filter === 'expense'
                        ? 'bg-red-600 text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                >
                    Expenses ({expenseCategories.length})
                </button>
                <button
                    onClick={() => setFilter('income')}
                    className={`flex-1 py-2 px-4 rounded-md font-medium transition ${filter === 'income'
                        ? 'bg-green-600 text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                >
                    Income ({incomeCategories.length})
                </button>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            )}

            {/* Empty State */}
            {!loading && categories.length === 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 sm:p-12 text-center border border-gray-200 dark:border-gray-700">
                    <div className="text-6xl mb-4">📁</div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">No Categories Yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Get started by initializing default categories</p>
                    <button
                        onClick={handleInitialize}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-200 font-semibold"
                    >
                        Initialize Default Categories
                    </button>
                </div>
            )}

            {/* Categories Grid */}
            {!loading && categories.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {categories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                            onEdit={handleEditCategory}
                            onDelete={handleDeleteClick}
                        />
                    ))}
                </div>
            )}

            {/* Category Modal */}
            {showModal && (
                <CategoryModal
                    category={editingCategory}
                    onClose={() => setShowModal(false)}
                    onSubmit={handleModalSubmit}
                />
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={showDeleteConfirm}
                title="Delete Category"
                message={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
            />

        </div>
    );
}
