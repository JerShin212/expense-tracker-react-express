import api from './api.js';

// Get all transactions
export const getTransactions = async (params = {}) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `/transactions?${queryString}` : '/transactions';
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch transactions' };
    }
};

// Get single transaction
export const getTransaction = async (id) => {
    try {
        const response = await api.get(`/transactions/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch transaction' };
    }
};

// Create new transaction
export const createTransaction = async (transactionData) => {
    try {
        const response = await api.post('/transactions', transactionData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to create transaction' };
    }
};

// Update transaction
export const updateTransaction = async (id, transactionData) => {
    try {
        const response = await api.put(`/transactions/${id}`, transactionData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to update transaction' };
    }
};

// Delete transaction
export const deleteTransaction = async (id) => {
    try {
        const response = await api.delete(`/transactions/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to delete transaction' };
    }
};

// Get transaction summary
export const getTransactionSummary = async (params = {}) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `/transactions/summary?${queryString}` : '/transactions/summary';
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch summary' };
    }
};