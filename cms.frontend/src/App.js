import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { CartProvider, CartContext } from './context/CartContext';
import { ShoppingCart, User, Search, MapPin, Phone, Mail } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

// Pages
import HomePage from './pages/home/index';
import ShopPage from './pages/shop/index';
import ProductDetail from './pages/product-detail/index';
import BlogPage from './pages/blog/index';
import BlogDetail from './pages/blog/BlogDetail';
import LoginPage from './pages/auth/Login';
import RegisterPage from './pages/auth/Register';
import ForgotPasswordPage from './pages/auth/ForgotPassword';
import CartPage from './pages/cart/index';
import CheckoutPage from './pages/checkout/index';
import ProfilePage from './pages/user/Profile';
import AboutPage from './pages/about';

function Header() {
  const customer = JSON.parse(localStorage.getItem('customer'));
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = React.useState('');
  const { cartCount } = React.useContext(CartContext);

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    if (location.pathname === '/shop') {
      setSearchTerm(search || '');
    } else {
      setSearchTerm('');
    }
  }, [location.search, location.pathname]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);

    if (val.trim()) {
      navigate(`/shop?search=${encodeURIComponent(val.trim())}`);
    } else {
      // Nếu xóa trống, về lại trang shop không query
      navigate(`/shop`);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate(`/shop`);
    }
  };

  return (
    <>
      {/* Topbar */}
      <div className="bg-gray-900 text-gray-300 text-xs py-2.5 border-b border-gray-800 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Liên hệ & Giờ làm việc */}
          <div className="flex items-center space-x-6 font-medium">
            <span className="flex items-center hover:text-white transition-colors cursor-pointer">
              <Phone className="w-3.5 h-3.5 mr-1.5 text-primary" />
              Hotline: <strong className="ml-1 text-white">1900 6868</strong>
            </span>
            <div className="w-[1px] h-3 bg-gray-700"></div>
            <span className="flex items-center hover:text-white transition-colors cursor-pointer">
              <Mail className="w-3.5 h-3.5 mr-1.5 text-primary" />
              support@fastfoodworld.vn
            </span>
          </div>

          {/* Tài khoản & Khuyến mãi */}
          <div className="flex items-center space-x-6 font-medium">
            <div className="flex items-center text-orange-400 font-bold animate-pulse">
              🔥 Giao hàng miễn phí cho đơn từ 200K!
            </div>
            <div className="w-[1px] h-3 bg-gray-700"></div>

            <div className="flex items-center space-x-4">
              {customer ? (
                <Link to="/profile" className="flex items-center text-white hover:text-primary transition-colors font-bold">
                  <User className="w-3.5 h-3.5 mr-1.5 text-primary" />
                  Xin chào, {customer.fullName}
                </Link>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login" className="flex items-center hover:text-white transition-colors">
                    <User className="w-3.5 h-3.5 mr-1.5 text-primary" /> Đăng nhập
                  </Link>
                  <span className="text-gray-600">/</span>
                  <Link to="/register" className="hover:text-white transition-colors">Đăng ký</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 flex items-center justify-between py-4">
          <Link to="/" className="text-3xl font-extrabold text-primary flex items-center gap-2 tracking-tight">
            <span className="bg-primary text-white p-1 rounded-lg">
              <ShoppingCart className="w-6 h-6" />
            </span>
            LONG.<span className="text-gray-800">FastFood</span>
          </Link>

          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl mx-8 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Tìm kiếm theo mã hoặc từ khóa..."
              className="w-full border-2 border-gray-100 rounded-l-full py-2 px-6 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-gray-50/50 transition-all"
            />
            <button type="submit" className="absolute right-0 top-0 bottom-0 bg-primary hover:bg-orange-600 text-white px-6 rounded-r-full transition-colors flex items-center shadow-md shadow-primary/30">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <Link to="/cart" className="relative text-gray-800 hover:text-primary transition-colors p-2 bg-gray-100 rounded-full hover:bg-orange-50">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center shadow-sm border-2 border-white animate-bounce">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Category Menu */}
      <div className="bg-white shadow-sm sticky top-[73px] z-40 border-b">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8">
            <Link
              to="/"
              className={`py-3 text-sm transition-colors border-b-2 ${location.pathname === '/' ? 'font-bold text-primary border-primary' : 'font-medium text-gray-600 border-transparent hover:text-primary'}`}
            >
              Trang Chủ
            </Link>
            <Link
              to="/shop"
              className={`py-3 text-sm transition-colors border-b-2 ${location.pathname.startsWith('/shop') || location.pathname.startsWith('/product') ? 'font-bold text-primary border-primary' : 'font-medium text-gray-600 border-transparent hover:text-primary'}`}
            >
              Cửa Hàng
            </Link>
            <Link
              to="/blog"
              className={`py-3 text-sm transition-colors border-b-2 ${location.pathname.startsWith('/blog') ? 'font-bold text-primary border-primary' : 'font-medium text-gray-600 border-transparent hover:text-primary'}`}
            >
              Tin Tức / Blog
            </Link>
            <Link
              to="/about"
              className={`py-3 text-sm transition-colors border-b-2 ${location.pathname.startsWith('/about') ? 'font-bold text-primary border-primary' : 'font-medium text-gray-600 border-transparent hover:text-primary'}`}
            >
              Về Chúng Tôi
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 mt-16 rounded-t-[3rem] relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 border-b border-gray-800 pb-12">
        <div>
          <h3 className="text-2xl font-extrabold text-primary mb-4 flex items-center gap-2">
            Long.<span className="text-white">FastFood</span>
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Thế giới Đồ Ăn Nhanh & Nước Uống hàng đầu. Chúng tôi mang đến những ly trà sữa, cà phê đậm vị, nước ép trái cây tươi mát cùng vô vàn món đồ ăn vặt hấp dẫn.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4 uppercase">Chính sách</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="#" className="hover:text-white transition-colors">› Chính sách giao hàng</Link></li>
            <li><Link to="#" className="hover:text-white transition-colors">› Chính sách đổi trả 1-1</Link></li>
            <li><Link to="#" className="hover:text-white transition-colors">› Bảo mật thông tin</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4 uppercase">Liên hệ</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-start">
              <MapPin className="w-4 h-4 mr-2 mt-0.5 text-[#4bc0b2]" />
              Khu công nghệ cao, Võ Chí Công, Quận 9, Hồ Chí Minh
            </li>
            <li className="flex items-center">
              <Phone className="w-4 h-4 mr-2 text-[#4bc0b2]" />
              Hotline: 090xxxxxxx
            </li>
            <li className="flex items-center">
              <Mail className="w-4 h-4 mr-2 text-[#4bc0b2]" />
              support@long.retail
            </li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500">
        © 2026 Long Retail. All rights reserved.
      </div>
    </footer>
  );
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
          <Toaster position="top-right" toastOptions={{ duration: 3000, style: { fontWeight: '500' } }} />
          <Header />

          {/* Main Content */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/product/:id" element={<ProductDetail />} />

              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:id" element={<BlogDetail />} />

              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
