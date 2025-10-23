import { useState, useEffect } from 'react';
import { getSettings, updateSettings, getCurrencies } from '../services/settingsService';
import { useAuth } from '../context/AuthContext';

function Settings() {
    const { user, login } = useAuth();
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
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Settings</h1>
                <p className="text-gray-600 mt-1">Manage your account preferences</p>
            </div>

            {/* Success Message */}
            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                    {success}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Settings Form */}
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Account Information Section */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                            Account Information
                        </h2>

                        {/* Email (Read-only) */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                        </div>

                        {/* First Name */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    maxLength={50}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                    placeholder="John"
                                />
                            </div>

                            {/* Last Name */}
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    maxLength={50}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Currency Section */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                            Regional Settings
                        </h2>

                        <div>
                            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                                Preferred Currency
                            </label>
                            <select
                                id="currency"
                                name="currency"
                                value={formData.currency}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition bg-white"
                            >
                                {currencies.map((currency) => (
                                    <option key={currency.code} value={currency.code}>
                                        {currency.flag} {currency.name} ({currency.symbol})
                                    </option>
                                ))}
                            </select>

                            {/* Currency Preview */}
                            {selectedCurrency && (
                                <div className="mt-3 p-3 bg-indigo-50 rounded-lg">
                                    <p className="text-sm text-gray-700">
                                        <span className="font-medium">Preview:</span> All amounts will be displayed as{' '}
                                        <span className="font-semibold text-indigo-600">
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
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Popular Currencies
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {currencies.slice(0, 8).map((currency) => (
                        <div
                            key={currency.code}
                            className="p-3 border border-gray-200 rounded-lg hover:border-indigo-300 transition"
                        >
                            <div className="text-2xl mb-1">{currency.flag}</div>
                            <div className="text-sm font-medium text-gray-800">{currency.code}</div>
                            <div className="text-xs text-gray-500">{currency.symbol}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Settings;