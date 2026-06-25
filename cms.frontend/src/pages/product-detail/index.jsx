import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { CartContext } from '../../context/CartContext';
import { Button } from '../../components/ui/button';
import { ArrowLeft, ShoppingCart, AlertCircle, Heart, Loader2, Star } from 'lucide-react';
import { getImageUrl } from '../../lib/utils';
import ProductCard from '../../components/ProductCard';
import SkeletonProductCard from '../../components/SkeletonProductCard';
import toast from 'react-hot-toast';
import { useWishlist } from '../../hooks/useWishlist';
import { useReviews } from '../../hooks/useReviews';

const ProductDetail = () => {
  const { id } = useParams();
  const { cart, addToCart } = useContext(CartContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const { reviews, addReview } = useReviews(id);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const customer = JSON.parse(localStorage.getItem('customer'));

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductById(id);
        setProduct(data);

        // Fetch related products
        try {
          let related = [];
          if (data.categoryProductId) {
            const res = await productService.getProductsByCategory(data.categoryProductId);
            related = res.data || [];
          } else {
            const res = await productService.getAllProducts();
            related = res.data || [];
          }
          setRelatedProducts(related.filter(p => String(p.id) !== String(id)).slice(0, 4));
        } catch (relatedErr) {
          console.error("Không thể tải sản phẩm liên quan:", relatedErr);
        }

      } catch (err) {
        console.error(err);
        setError('Không tìm thấy sản phẩm.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    setError('');

    // Tính tổng số lượng nếu thêm vào giỏ
    const currentCartItem = cart.find(item => item.id === product.id);
    const currentCartQuantity = currentCartItem ? currentCartItem.quantity : 0;

    if (currentCartQuantity + quantity > product.stockQuantity) {
      if (currentCartQuantity > 0) {
        setError(`Bạn đã có ${currentCartQuantity} sản phẩm trong giỏ. Số lượng kho chỉ còn ${product.stockQuantity}.`);
      } else {
        setError(`Số lượng trong kho không đủ! Chỉ còn ${product.stockQuantity} sản phẩm.`);
      }
      return;
    }

    if (quantity < 1) {
      setError('Số lượng phải lớn hơn 0.');
      return;
    }

    addToCart(product, quantity);
    toast.success(`Đã thêm ${quantity} ${product.name} vào giỏ hàng!`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
            <div className="aspect-square bg-gray-200 rounded-3xl"></div>
            <div className="space-y-6 pt-4">
              <div className="h-10 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-24 bg-gray-200 rounded w-full"></div>
              <div className="h-12 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-destructive mb-4">{error}</h2>
        <Link to="/shop">
          <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2"/> Quay lại cửa hàng</Button>
        </Link>
      </div>
    );
  }

  const currentCartItem = cart.find(item => item.id === product.id);
  const currentCartQuantity = currentCartItem ? currentCartItem.quantity : 0;
  const availableQuantity = product.stockQuantity - currentCartQuantity;

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 md:p-10 rounded-2xl shadow-sm border">
      <Link to="/shop" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors font-medium">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Tiếp tục mua sắm
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Cột ảnh sản phẩm */}
        <div className="rounded-xl overflow-hidden bg-gray-100 aspect-[3/4] shadow-md">
          <img 
            src={getImageUrl(product.imageUrl)} 
            alt={product.name} 
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/600x800?text=No+Image'; }}
          />
        </div>

        {/* Cột thông tin */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{product.name}</h1>
          <div className="text-3xl font-bold text-primary mb-6">
            {formatPrice(product.price)}
          </div>
          
          <div className="prose text-gray-600 mb-8">
            <p>{product.description}</p>
            {/* Nếu backend có product.description thì thay thế bằng product.description */}
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium text-gray-700">Tình trạng:</span>
              {availableQuantity > 0 ? (
                <span className="text-green-600 font-semibold px-3 py-1 bg-green-100 rounded-full text-sm">Còn {availableQuantity} sản phẩm</span>
              ) : (
                <span className="text-destructive font-semibold px-3 py-1 bg-red-100 rounded-full text-sm">Hết hàng</span>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="font-medium text-gray-700">Số lượng:</span>
              <div className="flex items-center border border-gray-300 rounded-full overflow-hidden w-max bg-white shadow-sm">
                <button 
                  className="px-4 py-2 hover:bg-orange-50 hover:text-primary font-bold transition-colors"
                  onClick={() => { setQuantity(Math.max(1, quantity - 1)); setError(''); }}
                  disabled={availableQuantity <= 0}
                >-</button>
                <input 
                  type="number" 
                  className="w-16 text-center py-2 outline-none font-bold text-gray-800"
                  value={quantity}
                  onChange={(e) => { setQuantity(Number(e.target.value)); setError(''); }}
                  disabled={availableQuantity <= 0}
                  min="1"
                  max={availableQuantity}
                />
                <button 
                  className="px-4 py-2 hover:bg-orange-50 hover:text-primary font-bold transition-colors"
                  onClick={() => { setQuantity(quantity + 1); setError(''); }}
                  disabled={quantity >= availableQuantity}
                >+</button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg flex items-center text-sm font-medium">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <Button 
              className="flex-1 h-14 text-lg font-bold bg-primary hover:bg-orange-600 text-white rounded-2xl flex items-center justify-center border-none shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
              onClick={handleAddToCart}
              disabled={!!error || product.stockQuantity === 0}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {availableQuantity <= 0 ? 'ĐÃ HẾT HÀNG' : 'THÊM VÀO GIỎ HÀNG'}
            </Button>
            
            <button 
              onClick={() => toggleWishlist(product)}
              className={`w-14 h-14 flex items-center justify-center rounded-2xl border-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${isInWishlist(product.id) ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500'}`}
            >
              <Heart className={`w-6 h-6 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Chính sách hỗ trợ */}
          <div className="mt-8 pt-8 border-t grid grid-cols-2 gap-4 text-sm text-gray-500">
            <div className="flex items-center"><svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg> Giao hàng toàn quốc</div>
            <div className="flex items-center"><svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg> Đổi trả 7 ngày</div>
            <div className="flex items-center"><svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg> Thanh toán an toàn</div>
            <div className="flex items-center"><svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg> Hỗ trợ 24/7</div>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="container mx-auto px-4 py-8 max-w-6xl mt-8 border-t border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
          <Star className="w-6 h-6 mr-2 text-yellow-500 fill-yellow-500" /> Đánh giá sản phẩm ({reviews.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-1 bg-gray-50 p-6 rounded-3xl h-fit">
            <h3 className="font-bold text-gray-800 mb-4">Gửi đánh giá của bạn</h3>
            {!customer ? (
              <div className="text-sm text-gray-500 mb-4">
                Vui lòng <a href="/login" className="text-primary font-bold hover:underline">Đăng nhập</a> để viết đánh giá.
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Chất lượng món ăn</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star 
                        key={star} 
                        className={`w-8 h-8 cursor-pointer transition-colors ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                        onClick={() => setRating(star)}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Bình luận</label>
                  <textarea 
                    className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:border-primary outline-none resize-none"
                    rows="3"
                    placeholder="Món ăn này có ngon không? Chia sẻ cảm nhận của bạn nhé..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
                <Button 
                  className="w-full bg-gray-900 text-white rounded-xl font-bold"
                  onClick={() => {
                    if(addReview(rating, comment)) {
                      setComment('');
                      setRating(5);
                    }
                  }}
                >
                  GỬI ĐÁNH GIÁ
                </Button>
              </div>
            )}
          </div>

          <div className="md:col-span-2 space-y-6">
            {reviews.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-500">Chưa có đánh giá nào cho món ăn này. Hãy là người đầu tiên!</p>
              </div>
            ) : (
              reviews.map(review => (
                <div key={review.id} className="border-b border-gray-100 pb-6 mb-6 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold text-gray-900">{review.customerName}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(review.date).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                  <div className="flex space-x-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-200'}`} />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Sản Phẩm Liên Quan */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 pt-12 border-t border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 uppercase text-center tracking-wide">
            Sản Phẩm <span className="text-primary">Gợi Ý</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(item => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
