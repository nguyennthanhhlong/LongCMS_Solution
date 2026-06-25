import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Vui lòng nhập địa chỉ email');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/Customers/forgot-password', { email });
      toast.success(response.data.message || 'Mật khẩu mới đã được gửi vào email của bạn');
      setSuccess(true);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
            Quên Mật Khẩu?
          </h2>
          <p className="mt-4 text-center text-sm text-gray-600">
            Đừng lo lắng! Nhập email bạn đã đăng ký và chúng tôi sẽ gửi mật khẩu mới cho bạn.
          </p>
        </div>

        {success ? (
          <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-8 rounded-2xl text-center">
            <h3 className="font-bold text-lg mb-2">Kiểm tra email của bạn!</h3>
            <p className="text-sm mb-6">Chúng tôi đã gửi một mật khẩu mới đến <strong>{email}</strong></p>
            <Link to="/login" className="font-bold text-primary hover:text-orange-600">
              Quay lại trang Đăng nhập
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-70 shadow-md shadow-primary/30"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Gửi mật khẩu mới"
                )}
              </button>
            </div>
            
            <div className="text-center mt-4">
              <Link to="/login" className="inline-flex items-center font-medium text-sm text-gray-600 hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Quay lại Đăng nhập
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
