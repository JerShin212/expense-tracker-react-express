import api from './api';

// Get summary statistics
export const getSummary = async (params = {}) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `/analytics/summary?${queryString}` : '/analytics/summary';
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch summary' };
    }
};

// Get category breakdown
export const getCategoryBreakdown = async (params = {}) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `/analytics/category-breakdown?${queryString}` : '/analytics/category-breakdown';
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch category breakdown' };
    }
};

// Get monthly trends
export const getMonthlyTrends = async (params = {}) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `/analytics/monthly-trends?${queryString}` : '/analytics/monthly-trends';
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch monthly trends' };
    }
};

// Get recent transactions
export const getRecentTransactions = async (params = {}) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `/analytics/recent-transactions?${queryString}` : '/analytics/recent-transactions';
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch recent transactions' };
    }
};

// Get top categories
export const getTopCategories = async (params = {}) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `/analytics/top-categories?${queryString}` : '/analytics/top-categories';
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch top categories' };
    }
};

// Get daily pattern
export const getDailyPattern = async (params = {}) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `/analytics/daily-pattern?${queryString}` : '/analytics/daily-pattern';
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch daily pattern' };
    }
};

// Get comparison data
export const getComparison = async (params = {}) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `/analytics/comparison?${queryString}` : '/analytics/comparison';
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch comparison' };
    }
};