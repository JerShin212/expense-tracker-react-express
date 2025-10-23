import api from "./api.js";

export const getCategories = async (type = null) => {
    try {
        const url = type ? `/categories?type=${type}` : '/categories';
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch categories' };
    }
};

export const getCategory = async (id) => {
    try {
        const response = await api.get(`/categories/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch category' };
    }
};

export const initializeCategories = async () => {
    try {
        const response = await api.post('/categories/initialize');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to initialize categories' };
    }
};

export const createCategory = async (categoryData) => {
    try {
        const response = await api.post('/categories', categoryData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to create category' };
    }
};

export const updateCategory = async (id, categoryData) => {
    try {
        const response = await api.put(`/categories/${id}`, categoryData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to update category' };
    }
};

export const deleteCategory = async (id) => {
    try {
        const response = await api.delete(`/categories/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to delete category' };
    }
};