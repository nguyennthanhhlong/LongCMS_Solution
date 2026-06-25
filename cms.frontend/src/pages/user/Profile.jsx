import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { Package, User, MapPin, Phone, Mail, Clock, CheckCircle2, AlertCircle, ShoppingCart, LogOut, ChevronRight, Heart, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import ProductCard from '../../components/ProductCard';
import { useWishlist } from '../../hooks/useWishlist';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';
import { Input } from '../../components/ui/input';
import { getImageUrl } from '../../lib/utils';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState(false);
  const { wishlist } = useWishlist();

  // Password change state
  const [pwdData, setPwdData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [isChangingPwd, setIsChangingPwd] = useState(false);

  useEffect(() => {
    const storedCustomer = localStorage.getItem('customer');
    if (!storedCustomer) {
      navigate('/login');
      return;
    }
    const parsedCustomer = JSON.parse(storedCustomer);
    setCustomer(parsedCustomer);

    fetchMyOrders(parsedCustomer.id);
  }, [navigate]);

  const fetchMyOrders = async (customerId) => {
    try {
      setLoadingOrders(true);
      const allOrders = await orderService.getAllOrders();
      const myOrders = allOrders.filter(o => o.customerId === customerId);
      setOrders(myOrders);
    } catch (err) {
      console.error("Lỗi lấy danh sách đơn hàng:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleToggleOrderDetails = async (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      return;
    }
    
    setExpandedOrderId(orderId);
    
    if (!orderDetails[orderId]) {
      try {
        setLoadingDetails(true);
        const details = await orderService.getOrderDetails(orderId);
        setOrderDetails(prev => ({ ...prev, [orderId]: details }));
      } catch (err) {
        console.error("Lỗi lấy chi tiết đơn hàng:", err);
      } finally {
        setLoadingDetails(false);
      }
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwdData.newPassword !== pwdData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }
    if (pwdData.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    try {
      setIsChangingPwd(true);
      await authService.changePassword(customer.email, pwdData.oldPassword, pwdData.newPassword);
      toast.success('Cập nhật mật khẩu thành công');
      setPwdData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cập nhật thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại.');
    } finally {
      setIsChangingPwd(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('customer');
    navigate('/login');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const extractDiscount = (notes) => {
    if (!notes) return 0;
    const match = notes.match(/\[Voucher:\s*-(.*?)\]/);
    if (match) {
      const numberString = match[1].replace(/[^\d]/g, '');
      return parseInt(numberString, 10) || 0;
    }
    return 0;
  };

  const getOrderStatus = (status) => {
    switch (status) {
      case 0: return <span className="bg-orange-50 border border-orange-200 text-orange-600 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center w-fit"><Clock className="w-3 h-3 mr-1" /> Chờ duyệt</span>;
      case 1: return <span className="bg-blue-50 border border-blue-200 text-blue-600 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center w-fit"><Package className="w-3 h-3 mr-1" /> Đang xử lý</span>;
      case 2: return <span className="bg-green-50 border border-green-200 text-green-600 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center w-fit"><CheckCircle2 className="w-3 h-3 mr-1" /> Đã giao hàng</span>;
      case 3: return <span className="bg-red-50 border border-red-200 text-red-600 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center w-fit"><AlertCircle className="w-3 h-3 mr-1" /> Đã hủy</span>;
      default: return <span className="bg-gray-50 border border-gray-200 text-gray-600 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center w-fit"><AlertCircle className="w-3 h-3 mr-1" /> Không rõ</span>;
    }
  };

  if (!customer) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Menu */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <Card className="rounded-3xl border-none shadow-lg overflow-hidden bg-white">
              <div className="p-8 text-center bg-gradient-to-br from-orange-50 to-white border-b border-gray-100">
                <div className="w-24 h-24 mx-auto bg-primary text-white rounded-full flex items-center justify-center text-4xl font-black mb-4 shadow-xl shadow-primary/30">
                  {customer.fullName?.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-bold text-gray-900">{customer.fullName}</h2>
                <p className="text-sm text-gray-500 font-medium mt-1">Thành viên thân thiết</p>
              </div>
              
              <div className="p-4 space-y-2">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center px-4 py-3 rounded-2xl transition-all font-bold text-sm ${activeTab === 'profile' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <User className="w-5 h-5 mr-3" /> Thông tin tài khoản
                </button>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center px-4 py-3 rounded-2xl transition-all font-bold text-sm ${activeTab === 'orders' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Package className="w-5 h-5 mr-3" /> Lịch sử đơn hàng
                </button>
                <button 
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full flex items-center px-4 py-3 rounded-2xl transition-all font-bold text-sm ${activeTab === 'wishlist' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Heart className="w-5 h-5 mr-3" /> Danh sách yêu thích ({wishlist.length})
                </button>
                <hr className="my-2 border-gray-100" />
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 rounded-2xl transition-all font-bold text-sm text-red-500 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5 mr-3" /> Đăng xuất
                </button>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            
            {/* Tab: Thông tin cá nhân */}
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <Card className="rounded-3xl border-none shadow-lg bg-white overflow-hidden">
                  <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-2xl font-black text-gray-900">Thông tin cá nhân</h3>
                  </div>
                <CardContent className="p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Họ và tên</label>
                        <div className="flex items-center text-gray-900 font-bold bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-orange-50/20 transition-colors">
                          <User className="w-5 h-5 mr-3 text-primary" /> {customer.fullName}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Số điện thoại</label>
                        <div className="flex items-center text-gray-900 font-bold bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-orange-50/20 transition-colors">
                          <Phone className="w-5 h-5 mr-3 text-primary" /> {customer.phone || 'Chưa cập nhật'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Email</label>
                        <div className="flex items-center text-gray-900 font-bold bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-orange-50/20 transition-colors">
                          <Mail className="w-5 h-5 mr-3 text-primary" /> {customer.email}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Địa chỉ giao hàng</label>
                        <div className="flex items-center text-gray-900 font-bold bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-orange-50/20 transition-colors">
                          <MapPin className="w-5 h-5 mr-3 text-primary" /> {customer.address || 'Chưa cập nhật'}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-none shadow-lg bg-white overflow-hidden mt-8">
                <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-xl font-black text-gray-900 flex items-center"><AlertCircle className="w-5 h-5 mr-2 text-primary" /> Đổi mật khẩu</h3>
                </div>
                <CardContent className="p-6 md:p-8">
                  <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Mật khẩu hiện tại</label>
                      <Input type="password" value={pwdData.oldPassword} onChange={(e) => setPwdData({...pwdData, oldPassword: e.target.value})} required className="bg-gray-50" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Mật khẩu mới</label>
                      <Input type="password" value={pwdData.newPassword} onChange={(e) => setPwdData({...pwdData, newPassword: e.target.value})} required className="bg-gray-50" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Xác nhận mật khẩu mới</label>
                      <Input type="password" value={pwdData.confirmPassword} onChange={(e) => setPwdData({...pwdData, confirmPassword: e.target.value})} required className="bg-gray-50" />
                    </div>
                    <Button type="submit" disabled={isChangingPwd} className="w-full bg-primary hover:bg-orange-600 text-white rounded-xl font-bold">
                      {isChangingPwd ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            )}

            {/* Tab: Lịch sử mua hàng */}
            {activeTab === 'orders' && (
              <Card className="rounded-3xl border-none shadow-lg bg-white overflow-hidden min-h-[400px]">
                <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-2xl font-black text-gray-900">Lịch sử đơn hàng</h3>
                  <span className="bg-orange-100 text-primary font-bold px-3 py-1 rounded-full text-sm">{orders.length} đơn</span>
                </div>
                <CardContent className="p-6 md:p-8 bg-gray-50/50">
                  {loadingOrders ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-primary"></div>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-16">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium text-lg">Bạn chưa có đơn hàng nào.</p>
                      <Button onClick={() => navigate('/shop')} className="mt-4 bg-primary hover:bg-orange-600 text-white rounded-full font-bold px-8 shadow-md shadow-primary/20">
                        Mua sắm ngay
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map(order => (
                        <div key={order.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden transition-all hover:border-primary/30 hover:shadow-md group">
                          <div 
                            className="p-5 flex flex-wrap md:flex-nowrap items-center justify-between cursor-pointer bg-white group-hover:bg-orange-50/30 transition-colors"
                            onClick={() => handleToggleOrderDetails(order.id)}
                          >
                            <div className="flex items-center space-x-4 md:space-x-6 w-full md:w-auto mb-4 md:mb-0">
                              <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 p-3 rounded-xl border border-orange-100 text-center min-w-[80px] flex flex-col items-center justify-center shadow-sm">
                                <span className="block text-[10px] text-orange-600 font-black uppercase tracking-wider mb-1">Mã Đơn</span>
                                <span className="block text-lg font-black text-primary">#{order.id}</span>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <span className="bg-gray-50 border border-gray-200 text-gray-600 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center">
                                    <Calendar className="w-3 h-3 mr-1" /> {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                                  </span>
                                </div>
                                <div>{getOrderStatus(order.status)}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between w-full md:w-auto space-x-6">
                              <div className="text-right hidden md:block">
                                <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Trạng thái</span>
                                <span className="block font-bold text-green-600 text-sm flex items-center justify-end"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Đã ghi nhận</span>
                              </div>
                              <div className={`p-2.5 rounded-full transition-colors ${expandedOrderId === order.id ? 'bg-primary text-white shadow-md shadow-primary/30' : 'bg-gray-50 text-gray-400 group-hover:bg-orange-100 group-hover:text-primary'}`}>
                                {expandedOrderId === order.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                              </div>
                            </div>
                          </div>

                          {expandedOrderId === order.id && (
                            <div className="p-6 bg-gradient-to-b from-gray-50 to-white border-t border-gray-100">
                              <h4 className="font-black text-gray-900 text-lg mb-6 flex items-center">
                                <ShoppingCart className="w-5 h-5 mr-2 text-primary" /> Chi tiết sản phẩm
                              </h4>
                              {loadingDetails && !orderDetails[order.id] ? (
                                <div className="flex justify-center py-8">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                              ) : orderDetails[order.id] ? (
                                <div className="space-y-6">
                                  <div className="space-y-3">
                                    {orderDetails[order.id].map((item, idx) => (
                                      <div key={idx} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-primary/20 transition-all">
                                        <div className="flex items-center space-x-4">
                                          <div className="relative">
                                            {item.imageUrl ? (
                                              <img src={getImageUrl(item.imageUrl)} alt={item.productName} className="w-14 h-14 object-cover rounded-xl shadow-sm" />
                                            ) : (
                                              <div className="w-14 h-14 bg-gradient-to-br from-orange-50 to-orange-100/50 text-primary font-black rounded-xl flex items-center justify-center border border-orange-100 shadow-sm">
                                                <Package className="w-6 h-6 opacity-50" />
                                              </div>
                                            )}
                                            <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow-sm shadow-primary/30 border-2 border-white">
                                              {item.quantity}
                                            </span>
                                          </div>
                                          <div>
                                            <p className="font-bold text-gray-900 text-[15px] mb-0.5 line-clamp-1">{item.productName}</p>
                                            <p className="text-sm text-gray-500 font-medium">{formatPrice(item.unitPrice)}/món</p>
                                          </div>
                                        </div>
                                        <div className="font-black text-gray-900 text-lg">
                                          {formatPrice(item.total)}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  
                                  {/* Payment Summary Section */}
                                  <div className="mt-4 pt-6 border-t border-dashed border-gray-200">
                                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                      <h5 className="font-bold text-gray-800 mb-4 flex items-center text-sm uppercase tracking-wider">
                                        Chi tiết thanh toán
                                      </h5>
                                      <div className="space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                          <span className="text-gray-500 font-medium">Tạm tính ({orderDetails[order.id].reduce((sum, item) => sum + item.quantity, 0)} sản phẩm)</span>
                                          <span className="font-bold text-gray-900">{formatPrice(orderDetails[order.id].reduce((sum, item) => sum + item.total, 0))}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                          <span className="text-gray-500 font-medium">Phí vận chuyển (Dự kiến)</span>
                                          <span className="font-bold text-green-600">Miễn phí</span>
                                        </div>
                                        
                                        {extractDiscount(order.notes) > 0 && (
                                          <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500 font-medium">Khuyến mãi (Voucher)</span>
                                            <span className="font-bold text-red-500">- {formatPrice(extractDiscount(order.notes))}</span>
                                          </div>
                                        )}
                                        
                                        {order.notes && !order.notes.startsWith("[Đã thanh") && !order.notes.startsWith("[Thanh toán") && (
                                          <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 italic">
                                            <span className="font-semibold not-italic block mb-1">Ghi chú giao hàng:</span>
                                            {order.notes.replace(/\[.*?\]/g, '').trim() || 'Không có'}
                                          </div>
                                        )}
                                        
                                        <hr className="border-gray-100 my-4" />
                                        
                                        <div className="flex justify-between items-end">
                                          <div>
                                            <span className="block text-gray-700 font-bold mb-1">Tổng cộng</span>
                                            <span className="block text-[11px] text-gray-400 font-medium">Đã bao gồm VAT (nếu có)</span>
                                          </div>
                                          <span className="font-black text-2xl text-primary">{formatPrice(Math.max(0, orderDetails[order.id].reduce((sum, item) => sum + item.total, 0) - extractDiscount(order.notes)))}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                </div>
                              ) : null}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Tab: Wishlist */}
            {activeTab === 'wishlist' && (
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center">
                  <Heart className="w-6 h-6 mr-2 text-red-500 fill-red-500" /> Sản phẩm yêu thích
                </h2>

                {wishlist.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {wishlist.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-10 h-10" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Chưa có sản phẩm yêu thích</h3>
                    <Button className="mt-4 bg-primary text-white rounded-full font-bold px-8" onClick={() => navigate('/shop')}>
                      Khám phá thực đơn
                    </Button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
