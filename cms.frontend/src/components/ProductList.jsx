import React, { useState, useEffect } from 'react';
import productService from '../services/productService';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productService.getAllProducts();
                setProducts(data);
            } catch (error) {
                console.error("Lỗi tải sản phẩm:", error);
            } finally { setLoading(false); }
        };
        fetchProducts();
    }, []);

    if (loading) return <div className="text-center my-4">Đang tải bộ sưu tập thời trang...</div>;

    return (
        <div className="row">
            {products.map((item) => (
                <div className="col-md-6 mb-4" key={item.id}>
                    <div className="card h-100 shadow-sm border-0">
                        <img src={item.imageUrl || 'https://via.placeholder.com/300'} className="card-img-top" style={{ height: '250px', objectFit: 'cover' }} alt="product" />
                        <div className="card-body">
                            <h5 className="font-weight-bold text-dark mb-2">{item.name}</h5>
                            <p className="text-danger font-weight-bold mb-1">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                            </p>
                            <small className="text-muted">Kho còn: {item.stockQuantity} sản phẩm</small>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
export default ProductList;