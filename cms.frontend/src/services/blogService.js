import api from './api';

export const blogService = {
    getAllPosts: async (params) => {
        const response = await api.get('/Posts', { params });
        return response.data;
    },
    getPostsByCategory: async (categoryId, params) => {
        const response = await api.get(`/Posts/category/${categoryId}`, { params });
        return response.data;
    },
    getPostById: async (id) => {
        const response = await api.get(`/Posts/${id}`);
        return response.data;
    },
    getCategories: async () => {
        const response = await api.get('/Categories');
        return response.data;
    }
};