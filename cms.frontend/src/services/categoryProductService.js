import axiosClient from '../api/axiosClient';

const categoryProductService = {
    getAllCategoryProducts: () => {
        // Khớp chính xác với [Route("api/[controller]")] của CategoriesProductsController
        const url = '/CategoriesProducts';
        return axiosClient.get(url);
    }
};

export default categoryProductService;