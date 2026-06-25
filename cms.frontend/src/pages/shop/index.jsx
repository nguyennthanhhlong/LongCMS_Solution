import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../../services/productService';
import ProductCard from '../../components/ProductCard';
import ShopSidebar from '../../components/ShopSidebar';
import SkeletonProductCard from '../../components/SkeletonProductCard';
import { Input } from '../../components/ui/input';
import { Search } from 'lucide-react';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    categoryId: null,
    minPrice: null,
    maxPrice: null,
    searchTerm: initialSearch,
    page: 1,
    pageSize: 12
  });

  const [pagination, setPagination] = useState({
      totalPages: 1,
      currentPage: 1
  });

  // Listen to searchParams changes to update filter searchTerm
  useEffect(() => {
    const term = searchParams.get('search') || '';
    setFilters(prev => ({...prev, searchTerm: term, page: 1}));
  }, [searchParams]);

  // Fetch data when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
            page: filters.page,
            pageSize: filters.pageSize,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            search: filters.searchTerm,
            categoryId: filters.categoryId
        };

        const res = await productService.getAllProducts(params);
        
        setDisplayedProducts(res.data || []);
        setPagination({
            totalPages: res.totalPages,
            currentPage: res.currentPage
        });

      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
    
    // Use debounce for search input
    const delayDebounceFn = setTimeout(() => {
        fetchProducts();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [filters]);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar (Cột trái - 3/12) */}
      <div className="w-full md:w-1/4">
        <div className="sticky top-24">
          <ShopSidebar 
            filters={filters} 
            onFilterChange={setFilters} 
          />
        </div>
      </div>

      {/* Main Content (Cột phải - 9/12) */}
      <div className="w-full md:w-3/4">
        {/* Shop Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-white p-4 rounded-lg shadow-sm border">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Mặt hàng thức ăn</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Tìm thấy <span className="font-bold text-primary">{displayedProducts.length}</span> sản phẩm
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm..." 
              className="pl-9"
              value={filters.searchTerm}
              onChange={(e) => {
                  setSearchParams({ search: e.target.value });
              }}
            />
          </div>
        </div>

        {/* Product List / LoadingOrEmpty */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <SkeletonProductCard key={i} />
            ))}
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 border border-dashed rounded-xl flex flex-col items-center justify-center">
            <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-state-2130362-1800926.png" alt="Empty State" className="w-48 h-48 mb-4 opacity-70" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm nào phù hợp với tiêu chí của bạn</h3>
            <p className="text-gray-500 mb-6">Thử điều chỉnh lại bộ lọc giá hoặc từ khóa tìm kiếm</p>
            <button 
              onClick={() => {
                  setSearchParams({});
                  setFilters({categoryId: null, minPrice: null, maxPrice: null, searchTerm: '', page: 1, pageSize: 12});
              }}
              className="px-6 py-2 bg-primary text-white font-medium rounded-full hover:bg-orange-600 transition-colors"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 0 && (
                <div className="flex justify-center mt-12 gap-2">
                    <button 
                        disabled={pagination.currentPage === 1}
                        onClick={() => setFilters(prev => ({...prev, page: prev.page - 1}))}
                        className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-100"
                    >
                        Trang trước
                    </button>
                    {[...Array(pagination.totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setFilters(prev => ({...prev, page: i + 1}))}
                            className={`px-4 py-2 border rounded-md ${pagination.currentPage === i + 1 ? 'bg-primary text-white border-primary' : 'hover:bg-gray-100'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button 
                        disabled={pagination.currentPage === pagination.totalPages}
                        onClick={() => setFilters(prev => ({...prev, page: prev.page + 1}))}
                        className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-100"
                    >
                        Trang sau
                    </button>
                </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
