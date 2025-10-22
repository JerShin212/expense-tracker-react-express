import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const testApi = async () => {
    try {
        const response = await api.get('/test');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export default api;