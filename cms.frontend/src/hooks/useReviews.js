import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const useReviews = (productId) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (productId) {
      const allReviews = JSON.parse(localStorage.getItem('product_reviews') || '{}');
      setReviews(allReviews[productId] || []);
    }
  }, [productId]);

  const addReview = (rating, comment) => {
    const customerStr = localStorage.getItem('customer');
    if (!customerStr) {
      toast.error('Vui lòng đăng nhập để đánh giá!');
      return false;
    }
    
    if (rating < 1 || rating > 5) {
      toast.error('Vui lòng chọn số sao!');
      return false;
    }

    if (!comment.trim()) {
      toast.error('Vui lòng nhập nội dung đánh giá!');
      return false;
    }

    const customer = JSON.parse(customerStr);
    const newReview = {
      id: Date.now().toString(),
      customerId: customer.id,
      customerName: customer.fullName || 'Khách hàng',
      rating,
      comment,
      date: new Date().toISOString()
    };

    const allReviews = JSON.parse(localStorage.getItem('product_reviews') || '{}');
    const productReviews = allReviews[productId] || [];
    productReviews.unshift(newReview); // Thêm lên đầu
    
    allReviews[productId] = productReviews;
    localStorage.setItem('product_reviews', JSON.stringify(allReviews));
    
    setReviews(productReviews);
    toast.success('Cảm ơn bạn đã đánh giá sản phẩm!');
    return true;
  };

  return { reviews, addReview };
};
