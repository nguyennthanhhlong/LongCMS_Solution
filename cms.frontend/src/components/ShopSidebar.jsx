import React, { useEffect, useState } from 'react';
import { productService } from '../services/productService';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Filter } from 'lucide-react';

const ShopSidebar = ({ onFilterChange, filters }) => {
  const [categories, setCategories] = useState([]);
  const [minPrice, setMinPrice] = useState(filters.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice || '');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await productService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Lỗi tải danh mục sản phẩm:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({
        ...filters,
        minPrice: minPrice ? Number(minPrice) : null,
        maxPrice: maxPrice ? Number(maxPrice) : null,
        page: 1
      });
    }, 600);
    return () => clearTimeout(timer);
  }, [minPrice, maxPrice]);

  const handleClearPrice = () => {
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border-none shadow-md overflow-hidden bg-white mb-6">
        <div className="bg-gradient-to-r from-primary to-orange-400 p-4">
          <h3 className="text-lg font-bold text-white flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Bộ Lọc Tìm Kiếm
          </h3>
        </div>
        <CardContent className="p-6">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => onFilterChange({ ...filters, categoryId: null })}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm ${
                  filters.categoryId === null 
                    ? 'bg-primary/10 text-primary font-bold' 
                    : 'hover:bg-muted text-gray-600'
                }`}
              >
                Tất cả sản phẩm
              </button>
            </li>
            {categories.map(cat => (
              <li key={cat.id}>
                <button
                  onClick={() => onFilterChange({ ...filters, categoryId: cat.id })}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm ${
                    filters.categoryId === cat.id 
                      ? 'bg-primary/10 text-primary font-bold' 
                      : 'hover:bg-muted text-gray-600'
                  }`}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold">Khoảng giá</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-gray-500 font-medium">Giá thấp nhất</label>
              <Input 
                type="number" 
                placeholder="VD: 100000" 
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-gray-500 font-medium">Giá cao nhất</label>
              <Input 
                type="number" 
                placeholder="VD: 500000" 
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            <div className="flex gap-2 pt-2">
                <Button onClick={handleClearPrice} variant="outline" className="w-full rounded-xl hover:bg-gray-100">Xóa bộ lọc giá</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShopSidebar;
