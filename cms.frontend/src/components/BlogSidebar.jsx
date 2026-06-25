import React, { useEffect, useState } from 'react';
import { blogService } from '../services/blogService';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const BlogSidebar = ({ onSelectCategory, selectedCategory }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await blogService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Lỗi tải danh mục bài viết:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Chủ đề bài viết</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => onSelectCategory(null)}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                selectedCategory === null 
                  ? 'bg-primary text-primary-foreground font-medium' 
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              Tất cả chủ đề
            </button>
          </li>
          {categories.map(cat => (
            <li key={cat.id}>
              <button
                onClick={() => onSelectCategory(cat.id)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  selectedCategory === cat.id 
                    ? 'bg-primary text-primary-foreground font-medium' 
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default BlogSidebar;
