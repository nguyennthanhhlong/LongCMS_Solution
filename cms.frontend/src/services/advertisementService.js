import api from './api';

export const advertisementService = {
    getActiveAdvertisements: async () => {
        try {
            const response = await api.get('/Advertisements');
            return response.data;
        } catch (error) {
            console.error('Lỗi khi tải quảng cáo:', error);
            throw error;
        }
    }
};
