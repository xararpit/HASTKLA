import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const storedCart = localStorage.getItem('cartItems');
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, qty, customText = '') => {
        const existingItem = cartItems.find((x) => x.product === product._id);

        if (existingItem) {
            setCartItems(
                cartItems.map((x) =>
                    x.product === existingItem.product ? { ...existingItem, qty: existingItem.qty + qty } : x
                )
            );
        } else {
            setCartItems([...cartItems, {
                product: product._id,
                name: product.name,
                image: product.images[0],
                price: product.price,
                qty,
                customText
            }]);
        }
    };

    const removeFromCart = (id) => {
        setCartItems(cartItems.filter((x) => x.product !== id));
    };

    const updateCartQuantity = (id, qty) => {
        setCartItems(
            cartItems.map((x) =>
                x.product === id ? { ...x, qty } : x
            )
        );
    }

    const clearCart = () => {
        setCartItems([]);
    }

    const getCartCount = () => {
        return cartItems.reduce((acc, item) => acc + item.qty, 0);
    }

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateCartQuantity, clearCart, getCartCount }}>
            {children}
        </CartContext.Provider>
    );
};
