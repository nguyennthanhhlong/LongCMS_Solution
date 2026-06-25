import api from './api';

export const productService = {
    getAllProducts: async (params) => {
        const response = await api.get('/Products', { params });
        return response.data;
    },
    getProductsByCategory: async (categoryId, params) => {
        const response = await api.get(`/Products/categoryproduct/${categoryId}`, { params });
        return response.data;
    },
    getProductById: async (id) => {
        const response = await api.get(`/Products/${id}`);
        return response.data;
    },
    getCategories: async () => {
        const response = await api.get('/CategoriesProducts');
        return response.data;
    },
    getNewestProducts: async () => {
        const response = await api.get('/Products/newest');
        return response.data;
    },
    getHotProducts: async () => {
        const response = await api.get('/Products/hot');
        return response.data;
    }
};