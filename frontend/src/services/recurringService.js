import api from "./api.js";

// Get all recurring transactions
export const getRecurringTransactions = async () => {
    const response = await api.get('/recurring');
    return response.data;
};

// Get upcoming recurring transactions
export const getUpcomingRecurring = async (params = {}) => {
    const response = await api.get('/recurring/upcoming', { params });
    return response.data;
};

// Create recurring transaction
export const createRecurringTransaction = async (data) => {
    const response = await api.post('/recurring', data);
    return response.data;
};

// Update recurring transaction
export const updateRecurringTransaction = async (id, data) => {
    const response = await api.put(`/recurring/${id}`, data);
    return response.data;
};

// Delete recurring transaction
export const deleteRecurringTransaction = async (id) => {
    const response = await api.delete(`/recurring/${id}`);
    return response.data;
};

// Generate all due recurring transactions
export const generateRecurringTransactions = async () => {
    const response = await api.post('/recurring/generate');
    return response.data;
};

// Generate single recurring transaction
export const generateSingleRecurring = async (id) => {
    const response = await api.post(`/recurring/${id}/generate`);
    return response.data;
};