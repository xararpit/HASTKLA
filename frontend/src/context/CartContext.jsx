import React, { createContext, useContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const localData = localStorage.getItem('hastkla_cart');
        return localData ? JSON.parse(localData) : [];
    });

    useEffect(() => {
        localStorage.setItem('hastkla_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, qty = 1, customText = '') => {
        setCartItems(prev => {
            const existItem = prev.find(x => x.product === (product._id || product.product));
            if (existItem) {
                return prev.map(x => x.product === existItem.product ? { ...x, qty: x.qty + qty, customText: customText || x.customText } : x);
            } else {
                return [...prev, {
                    product: product._id,
                    name: product.name,
                    image: product.image || product.images?.[0],
                    price: product.price,
                    emoji: product.emoji || '🎁',
                    qty,
                    customText
                }];
            }
        });
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(x => x.product !== id));
    };

    const updateCartQuantity = (id, qty) => {
        setCartItems(prev => prev.map(x => x.product === id ? { ...x, qty } : x));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateCartQuantity,
            clearCart,
            cartCount: cartItems.reduce((acc, item) => acc + item.qty, 0)
        }}>
            {children}
        </CartContext.Provider>
    );
};
