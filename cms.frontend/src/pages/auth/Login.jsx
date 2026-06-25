import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Vui lòng điền đầy đủ email và mật khẩu');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login(formData.email, formData.password);
      
      // Lưu thông tin người dùng vào localStorage
      localStorage.setItem('customer', JSON.stringify(response.customer));
      
      toast.success('Đăng nhập thành công!');
      // Dispatch an event so Header updates
      window.dispatchEvent(new Event('storage'));
      
      // Chuyển hướng về trang chủ
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
      toast.error('Đăng nhập thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-gray-50 p-4 py-12">
      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Image Side */}
        <div className="hidden md:block md:w-1/2 relative bg-gray-900">
          <img 
            src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=1000" 
            alt="Login Banner" 
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-12 text-white">
            <span className="bg-primary text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full w-max mb-4">FastFoodWorld</span>
            <h2 className="text-4xl font-black mb-3 leading-tight">Chào mừng<br/>trở lại!</h2>
            <p className="text-gray-300 font-medium leading-relaxed">Đăng nhập để khám phá những món ngon và nhận vô vàn ưu đãi đặc biệt dành riêng cho bạn hôm nay.</p>
          </div>
        </div>

        {/* Right Form Side */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative">
          <Link to="/" className="absolute top-8 left-8 sm:top-12 sm:left-12 text-gray-400 hover:text-primary transition-colors flex items-center text-sm font-bold">
            <ArrowLeft className="w-4 h-4 mr-2" /> Về trang chủ
          </Link>
          
          <div className="max-w-md w-full mx-auto mt-8 sm:mt-0">
            <div className="mb-10 text-center md:text-left">
              <h1 className="text-3xl font-black text-gray-900 mb-2">Đăng Nhập</h1>
              <p className="text-gray-500 font-medium">Vui lòng điền thông tin tài khoản của bạn.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl flex items-center text-sm font-medium">
                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Địa chỉ Email</label>
                <input 
                  // type="email" 
                  name="email"
                  placeholder="name@example.com" 
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-primary focus:ring-0 outline-none transition-all font-medium text-gray-900 placeholder-gray-400"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-sm font-bold text-gray-700">Mật khẩu</label>
                  <Link to="/forgot-password" className="text-sm font-bold text-primary hover:text-orange-600 transition-colors">Quên mật khẩu?</Link>
                </div>
                <input 
                  type="password" 
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-primary focus:ring-0 outline-none transition-all font-medium text-gray-900 placeholder-gray-400"
                />
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 mt-4 bg-primary hover:bg-orange-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 flex justify-center items-center"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Đang xử lý...
                  </span>
                ) : 'Đăng nhập ngay'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-500 font-medium">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="text-primary font-bold hover:underline transition-all">
                  Đăng ký miễn phí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
