import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const getCustomer = () => {
    const customer = localStorage.getItem('customer');
    return customer ? JSON.parse(customer) : null;
};

const getWishlistKey = () => {
    const customer = getCustomer();
    return customer ? `wishlist_${customer.id}` : 'wishlist';
};

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem(getWishlistKey());
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem(getWishlistKey());
      setWishlist(saved ? JSON.parse(saved) : []);
    };

    window.addEventListener('wishlist_updated', handleStorageChange);
    // Đồng bộ giữa các tab trình duyệt
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('wishlist_updated', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const toggleWishlist = (product) => {
    const isExist = wishlist.find(item => item.id === product.id);
    let newWishlist;
    
    if (isExist) {
      toast.success(`Đã bỏ thích ${product.name}`, { icon: '💔' });
      newWishlist = wishlist.filter(item => item.id !== product.id);
    } else {
      toast.success(`Đã yêu thích ${product.name}`, { icon: '❤️' });
      newWishlist = [...wishlist, product];
    }

    setWishlist(newWishlist);
    localStorage.setItem(getWishlistKey(), JSON.stringify(newWishlist));
    window.dispatchEvent(new Event('wishlist_updated'));
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  return { wishlist, toggleWishlist, isInWishlist };
};
