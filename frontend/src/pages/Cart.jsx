import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
    const { cartItems, removeFromCart, updateCartQuantity } = useContext(CartContext);
    const navigate = useNavigate();

    const getCartSubtotal = () => {
        return cartItems.reduce((price, item) => price + item.price * item.qty, 0);
    };

    const checkoutHandler = () => {
        navigate('/login?redirect=checkout'); // Logic handles basic routing, redirect param to checkout
    };

    return (
        <div className="cart-page container py-2xl">
            <h1 className="mb-2xl">Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-3xl">
                    <p className="mb-lg">Your cart is currently empty.</p>
                    <Link to="/shop" className="btn btn-primary">Return to Shop</Link>
                </div>
            ) : (
                <div className="cart-layout">
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div key={item.product} className="cart-item card mb-md">
                                <div className="cart-item-image">
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className="cart-item-details">
                                    <Link to={`/product/${item.product}`}>
                                        <h3 className="mb-xs">{item.name}</h3>
                                    </Link>
                                    <p className="product-price mb-sm">₹{item.price}</p>

                                    {item.customText && (
                                        <p className="text-sm text-muted mb-sm italic">
                                            Customization: "{item.customText}"
                                        </p>
                                    )}

                                    <div className="cart-actions flex items-center justify-between mt-auto">
                                        <div className="qty-selector flex items-center gap-sm">
                                            <label className="text-sm">Qty:</label>
                                            <select
                                                value={item.qty}
                                                onChange={(e) => updateCartQuantity(item.product, Number(e.target.value))}
                                                className="form-control btn-sm w-auto"
                                            >
                                                {[...Array(5).keys()].map((x) => (
                                                    <option key={x + 1} value={x + 1}>
                                                        {x + 1}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <button
                                            className="btn btn-outline btn-sm text-accent"
                                            style={{ borderColor: 'var(--color-accent)' }}
                                            onClick={() => removeFromCart(item.product)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary card">
                        <h2 className="mb-xl">Order Summary</h2>
                        <div className="summary-row flex justify-between mb-md">
                            <span>Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)}):</span>
                            <span>₹{getCartSubtotal()}</span>
                        </div>
                        <div className="summary-row flex justify-between mb-md">
                            <span>Shipping:</span>
                            <span>Calculated at checkout</span>
                        </div>
                        <hr className="my-md" style={{ borderColor: 'var(--color-secondary-light)', borderStyle: 'solid' }} />
                        <div className="summary-row flex justify-between mb-xl text-primary font-bold text-lg">
                            <span>Subtotal:</span>
                            <span>₹{getCartSubtotal()}</span>
                        </div>
                        <button
                            className="btn btn-primary w-full"
                            disabled={cartItems.length === 0}
                            onClick={checkoutHandler}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
