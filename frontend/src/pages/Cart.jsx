import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Cart = () => {
    const { cartItems, removeFromCart, updateCartQuantity } = useContext(CartContext);
    const navigate = useNavigate();

    const getCartSubtotal = () => {
        return cartItems.reduce((price, item) => price + item.price * item.qty, 0);
    };

    const checkoutHandler = () => {
        navigate('/login?redirect=cart');
    };

    return (
        <>
            <Navbar />
            <div className="cart-page container py-2xl" style={{ minHeight: '80vh' }}>
                <h1 className="mb-2xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Shopping Cart</h1>

                {cartItems.length === 0 ? (
                    <div className="text-center py-3xl card bg-surface">
                        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🛍️</div>
                        <p className="mb-lg" style={{ fontSize: '1.1rem', color: 'var(--muted)' }}>Your cart is currently empty.</p>
                        <Link to="/shop" className="btn btn-clay">Return to Shop</Link>
                    </div>
                ) : (
                    <div className="cart-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) 1fr', gap: '2rem' }}>
                        <div className="cart-items">
                            {cartItems.map((item) => (
                                <div key={item.product} className="cart-item card mb-md" style={{ display: 'flex', gap: '1.5rem', padding: '1rem' }}>
                                    <div className="cart-item-image" style={{ width: 100, height: 100, borderRadius: 12, background: '#F8F5F1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
                                        {item.image ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} /> : item.emoji}
                                    </div>
                                    <div className="cart-item-details" style={{ flex: 1 }}>
                                        <Link to={`/product/${item.product}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <h3 className="mb-xs" style={{ fontSize: '1.1rem' }}>{item.name}</h3>
                                        </Link>
                                        <p className="product-price mb-sm" style={{ fontWeight: 700, color: 'var(--clay)' }}>₹{item.price?.toLocaleString('en-IN')}</p>

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
                                                    className="form-select w-auto"
                                                    style={{ padding: '0.2rem 0.5rem' }}
                                                >
                                                    {[...Array(10).keys()].map((x) => (
                                                        <option key={x + 1} value={x + 1}>
                                                            {x + 1}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <button
                                                className="btn btn-warm btn-sm"
                                                onClick={() => removeFromCart(item.product)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary-container">
                            <div className="cart-summary card" style={{ position: 'sticky', top: '100px' }}>
                                <h2 className="mb-xl" style={{ fontSize: '1.4rem' }}>Order Summary</h2>
                                <div className="summary-row flex justify-between mb-md">
                                    <span style={{ color: 'var(--muted)' }}>Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)}):</span>
                                    <span>₹{getCartSubtotal().toLocaleString('en-IN')}</span>
                                </div>
                                <div className="summary-row flex justify-between mb-md">
                                    <span style={{ color: 'var(--muted)' }}>Shipping:</span>
                                    <span style={{ color: 'var(--ok, #2e7d32)' }}>FREE</span>
                                </div>
                                <hr className="my-md" style={{ borderColor: 'var(--border)', borderStyle: 'solid' }} />
                                <div className="summary-row flex justify-between mb-xl text-primary font-bold text-lg">
                                    <span style={{ fontWeight: 700 }}>Total:</span>
                                    <span style={{ fontWeight: 700, color: 'var(--clay)', fontSize: '1.3rem' }}>₹{getCartSubtotal().toLocaleString('en-IN')}</span>
                                </div>
                                <button
                                    className="btn btn-clay btn-lg w-full"
                                    disabled={cartItems.length === 0}
                                    onClick={checkoutHandler}
                                >
                                    Proceed to Checkout →
                                </button>
                                <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--muted)', marginTop: '1rem' }}>
                                    Secure Checkout via Razorpay
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default Cart;
