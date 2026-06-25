import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogService } from '../../services/blogService';
import { Calendar, ArrowLeft, Clock, User } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { getImageUrl } from '../../lib/utils';

const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await blogService.getPostById(id);
        setPost(data);
      } catch (err) {
        setError('Không tìm thấy bài viết hoặc có lỗi xảy ra.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center py-24 bg-gray-50 min-h-[60vh] flex flex-col items-center justify-center">
        <div className="bg-red-50 text-red-500 px-6 py-4 rounded-2xl mb-6 font-bold">
          {error}
        </div>
        <Link to="/blog">
          <Button className="bg-primary hover:bg-orange-600 text-white rounded-full px-8 py-6 shadow-lg shadow-primary/30">
            <ArrowLeft className="w-5 h-5 mr-2"/> Trở Về Góc Ẩm Thực
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        {/* Nút quay lại */}
        <Link 
          to="/blog" 
          className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-primary mb-8 transition-colors bg-white px-5 py-2.5 rounded-full shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách
        </Link>
        
        <article className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header Bài Viết */}
          <div className="p-8 md:p-12 text-center">
            <span className="inline-block px-4 py-1.5 bg-orange-100 text-primary text-xs font-black uppercase tracking-widest rounded-full mb-6">
              {post.category?.name || "Tin tức & Sự kiện"}
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-gray-900 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center text-gray-500 text-sm font-medium gap-6">
              <span className="flex items-center bg-gray-50 px-4 py-2 rounded-full">
                <Calendar className="w-4 h-4 mr-2 text-primary" />
                {new Date(post.createdDate).toLocaleDateString('vi-VN')}
              </span>
              {/* <span className="flex items-center bg-gray-50 px-4 py-2 rounded-full">
                <User className="w-4 h-4 mr-2 text-primary" />
                Ban Biên Tập
              </span> */}
            </div>
          </div>

          {/* Cố định lỗi ảnh bằng getImageUrl */}
          <figure className="w-full relative aspect-video bg-gray-100">
            <img 
              src={getImageUrl(post.imageUrl)} 
              alt={post.title} 
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/1200x600?text=Blog+Image'; }}
            />
            {/* Overlay Gradient nhẹ phía dưới ảnh */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
          </figure>

          {/* Nội dung bài viết với HTML từ CKEditor */}
          <div className="p-8 md:p-12">
            <div 
              className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-primary hover:prose-a:text-orange-600 prose-img:rounded-2xl prose-img:shadow-lg prose-img:mx-auto prose-strong:text-gray-900
              [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-6 [&_h1]:mt-8 [&_h1]:text-gray-900 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mb-4 [&_h2]:mt-6 [&_h2]:text-gray-800 [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:mb-3 [&_h3]:mt-5 [&_h3]:text-gray-800
              [&_ul]:list-disc [&_ul]:pl-8 [&_ul]:mb-6 [&_ol]:list-decimal [&_ol]:pl-8 [&_ol]:mb-6 [&_li]:mb-2
              [&_figure.image]:mx-auto [&_figure.image]:my-8 [&_figure.image_img]:w-full [&_figure.image_img]:max-w-3xl [&_figure.table]:w-full [&_figure.table]:overflow-x-auto [&_table]:w-full [&_td]:border [&_td]:border-gray-200 [&_td]:p-3 [&_th]:border [&_th]:border-gray-200 [&_th]:p-3 [&_th]:bg-gray-50"
              dangerouslySetInnerHTML={{ 
                __html: post.content 
                  ? post.content.replace(/src="\/uploads\//g, `src="${process.env.REACT_APP_IMAGE_BASE_URL || 'http://localhost:5151'}/uploads/`) 
                  : "<p>Nội dung đang được cập nhật...</p>" 
              }}
            />
          </div>
          
          {/* Footer Bài Viết */}
          <div className="bg-gray-50 border-t border-gray-100 p-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="font-bold text-gray-700">Chia sẻ bài viết này:</div>
            <div className="flex gap-3">
              <button className="bg-white hover:bg-orange-50 text-primary border border-primary/20 px-4 py-2 rounded-full text-sm font-bold transition-colors">Facebook</button>
              <button className="bg-white hover:bg-orange-50 text-primary border border-primary/20 px-4 py-2 rounded-full text-sm font-bold transition-colors">Twitter</button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;
