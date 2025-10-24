import { useState, useEffect } from 'react';
import { getSettings, updateSettings, getCurrencies } from '../services/settingsService';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function Settings() {
    const { user, login } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        currency: 'USD'
    });
    const [currencies, setCurrencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [settingsData, currenciesData] = await Promise.all([
                getSettings(),
                getCurrencies()
            ]);

            setFormData({
                firstName: settingsData.data.firstName || '',
                lastName: settingsData.data.lastName || '',
                currency: settingsData.data.currency || 'USD'
            });

            setCurrencies(currenciesData.data || []);
        } catch (err) {
            setError(err.message || 'Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const result = await updateSettings(formData);
            setSuccess('Settings saved successfully!');

            // Update user in auth context
            const updatedUser = {
                ...user,
                firstName: result.data.firstName,
                lastName: result.data.lastName,
                currency: result.data.currency
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const selectedCurrency = currencies.find(c => c.code === formData.currency);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">Settings</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account preferences</p>
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

            {/* Dark Mode Toggle */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                    Appearance
                </h2>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                            {isDarkMode ? (
                                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            )}
                        </div>
                        <div>
                            <p className="font-medium text-gray-800 dark:text-gray-100">
                                {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {isDarkMode ? 'Easy on the eyes in low light' : 'Better visibility in daylight'}
                            </p>
                        </div>
                    </div>

                    {/* Toggle Switch */}
                    <button
                        onClick={toggleTheme}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isDarkMode ? 'bg-indigo-600' : 'bg-gray-300'
                            }`}
                    >
                        <span
                            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200 ${isDarkMode ? 'translate-x-7' : 'translate-x-1'
                                }`}
                        />
                    </button>
                </div>
            </div>

            {/* Settings Form */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Account Information Section */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                            Account Information
                        </h2>

                        {/* Email (Read-only) */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email cannot be changed</p>
                        </div>

                        {/* First Name */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    maxLength={50}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                    placeholder="John"
                                />
                            </div>

                            {/* Last Name */}
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    maxLength={50}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Currency Section */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                            Regional Settings
                        </h2>

                        <div>
                            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Preferred Currency
                            </label>
                            <select
                                id="currency"
                                name="currency"
                                value={formData.currency}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                            >
                                {currencies.map((currency) => (
                                    <option key={currency.code} value={currency.code}>
                                        {currency.flag} {currency.name} ({currency.symbol})
                                    </option>
                                ))}
                            </select>

                            {/* Currency Preview */}
                            {selectedCurrency && (
                                <div className="mt-3 p-3 bg-indigo-50 dark:bg-indigo-900/40 rounded-lg">
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        <span className="font-medium">Preview:</span> All amounts will be displayed as{' '}
                                        <span className="font-semibold text-indigo-600 dark:text-indigo-300">
                                            {selectedCurrency.symbol}1,234.56
                                        </span>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition duration-200 font-semibold disabled:bg-indigo-400 disabled:cursor-not-allowed"
                        >
                            {saving ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Popular Currencies Quick Reference */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                    Popular Currencies
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {currencies.slice(0, 8).map((currency) => (
                        <div
                            key={currency.code}
                            className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-indigo-300 dark:hover:border-indigo-500 transition"
                        >
                            <div className="text-2xl mb-1 dark:text-gray-100">{currency.flag}</div>
                            <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{currency.code}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{currency.symbol}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Settings;
