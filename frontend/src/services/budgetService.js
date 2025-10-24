import api from "./api.js";

// Get all budgets
export const getBudgets = async () => {
    const response = await api.get('/budgets');
    return response.data;
};

// Get budget status with spending comparison
export const getBudgetStatus = async (params = {}) => {
    const response = await api.get('/budgets/status', { params });
    return response.data;
};

// Create budget
export const createBudget = async (budgetData) => {
    const response = await api.post('/budgets', budgetData);
    return response.data;
};

// Update budget
export const updateBudget = async (id, budgetData) => {
    const response = await api.put(`/budgets/${id}`, budgetData);
    return response.data;
};

// Delete budget
export const deleteBudget = async (id) => {
    const response = await api.delete(`/budgets/${id}`);
    return response.data;
};