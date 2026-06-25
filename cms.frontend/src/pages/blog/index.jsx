import React, { useEffect, useState } from 'react';
import { blogService } from '../../services/blogService';
import BlogCard from '../../components/BlogCard';
import BlogSidebar from '../../components/BlogSidebar';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, currentPage: 1 });

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params = { page, pageSize: 6 };
        let res;
        if (selectedCategory) {
          res = await blogService.getPostsByCategory(selectedCategory, params);
        } else {
          res = await blogService.getAllPosts(params);
        }
        setPosts(res.data || []);
        setPagination({ totalPages: res.totalPages, currentPage: res.currentPage });
      } catch (error) {
        console.error("Lỗi khi tải bài viết:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [selectedCategory, page]);

  const handleCategorySelect = (catId) => {
      setSelectedCategory(catId);
      setPage(1);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Lưới bài viết (Cột trái - 75%) */}
      <div className="w-full md:w-3/4">
        <h1 className="text-3xl font-bold mb-8">Tin tức & Xu hướng</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground text-lg">Không tìm thấy bài viết nào.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(post => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 0 && (
                <div className="flex justify-center mt-12 gap-2">
                    <button 
                        disabled={pagination.currentPage === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-100"
                    >
                        Trang trước
                    </button>
                    {[...Array(pagination.totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`px-4 py-2 border rounded-md ${pagination.currentPage === i + 1 ? 'bg-primary text-white border-primary' : 'hover:bg-gray-100'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button 
                        disabled={pagination.currentPage === pagination.totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-100"
                    >
                        Trang sau
                    </button>
                </div>
            )}
          </>
        )}
      </div>

      {/* Sidebar (Cột phải - 25%) */}
      <div className="w-full md:w-1/4">
        <div className="sticky top-24">
          <BlogSidebar 
            selectedCategory={selectedCategory} 
            onSelectCategory={handleCategorySelect} 
          />
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
