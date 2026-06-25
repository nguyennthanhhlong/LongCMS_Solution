import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { blogService } from '../../services/blogService';
import { advertisementService } from '../../services/advertisementService';
import ProductCard from '../../components/ProductCard';
import BlogCard from '../../components/BlogCard';
import { ArrowRight } from 'lucide-react';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [newestProducts, setNewestProducts] = useState([]);
  const [hotProducts, setHotProducts] = useState([]);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingNewest, setLoadingNewest] = useState(true);
  const [loadingHot, setLoadingHot] = useState(true);

  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0);

  // Filter states for UI purpose
  const [activeTab, setActiveTab] = useState('ALL');

  const [heroSlides, setHeroSlides] = useState([]);

  useEffect(() => {
    // Tải danh mục sản phẩm để tạo Tab
    const fetchCategories = async () => {
      try {
        const catData = await productService.getCategories();
        setCategories(catData);
      } catch (error) {
        console.error('Lỗi tải danh mục:', error);
      }
    };
    fetchCategories();

    // Tải bài viết
    const fetchPosts = async () => {
      try {
        const postData = await blogService.getAllPosts();
        setPosts((postData.data || postData).slice(0, 3));
      } catch (error) {
        console.error('Lỗi tải bài viết:', error);
      } finally {
        setLoadingPosts(false);
      }
    };
    fetchPosts();
    
    // Tải banner
    const fetchBanners = async () => {
      try {
        const ads = await advertisementService.getActiveAdvertisements();
        if (ads && ads.length > 0) {
            setHeroSlides(ads);
        }
      } catch (error) {
        console.error('Lỗi tải banner:', error);
      }
    };
    fetchBanners();

    // Tải sản phẩm mới nhất
    const fetchNewestProducts = async () => {
      try {
        const data = await productService.getNewestProducts();
        setNewestProducts(data);
      } catch (error) {
        console.error('Lỗi tải sản phẩm mới nhất:', error);
      } finally {
        setLoadingNewest(false);
      }
    };
    fetchNewestProducts();

    // Tải sản phẩm hot
    const fetchHotProducts = async () => {
      try {
        const data = await productService.getHotProducts();
        setHotProducts(data);
      } catch (error) {
        console.error('Lỗi tải sản phẩm hot:', error);
      } finally {
        setLoadingHot(false);
      }
    };
    fetchHotProducts();

    // Tải sản phẩm ban đầu (ALL)
    fetchProductsByTab('ALL');

  }, []);

  useEffect(() => {
    if (heroSlides.length === 0) return;
    // Auto Slider
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const fetchProductsByTab = async (categoryId) => {
    setLoadingProducts(true);
    try {
      let prodData;
      if (categoryId === 'ALL') {
        prodData = await productService.getAllProducts();
      } else {
        prodData = await productService.getProductsByCategory(categoryId);
      }
      setProducts((prodData.data || prodData).slice(0, 8)); // Lấy 8 sản phẩm
    } catch (error) {
      console.error('Lỗi tải sản phẩm theo category:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleTabClick = (categoryId) => {
    if (activeTab === categoryId) return; // Không tải lại nếu đang ở tab hiện tại
    setActiveTab(categoryId);
    fetchProductsByTab(categoryId);
  };

  return (
    <div className="bg-white">
      {/* 1. Hero Banner */}
      <section className="container mx-auto px-4 mt-6">
        <div className="w-full bg-gray-900 rounded-3xl overflow-hidden relative shadow-2xl" style={{ height: '450px' }}>
          {heroSlides.length > 0 ? heroSlides.map((slide, index) => (
            <div 
              key={slide.id} 
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <img 
                src={`${process.env.REACT_APP_IMAGE_BASE_URL || 'http://localhost:5000'}${slide.imageUrl}`} 
                alt={slide.title} 
                className="w-full h-full object-cover opacity-80"
                onError={(e) => e.target.src = 'https://via.placeholder.com/2000x500?text=Hero+Banner'}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center text-white px-12 md:px-24">
                <span className="inline-block px-4 py-1 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-full mb-6 w-max shadow-lg shadow-primary/30">Nổi bật</span>
                <h1 className="text-5xl md:text-7xl font-black mb-6 drop-shadow-lg max-w-2xl leading-tight whitespace-pre-line">
                  {slide.title}
                </h1>
                <Link to={"/shop"} className="bg-primary hover:bg-orange-600 px-10 py-4 rounded-full font-bold transition-all text-lg w-max flex items-center shadow-xl shadow-primary/30 hover:scale-105 active:scale-95">
                  Khám Phá <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
          )) : (
            <div className="absolute inset-0 flex items-center justify-center text-white">Đang tải banner...</div>
          )}

          {/* Slider Controls */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {heroSlides.map((_, index) => (
              <button 
                key={index} 
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-primary w-8' : 'bg-white/50 hover:bg-white w-2'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 1.5. Sản Phẩm Mới Nhất & Bán Chạy */}
      <section className="bg-orange-50/50 py-12 border-y border-orange-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Cột Trái: Sản Phẩm Mới Nhất */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black uppercase text-gray-900 tracking-tight">Món <span className="text-primary">Mới Nhất</span></h2>
                <Link to="/shop" className="text-sm font-bold text-primary hover:text-orange-600 transition-colors flex items-center">
                  Xem thêm <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              {loadingNewest ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : newestProducts.length === 0 ? (
                <p className="text-gray-500 italic">Đang cập nhật...</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {newestProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>

            {/* Cột Phải: Sản Phẩm Hot */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black uppercase text-gray-900 tracking-tight">Món <span className="text-red-500">Bán Chạy Nhất</span></h2>
                <Link to="/shop" className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors flex items-center">
                  Xem thêm <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              {loadingHot ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                </div>
              ) : hotProducts.length === 0 ? (
                <p className="text-gray-500 italic">Đang cập nhật...</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {hotProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Tabs */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          <button
            onClick={() => handleTabClick('ALL')}
            className={`flex flex-col items-center justify-center p-4 w-28 h-28 rounded-full transition-all shadow-sm ${
              activeTab === 'ALL' 
                ? 'bg-primary text-white shadow-primary/30 shadow-md scale-110' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-orange-50 hover:text-primary'
            }`}
          >
            <span className="font-bold text-sm">TẤT CẢ</span>
          </button>
          
          {categories.map(cat => {
            const imgSrc = cat.imageUrl 
              ? `${process.env.REACT_APP_IMAGE_BASE_URL || 'http://localhost:5000'}${cat.imageUrl}`
              : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'; // Ảnh mặc định

            return (
              <button
                key={cat.id}
                onClick={() => handleTabClick(cat.id)}
                className={`flex flex-col items-center justify-center p-2 w-28 h-28 rounded-full transition-all shadow-sm overflow-hidden relative group ${
                  activeTab === cat.id 
                    ? 'border-4 border-primary shadow-primary/30 shadow-md scale-110' 
                    : 'bg-white border-2 border-gray-200 hover:border-primary/50'
                }`}
              >
                <img src={imgSrc} alt={cat.name} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                <span className="relative z-10 font-bold text-sm text-white drop-shadow-md text-center px-1 uppercase">{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* 3. Product Grid */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-black uppercase text-gray-900 tracking-tight">Thực Đơn <span className="text-primary">Nổi Bật</span></h2>
          <span className="text-sm font-medium bg-orange-100 text-orange-600 px-3 py-1 rounded-full">{products.length} món</span>
        </div>
        
        {loadingProducts ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
            <p className="text-gray-500 font-medium">Không có sản phẩm nào trong danh mục này.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-8 mb-16">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Latest Blog */}
      <section className="bg-gradient-to-b from-white to-orange-50 py-20 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">Tin Tức Khuyến Mãi</span>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Góc Ẩm Thực & Review</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">Cập nhật những món ngon mới nhất, xu hướng đồ uống giải nhiệt và các tips ẩm thực cùng chúng tôi.</p>
          </div>

          {loadingPosts ? (
             <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {posts.map(post => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
