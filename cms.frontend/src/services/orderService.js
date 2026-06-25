import api from './api';

export const orderService = {
    createOrder: async (orderData) => {
        const response = await api.post('/Orders', orderData);
        return response.data;
    },
    getAllOrders: async () => {
        const response = await api.get('/Orders');
        return response.data;
    },
    getOrderDetails: async (orderId) => {
        const response = await api.get(`/OrderDetails/Order/${orderId}`);
        return response.data;
    }
};
