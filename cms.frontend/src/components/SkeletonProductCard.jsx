import React from 'react';
import { Card, CardHeader, CardFooter } from './ui/card';

const SkeletonProductCard = () => {
  return (
    <Card className="flex flex-col h-full overflow-hidden border border-gray-100/50 rounded-2xl bg-white shadow-sm">
      {/* Ảnh Skeleton */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-200 animate-pulse rounded-t-2xl"></div>
      
      <CardHeader className="p-4 pb-2 flex-1 text-center">
        {/* Tên sản phẩm Skeleton */}
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
        
        {/* Giá Skeleton */}
        <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto mt-4 animate-pulse"></div>
      </CardHeader>

      <CardFooter className="p-4 pt-0 gap-2 flex-row">
        {/* Nút Chi tiết */}
        <div className="flex-1 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
        {/* Nút Mua ngay */}
        <div className="flex-1 h-10 bg-orange-200 rounded-xl animate-pulse"></div>
      </CardFooter>
    </Card>
  );
};

export default SkeletonProductCard;
