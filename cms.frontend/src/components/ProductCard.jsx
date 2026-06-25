import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, Eye, Heart } from 'lucide-react';
import { getImageUrl } from '../lib/utils';
import toast from 'react-hot-toast';
import { useWishlist } from '../hooks/useWishlist';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { cart, addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useWishlist();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const currentCartItem = cart.find(item => item.id === product.id);
  const currentCartQuantity = currentCartItem ? currentCartItem.quantity : 0;
  const availableQuantity = product.stockQuantity - currentCartQuantity;

  const handleBuyNow = (e) => {
    e.preventDefault(); // Ngăn Link bao ngoài (nếu có)
    if (availableQuantity > 0) {
      addToCart(product, 1);
      toast.success(`Đã thêm ${product.name} vào giỏ hàng!`);
      // Optionally navigate, or just let them stay. Let's just toast and stay to allow multiple adds
      // navigate('/cart');
    }
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group border border-gray-100/50 rounded-2xl bg-white">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-50 rounded-t-2xl">
        <Link to={`/product/${product.id}`}>
          <img 
            src={getImageUrl(product.imageUrl)} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/300x400?text=No+Image'; }}
          />
        </Link>

        {/* Wishlist Button */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors z-10"
        >
          <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>

        {availableQuantity <= 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-sm">
            Hết hàng
          </div>
        )}
        {/* Nhãn Bán chạy (Tùy chọn) */}
        <div className="absolute top-2 left-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-r-sm shadow-sm hidden">
          Bán chạy
        </div>
      </div>
      
      <CardHeader className="p-4 pb-2 flex-1 text-center">
        <CardTitle className="text-sm font-semibold line-clamp-2 hover:text-primary transition-colors leading-snug h-10">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </CardTitle>
        <CardDescription className="text-primary font-black text-lg mt-1">
          {formatPrice(product.price)}
        </CardDescription>
      </CardHeader>

      <CardFooter className="p-4 pt-0 gap-2 flex-row">
        <Link to={`/product/${product.id}`} className="flex-1">
          <Button 
            variant="outline" 
            className="w-full h-10 text-xs font-bold text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-primary rounded-xl flex items-center justify-center transition-all"
          >
            <Eye className="w-4 h-4 mr-1" /> Chi tiết
          </Button>
        </Link>
        <Button 
          onClick={handleBuyNow}
          className="flex-1 h-10 text-xs font-bold bg-primary hover:bg-orange-600 text-white rounded-xl flex items-center justify-center border-none shadow-md shadow-primary/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
          disabled={availableQuantity <= 0}
        >
          <ShoppingCart className="w-4 h-4 mr-1" /> Mua ngay
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
