import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // Lấy giỏ hàng từ localStorage nếu có
    const initialCart = JSON.parse(localStorage.getItem('cart')) || [];
    const [cart, setCart] = useState(initialCart);

    useEffect(() => {
        // Lưu giỏ hàng vào localStorage mỗi khi có thay đổi
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, quantity) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: Math.min(item.quantity + quantity, product.stockQuantity) }
                        : item
                );
            }
            return [...prevCart, { ...product, quantity: Math.min(quantity, product.stockQuantity) }];
        });
    };

    const updateQuantity = (productId, amount) => {
        setCart(prevCart => {
            return prevCart.map(item => {
                if (item.id === productId) {
                    const newQuantity = item.quantity + amount;
                    // Không cho phép số lượng < 1 và không vượt quá tồn kho
                    return { ...item, quantity: Math.max(1, Math.min(newQuantity, item.stockQuantity)) };
                }
                return item;
            });
        });
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, cartTotal, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};
