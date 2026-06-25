import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
      setError('Vui lòng điền các trường bắt buộc (Họ tên, Email, SĐT, Mật khẩu)');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...customerData } = formData;
      await authService.register(customerData);
      
      setSuccess(true);
      toast.success('Đăng ký tài khoản thành công!');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-gray-50 p-4 py-12">
        <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-12 text-center">
          <div className="mx-auto w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">Tuyệt vời!</h2>
          <p className="text-gray-500 font-medium mb-8">
            Bạn đã tạo tài khoản thành công. Hệ thống đang tự động chuyển hướng đến trang đăng nhập...
          </p>
          <div className="animate-spin mx-auto rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-gray-50 p-4 py-12">
      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row-reverse">
        
        {/* Right Image Side */}
        <div className="hidden md:block md:w-1/2 relative bg-gray-900">
          <img 
            src="https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&q=80&w=1000" 
            alt="Register Banner" 
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-12 text-white">
            <span className="bg-primary text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full w-max mb-4">FastFoodWorld</span>
            <h2 className="text-4xl font-black mb-3 leading-tight">Trở thành<br/>thành viên!</h2>
            <p className="text-gray-300 font-medium leading-relaxed">Đăng ký tài khoản ngay hôm nay để nhận các mã giảm giá độc quyền và giao hàng miễn phí cho đơn hàng đầu tiên.</p>
          </div>
        </div>

        {/* Left Form Side */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative overflow-y-auto max-h-[85vh] no-scrollbar">
          <Link to="/" className="absolute top-8 left-8 sm:top-12 sm:left-12 text-gray-400 hover:text-primary transition-colors flex items-center text-sm font-bold z-10 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full md:bg-transparent md:backdrop-blur-none md:p-0 md:rounded-none">
            <ArrowLeft className="w-4 h-4 mr-2" /> Về trang chủ
          </Link>
          
          <div className="max-w-md w-full mx-auto mt-12 sm:mt-8">
            <div className="mb-8 text-center md:text-left">
              <h1 className="text-3xl font-black text-gray-900 mb-2">Đăng Ký</h1>
              <p className="text-gray-500 font-medium">Điền thông tin của bạn để tạo tài khoản mới.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl flex items-center text-sm font-medium">
                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 ml-1">Họ và tên <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="fullName"
                  placeholder="Nguyễn Văn A" 
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-primary focus:ring-0 outline-none transition-all font-medium text-gray-900 placeholder-gray-400"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700 ml-1">Email <span className="text-red-500">*</span></label>
                  <input 
                    type="email" 
                    name="email"
                    placeholder="name@example.com" 
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-primary focus:ring-0 outline-none transition-all font-medium text-gray-900 placeholder-gray-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700 ml-1">Số điện thoại <span className="text-red-500">*</span></label>
                  <input 
                    type="tel" 
                    name="phone"
                    placeholder="0912345678" 
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-primary focus:ring-0 outline-none transition-all font-medium text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 ml-1">Địa chỉ giao hàng</label>
                <input 
                  type="text" 
                  name="address"
                  placeholder="Số nhà, Đường, Quận/Huyện..." 
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-primary focus:ring-0 outline-none transition-all font-medium text-gray-900 placeholder-gray-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700 ml-1">Mật khẩu <span className="text-red-500">*</span></label>
                  <input 
                    type="password" 
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-primary focus:ring-0 outline-none transition-all font-medium text-gray-900 placeholder-gray-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700 ml-1">Xác nhận <span className="text-red-500">*</span></label>
                  <input 
                    type="password" 
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-primary focus:ring-0 outline-none transition-all font-medium text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 mt-6 bg-primary hover:bg-orange-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 flex justify-center items-center"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Đang tạo tài khoản...
                  </span>
                ) : 'Đăng ký tài khoản'}
              </button>
            </form>

            <div className="mt-8 text-center pb-4">
              <p className="text-gray-500 font-medium">
                Đã có tài khoản?{' '}
                <Link to="/login" className="text-primary font-bold hover:underline transition-all">
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
