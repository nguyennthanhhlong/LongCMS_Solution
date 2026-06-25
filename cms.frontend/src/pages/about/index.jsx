import React, { useEffect } from 'react';
import { Truck, ShieldCheck, Heart, Coffee, Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1920" 
            alt="FastFoodWorld Kitchen" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/70"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <span className="bg-primary/20 text-primary border border-primary/30 px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase mb-6 inline-block backdrop-blur-md">
            Câu Chuyện Của Chúng Tôi
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Niềm Đam Mê <br/> <span className="text-primary">Ẩm Thực</span> Đích Thực
          </h1>
          <p className="text-xl text-gray-200 font-medium leading-relaxed mb-10 max-w-2xl mx-auto">
            Hành trình mang những hương vị tuyệt hảo nhất đến tận tay khách hàng, 
            kết hợp giữa nguyên liệu tươi ngon và công thức độc quyền.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-16 flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
              Hương vị tạo nên <span className="text-primary">Sự Khác Biệt</span>
            </h2>
            <div className="w-20 h-2 bg-primary rounded-full"></div>
            <p className="text-gray-600 leading-relaxed text-lg">
              Được thành lập từ năm 2023, FastFoodWorld khởi nguồn từ một cửa hàng nhỏ với mong muốn mang lại những ly trà sữa đậm vị và những phần ăn nhanh chất lượng nhất. 
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              Đội ngũ đầu bếp của chúng tôi làm việc không ngừng nghỉ để sáng tạo ra những công thức độc quyền, 
              cam kết sử dụng 100% nguyên liệu sạch và tươi mới mỗi ngày. Sự hài lòng của bạn chính là thành công lớn nhất của chúng tôi.
            </p>
            <div className="pt-4 flex gap-4">
              <div className="text-center">
                <p className="text-3xl font-black text-gray-900">50K+</p>
                <p className="text-sm font-bold text-gray-500 uppercase">Khách hàng</p>
              </div>
              <div className="w-[1px] bg-gray-200"></div>
              <div className="text-center">
                <p className="text-3xl font-black text-gray-900">100+</p>
                <p className="text-sm font-bold text-gray-500 uppercase">Món ăn</p>
              </div>
              <div className="w-[1px] bg-gray-200"></div>
              <div className="text-center">
                <p className="text-3xl font-black text-gray-900">15</p>
                <p className="text-sm font-bold text-gray-500 uppercase">Chi nhánh</p>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 relative">
            <img 
              src="https://images.unsplash.com/photo-1561758033-7e924f619b47?auto=format&fit=crop&q=80&w=800" 
              alt="Our team making food" 
              className="rounded-2xl shadow-lg w-full h-auto object-cover"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center space-x-4 border border-gray-50">
              <div className="bg-green-100 p-3 rounded-full">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-bold uppercase">Đánh giá 5 sao</p>
                <p className="text-xl font-black text-gray-900">Chất lượng hàng đầu</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto px-4 mt-24">
        <div className="text-center mb-16">
          <span className="text-primary font-bold tracking-widest uppercase text-sm">Điểm Nổi Bật</span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mt-2">Tại Sao Chọn FastFoodWorld?</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-2 text-center group">
            <div className="w-20 h-20 bg-orange-50 text-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Coffee className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Nguyên liệu Tươi Sạch</h3>
            <p className="text-gray-500 font-medium">Chúng tôi cam kết sử dụng 100% nguyên liệu có nguồn gốc rõ ràng, tươi mới mỗi ngày để đảm bảo sức khỏe cho thực khách.</p>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-2 text-center group">
            <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Truck className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Giao Hàng Siêu Tốc</h3>
            <p className="text-gray-500 font-medium">Hệ thống đối tác giao hàng chuyên nghiệp giúp món ăn đến tay bạn vẫn còn nóng hổi và giữ nguyên hương vị.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-2 text-center group">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Heart className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Phục Vụ Tận Tâm</h3>
            <p className="text-gray-500 font-medium">Đội ngũ nhân viên luôn sẵn sàng phục vụ với nụ cười trên môi, mang đến trải nghiệm hài lòng tuyệt đối.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 mt-24">
        <div className="bg-primary rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black opacity-10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
          
          <h2 className="text-3xl md:text-5xl font-black mb-6 relative z-10">Đã Sẵn Sàng Trải Nghiệm?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto font-medium text-orange-100 relative z-10">
            Hãy khám phá ngay thực đơn đa dạng của chúng tôi và chọn cho mình những món ăn yêu thích nhất hôm nay!
          </p>
          <Link to="/shop" className="relative z-10 inline-block">
            <Button className="bg-white text-primary hover:bg-gray-50 font-black text-lg px-10 py-6 rounded-full shadow-xl transition-all hover:scale-105">
              KHÁM PHÁ THỰC ĐƠN NGAY
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
