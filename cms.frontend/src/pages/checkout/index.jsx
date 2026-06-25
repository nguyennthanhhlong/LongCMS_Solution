import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { orderService } from '../../services/orderService';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { AlertCircle, CheckCircle2, CreditCard, Banknote, Loader2 } from 'lucide-react';
import { getImageUrl } from '../../lib/utils';
import toast from 'react-hot-toast';


const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useContext(CartContext);
  
  const [customer, setCustomer] = useState(null);
  const [shippingInfo, setShippingInfo] = useState({ fullName: '', phone: '', address: '', email: '' });
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [cardInfo, setCardInfo] = useState({ number: '', expiry: '', cvc: '', name: '' });
  const [paymentStatus, setPaymentStatus] = useState('');
  
  const [voucherCode, setVoucherCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    // 1. Luồng bảo mật: Kiểm tra nếu chưa đăng nhập thì đá về /login
    const savedCustomer = localStorage.getItem('customer');
    if (!savedCustomer) {
      navigate('/login');
    } else {
      const parsedCustomer = JSON.parse(savedCustomer);
      setCustomer(parsedCustomer);
      setShippingInfo({
        fullName: parsedCustomer.fullName || '',
        phone: parsedCustomer.phone || '',
        address: parsedCustomer.address || '',
        email: parsedCustomer.email || ''
      });
    }

    // 2. Nếu giỏ hàng trống mà truy cập /checkout -> về shop
    if (cart.length === 0 && !success) {
      navigate('/shop');
    }
  }, [navigate, cart.length, success]);

  const handleCheckout = async () => {
    setError('');

    if (!shippingInfo.fullName.trim() || !shippingInfo.phone.trim() || !shippingInfo.address.trim()) {
      setError('Vui lòng điền đầy đủ Họ và tên, Số điện thoại và Địa chỉ giao hàng.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (paymentMethod === 'online') {
      if (!cardInfo.number || !cardInfo.expiry || !cardInfo.cvc || !cardInfo.name) {
        setError('Vui lòng nhập đầy đủ thông tin thẻ tín dụng để thanh toán trực tuyến.');
        return;
      }
      if (cardInfo.number.length < 16) {
        setError('Số thẻ không hợp lệ (cần 16 số).');
        return;
      }
      setLoading(true);
      setPaymentStatus('Đang kết nối cổng thanh toán...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      setPaymentStatus('Đang xác thực giao dịch...');
      await new Promise(resolve => setTimeout(resolve, 1500));
    } else {
      setLoading(true);
    }

    try {
      // Chuẩn bị dữ liệu gửi đi (OrderInputDTO)
      const orderDetails = cart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        unitPrice: item.price
      }));

      let finalNotes = `[${paymentMethod === 'online' ? 'Đã thanh toán Online (Stripe)' : 'Thanh toán COD'}] `;
      if (discountAmount > 0) {
        finalNotes += `[Voucher: -${formatPrice(discountAmount)}] `;
      }
      finalNotes += `[Người nhận: ${shippingInfo.fullName} - ${shippingInfo.phone} - ${shippingInfo.address}] `;
      if (notes) finalNotes += `[Ghi chú: ${notes}]`;

      const orderData = {
        customerId: customer.id,
        notes: finalNotes,
        orderDetails: orderDetails
      };

      await orderService.createOrder(orderData);
      
      // Xóa giỏ hàng
      clearCart();
      setSuccess(true);
      
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
      setPaymentStatus('');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleApplyVoucher = () => {
    const code = voucherCode.trim().toUpperCase();
    if (!code) return;
    
    if (code === 'FASTFOOD20') {
      const discount = cartTotal * 0.2;
      setDiscountAmount(discount);
      toast.success('Đã áp dụng mã giảm giá 20%!');
    } else if (code === 'GIAM50K') {
      if (cartTotal < 50000) {
        toast.error('Đơn hàng không đủ điều kiện (Phải > 50K)');
        return;
      }
      setDiscountAmount(50000);
      toast.success('Đã áp dụng mã giảm 50.000đ!');
    } else {
      setDiscountAmount(0);
      toast.error('Mã giảm giá không hợp lệ hoặc đã hết hạn.');
    }
  };

  const finalTotal = Math.max(0, cartTotal - discountAmount);

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-lg mx-auto">
        <CheckCircle2 className="w-24 h-24 text-green-500 mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Đặt hàng thành công!</h1>
        <p className="text-gray-600 mb-8 text-lg">
          Cảm ơn bạn đã đặt hàng tại FastFoodWorld. Đơn hàng của bạn đang được chế biến và sẽ được giao đến bạn trong thời gian sớm nhất.
        </p>
        <div className="flex gap-4 w-full">
          <Link to="/shop" className="flex-1">
            <Button variant="outline" className="w-full">Tiếp tục đặt món</Button>
          </Link>
          <Link to="/blog" className="flex-1">
            <Button className="w-full">Xem bài viết review ẩm thực</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!customer) return null; // Tránh flash lỗi khi đang redirect

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Thanh toán & Đặt hàng</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Thông tin giao hàng */}
        <div className="w-full lg:w-2/3 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-lg flex items-center font-medium">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              {error}
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Thông tin người nhận</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Họ và tên <span className="text-red-500">*</span></label>
                  <Input type="text" value={shippingInfo.fullName} onChange={e => setShippingInfo({...shippingInfo, fullName: e.target.value})} placeholder="Nhập họ và tên người nhận" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Số điện thoại <span className="text-red-500">*</span></label>
                  <Input type="text" value={shippingInfo.phone} onChange={e => setShippingInfo({...shippingInfo, phone: e.target.value})} placeholder="Nhập số điện thoại liên hệ" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Email</label>
                <Input type="email" value={shippingInfo.email} readOnly className="bg-gray-50" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Địa chỉ giao hàng <span className="text-red-500">*</span></label>
                <Input type="text" value={shippingInfo.address} onChange={e => setShippingInfo({...shippingInfo, address: e.target.value})} placeholder="Nhập địa chỉ nhận hàng chi tiết" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Ghi chú đơn hàng (Tùy chọn)</label>
                <textarea 
                  className="w-full border border-input rounded-md p-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                  rows="3"
                  placeholder="Giao hàng vào giờ hành chính, gọi trước khi giao..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Phương thức thanh toán</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}`}
                onClick={() => setPaymentMethod('cod')}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${paymentMethod === 'cod' ? 'border-primary' : 'border-gray-300'}`}>
                    {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                  </div>
                  <Banknote className="w-6 h-6 mr-3 text-green-600" />
                  <span className="font-medium text-gray-900">Thanh toán khi nhận hàng (COD)</span>
                </div>
              </div>

              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'online' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}`}
                onClick={() => setPaymentMethod('online')}
              >
                <div className="flex items-center mb-2">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${paymentMethod === 'online' ? 'border-primary' : 'border-gray-300'}`}>
                    {paymentMethod === 'online' && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                  </div>
                  <CreditCard className="w-6 h-6 mr-3 text-blue-600" />
                  <span className="font-medium text-gray-900">Thanh toán trực tuyến (Thẻ tín dụng)</span>
                </div>
                
                {paymentMethod === 'online' && (
                  <div className="mt-4 pl-8 pr-2" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-5">
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Tên in trên thẻ</label>
                        <input 
                          type="text" 
                          placeholder="NGUYEN VAN A"
                          className="w-full border-b-2 border-gray-200 focus:border-primary outline-none py-1.5 text-sm uppercase bg-transparent transition-colors"
                          value={cardInfo.name}
                          onChange={(e) => setCardInfo({...cardInfo, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Số thẻ (Stripe Test Card: 4242...)</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            placeholder="4242 4242 4242 4242"
                            className="w-full border-b-2 border-gray-200 focus:border-primary outline-none py-1.5 text-base tracking-widest font-mono bg-transparent transition-colors"
                            value={cardInfo.number}
                            onChange={(e) => setCardInfo({...cardInfo, number: e.target.value.replace(/\D/g, '').substring(0, 16)})}
                          />
                          <svg viewBox="0 0 60 25" xmlns="http://www.w3.org/2000/svg" className="absolute right-0 top-1.5 w-10 opacity-70">
                            <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12-.87V5.57h4.11v2.15c.56-.5 1.48-1.05 2.82-1.05 3.2 0 5.37 2.58 5.37 6.84 0 4.36-2.34 6.8-5.26 6.8zm-1.47-5.85c0-2.91-1.31-3.66-2.21-3.66-.9 0-2.15.65-2.15 3.59v.86c0 2.82 1.22 3.4 2.11 3.4.92 0 2.25-.66 2.25-4.19zM27.92 17.69c-1.38.69-3.27 1.11-4.81 1.11-4.12 0-5.3-2.12-5.3-5.31V8.04H14.9V4.67l2.91-1.3.8-2.95h3.45v2.9h3.81v3.71h-3.81v4.73c0 1.22.25 1.54 1.2 1.54.53 0 1.08-.18 1.46-.35l3.2 4.74zM10.42 5.57l-.02 14.5-4.12-.86V5.57h4.14zm-2.06-4.5c1.32 0 2.39 1.06 2.39 2.36 0 1.33-1.07 2.4-2.39 2.4-1.33 0-2.4-1.07-2.4-2.4 0-1.3.1-2.36 2.4-2.36zM34.56 5.57l-.02 14.5-4.12-.86V5.57h4.14zM2.71 19.28c-2.02-.95-2.91-1.92-2.91-3.6 0-2.12 1.83-3.06 4.14-3.06 1.7 0 2.92.5 3.84 1.02l-1.03 3.12c-.75-.4-1.83-.84-2.84-.84-1.2 0-1.8.44-1.8 1 0 .61.56.9 1.63 1.26 2.6.86 4.05 1.95 4.05 3.98 0 2.5-1.93 3.32-4.52 3.32-1.91 0-3.41-.53-4.52-1.22l1.1-3.21c.88.55 2.16 1.14 3.47 1.14 1.48 0 2.11-.53 2.11-1.12 0-.6-.5-1.04-2.72-1.8z" fill="#635BFF" />
                          </svg>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Ngày hết hạn</label>
                          <input 
                            type="text" 
                            placeholder="MM/YY"
                            className="w-full border-b-2 border-gray-200 focus:border-primary outline-none py-1.5 text-base font-mono tracking-widest bg-transparent transition-colors"
                            value={cardInfo.expiry}
                            onChange={(e) => {
                                let val = e.target.value.replace(/\D/g, '').substring(0, 4);
                                if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2, 4);
                                setCardInfo({...cardInfo, expiry: val})
                            }}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">CVC</label>
                          <input 
                            type="password" 
                            placeholder="•••"
                            className="w-full border-b-2 border-gray-200 focus:border-primary outline-none py-1.5 text-base font-mono tracking-widest bg-transparent transition-colors"
                            value={cardInfo.cvc}
                            onChange={(e) => setCardInfo({...cardInfo, cvc: e.target.value.replace(/\D/g, '').substring(0, 3)})}
                          />
                        </div>
                      </div>
                      <div className="pt-2">
                        <p className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1.5 font-medium">
                          <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg>
                          Thanh toán an toàn, bảo mật bởi Stripe
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Voucher Code */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Mã giảm giá</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  placeholder="Nhập FASTFOOD20 hoặc GIAM50K..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 uppercase focus:border-primary outline-none"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  disabled={discountAmount > 0}
                />
                {discountAmount > 0 ? (
                  <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50" onClick={() => {setDiscountAmount(0); setVoucherCode('');}}>
                    Hủy mã
                  </Button>
                ) : (
                  <Button className="bg-gray-900 text-white hover:bg-gray-800" onClick={handleApplyVoucher}>
                    Áp dụng
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tóm tắt đơn hàng */}
        <div className="w-full lg:w-1/3">
          <Card className="sticky top-24 border-primary/20 shadow-md">
            <CardHeader className="bg-primary/5 border-b pb-4">
              <CardTitle className="text-lg">Tóm tắt đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[40vh] overflow-y-auto p-4 space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4 items-start">
                    <img 
                      src={getImageUrl(item.imageUrl)} 
                      alt={item.name} 
                      className="w-16 h-20 object-cover rounded border"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/64x80'; }}
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium line-clamp-2 leading-tight">{item.name}</h4>
                      <div className="text-muted-foreground text-xs mt-1">SL: {item.quantity}</div>
                      <div className="font-semibold text-primary mt-1">{formatPrice(item.price)}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-6 bg-gray-50 border-t">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between py-2 text-sm">
                    <span className="text-gray-600">Tổng tiền hàng</span>
                    <span className="font-semibold">{formatPrice(cartTotal)}</span>
                  </div>
                  
                  {discountAmount > 0 && (
                    <div className="flex justify-between py-2 text-sm text-green-600 font-medium">
                      <span>Mã giảm giá</span>
                      <span>- {formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between py-2 text-sm">
                    <span className="text-gray-600">Phí giao hàng</span>
                    <span className="font-semibold text-green-600">Miễn phí</span>
                  </div>

                  <div className="border-t pt-4 pb-4 flex justify-between items-center">
                    <span className="text-base font-bold text-gray-900">TỔNG THANH TOÁN</span>
                    <span className="text-2xl font-black text-primary">{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleCheckout} 
                  disabled={loading}
                  className="w-full h-14 text-lg font-bold shadow-lg flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" /> 
                      {paymentStatus || 'Đang xử lý...'}
                    </>
                  ) : (
                    paymentMethod === 'online' ? `THANH TOÁN ${formatPrice(finalTotal)}` : 'XÁC NHẬN ĐẶT HÀNG'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
