import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { getImageUrl } from '../../lib/utils';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useContext(CartContext);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Giỏ hàng của bạn đang trống</h2>
        <p className="text-muted-foreground mb-8">Bạn chưa thêm bất kỳ sản phẩm nào vào giỏ hàng.</p>
        <Link to="/shop">
          <Button size="lg">Tiếp tục mua sắm</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cột danh sách sản phẩm (70%) */}
        <div className="w-full lg:w-2/3">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b text-sm uppercase text-gray-500">
                      <th className="p-4 font-medium">Sản phẩm</th>
                      <th className="p-4 font-medium">Đơn giá</th>
                      <th className="p-4 font-medium text-center">Số lượng</th>
                      <th className="p-4 font-medium text-right">Thành tiền</th>
                      <th className="p-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map(item => (
                      <tr key={item.id} className="border-b hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 flex items-center gap-4">
                          <img 
                            src={getImageUrl(item.imageUrl)} 
                            alt={item.name} 
                            className="w-20 h-24 object-cover rounded-md border"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/80'; }}
                          />
                          <div>
                            <Link to={`/product/${item.id}`} className="font-semibold text-gray-900 hover:text-primary transition-colors line-clamp-2">
                              {item.name}
                            </Link>
                            <p className="text-sm text-muted-foreground mt-1">Còn {item.stockQuantity} SP trong kho</p>
                          </div>
                        </td>
                        <td className="p-4 font-medium">{formatPrice(item.price)}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-center border rounded-md w-max mx-auto bg-white">
                            <button 
                              className="px-3 py-1 hover:bg-gray-100 transition-colors disabled:opacity-50"
                              onClick={() => updateQuantity(item.id, -1)}
                              disabled={item.quantity <= 1}
                            >-</button>
                            <span className="w-10 text-center font-medium">{item.quantity}</span>
                            <button 
                              className="px-3 py-1 hover:bg-gray-100 transition-colors disabled:opacity-50"
                              onClick={() => updateQuantity(item.id, 1)}
                              disabled={item.quantity >= item.stockQuantity}
                            >+</button>
                          </div>
                        </td>
                        <td className="p-4 text-right font-bold text-primary">
                          {formatPrice(item.price * item.quantity)}
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-destructive transition-colors p-2 rounded-full hover:bg-red-50"
                            title="Xóa sản phẩm"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cột tổng tiền (30%) */}
          <div className="lg:col-span-1">
            <Card className="rounded-2xl border-none shadow-lg sticky top-24 bg-white overflow-hidden">
              <div className="bg-gray-50 border-b p-6">
                <h3 className="text-xl font-bold text-gray-900 uppercase">Tóm tắt đơn hàng</h3>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính ({cart.length} món)</span>
                    <span className="font-medium text-gray-900">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Phí giao hàng</span>
                    <span className="font-medium text-green-600">Miễn phí</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
                    <span className="text-2xl font-black text-primary">{formatPrice(cartTotal)}</span>
                  </div>
                </div>

                <Link to="/checkout" className="block">
                  <Button className="w-full h-14 text-lg font-bold bg-primary hover:bg-orange-600 text-white rounded-2xl flex items-center justify-center border-none shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]">
                    TIẾN HÀNH THANH TOÁN <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              
              <Link to="/shop" className="w-full block mt-4 text-center text-sm text-muted-foreground hover:text-primary transition-colors">
                ← Tiếp tục mua sắm
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
