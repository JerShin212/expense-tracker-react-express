import api from './api.js'

// Get user settings
export const getSettings = async () => {
    try {
        const response = await api.get('/settings');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch settings' };
    }
};

// Update user settings
export const updateSettings = async (settingsData) => {
    try {
        const response = await api.put('/settings', settingsData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to update settings' };
    }
};

// Get available currencies
export const getCurrencies = async () => {
    try {
        const response = await api.get('/settings/currencies');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch currencies' };
    }
};