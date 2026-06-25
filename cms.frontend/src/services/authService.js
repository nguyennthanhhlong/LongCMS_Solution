import api from './api';

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/Customers/login', { email, password });
        return response.data;
    },
    register: async (customerData) => {
        const response = await api.post('/Customers', customerData);
        return response.data;
    },
    changePassword: async (email, oldPassword, newPassword) => {
        const response = await api.post('/Customers/change-password', { email, oldPassword, newPassword });
        return response.data;
    },
    forgotPassword: async (email) => {
        const response = await api.post('/Customers/forgot-password', { email });
        return response.data;
    }
};
