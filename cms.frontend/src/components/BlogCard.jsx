import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Calendar, ArrowRight } from 'lucide-react';
import { getImageUrl } from '../lib/utils';

const BlogCard = ({ post }) => {
  return (
    <Card className="flex flex-col h-full overflow-hidden hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 border-none shadow-md bg-white rounded-3xl group">
      <Link to={`/blog/${post.id}`} className="block overflow-hidden rounded-t-3xl relative">
        <div className="aspect-[4/3] w-full bg-gray-100">
          <img 
            src={getImageUrl(post.imageUrl)} 
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
          />
        </div>
      </Link>
      
      <CardHeader className="px-0 py-4 flex-1">
        <div className="flex items-center text-xs text-gray-400 mb-2 font-medium">
          <Calendar className="w-3 h-3 mr-1" />
          {new Date(post.createdDate).toLocaleDateString('vi-VN')}
        </div>
        <CardTitle className="line-clamp-2 text-lg font-bold leading-snug hover:text-primary transition-colors mt-2">
          <Link to={`/blog/${post.id}`}>{post.title}</Link>
        </CardTitle>
        <CardDescription className="line-clamp-2 text-sm mt-3 text-gray-500 leading-relaxed">
          {/* Lấy một đoạn text ngắn nếu không có description riêng, hoặc hiển thị mặc định */}
          {post.content ? post.content.replace(/<[^>]+>/g, '').substring(0, 100) + '...' : 'Khám phá những xu hướng thời trang mới nhất...'}
        </CardDescription>
      </CardHeader>
      
      <CardFooter className="p-6 pt-0">
        <Link to={`/blog/${post.id}`} className="inline-flex items-center text-sm font-bold text-primary hover:text-orange-600 transition-colors group/link bg-orange-50 px-4 py-2 rounded-full">
          Đọc bài viết <ArrowRight className="w-4 h-4 ml-2 transform transition-transform group-hover/link:translate-x-1" />
        </Link>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
