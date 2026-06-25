import React, { useState, useEffect } from 'react';
import blogService from '../services/blogService';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await blogService.getAllPosts();
        setPosts(data);
      } catch (error) {
        console.error('Lỗi khi tải danh sách bài viết:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading)
    return <div className='text-center my-4'>Đang tải tin tức...</div>;

  return (
    <div className='mt-5 border-top pt-4'>
      <h4 className='mb-4 text-uppercase font-weight-bold text-secondary'>
        <i className='fa-solid fa-newspaper text-info mr-2'></i> Xu hướng thời
        trang
      </h4>
      <div className='row'>
        {posts.map((post) => (
          <div className='col-md-4 mb-3' key={post.id}>
            <div className='card h-100 shadow-sm border-0 bg-white'>
              <div className='card-body d-flex flex-column justify-content-between'>
                <div>
                  <h6 className='font-weight-bold text-dark mb-2'>
                    {post.title}
                  </h6>

                  <div
                    className='text-muted small mb-3'
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: '3',
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    <span
                      dangerouslySetInnerHTML={{
                        __html: post.content || 'Đang cập nhật nội dung...',
                      }}
                    />
                  </div>
                </div>

                <div className='d-flex justify-content-between align-items-center small text-secondary mt-2 pt-2 border-top'>
                  <span>
                    <i className='fa-regular fa-calendar mr-1'></i>
                    {post.createdDate
                      ? new Date(post.createdDate).toLocaleDateString('vi-VN')
                      : 'N/A'}
                  </span>
                  <span className='badge badge-light p-2 cursor-pointer'>
                    Xem thêm
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList;
