import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import axios from 'axios';
import './Checkout.css';

const Checkout = () => {
    const { user } = useContext(AuthContext);
    const { cartItems, getCartCount, clearCart } = useContext(CartContext);
    const navigate = useNavigate();

    const [shippingAddress, setShippingAddress] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: 'India'
    });
    const [paymentMethod, setPaymentMethod] = useState('Razorpay');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login?redirect=checkout');
        }
    }, [user, navigate]);

    const getCartSubtotal = () => {
        return cartItems.reduce((price, item) => price + item.price * item.qty, 0);
    };

    const shippingPrice = getCartSubtotal() > 2000 ? 0 : 150;
    const taxPrice = Number((0.18 * getCartSubtotal()).toFixed(2));
    const totalPrice = Number((getCartSubtotal() + shippingPrice + taxPrice).toFixed(2));

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    const placeOrderHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const orderData = {
                orderItems: cartItems,
                shippingAddress,
                paymentMethod,
                itemsPrice: getCartSubtotal(),
                shippingPrice,
                taxPrice,
                totalPrice
            };

            const { data } = await axios.post('/api/orders', orderData, config);

            if (paymentMethod === 'Razorpay') {
                const res = await loadRazorpayScript();

                if (!res) {
                    setError('Razorpay SDK failed to load. Are you online?');
                    setLoading(false);
                    return;
                }

                const options = {
                    key: "dummy_key", // Dummy key as requested by user plan
                    amount: data.razorpayOrder.amount,
                    currency: data.razorpayOrder.currency,
                    name: "Twilight Star",
                    description: "Handicraft Purchase",
                    order_id: data.razorpayOrder.id,
                    handler: async function (response) {
                        try {
                            const verifyConfig = {
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${user.token}`,
                                },
                            };
                            await axios.post(
                                `/api/orders/${data.order._id}/verify`,
                                {
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_signature: response.razorpay_signature
                                },
                                verifyConfig
                            );
                            clearCart();
                            navigate('/order-success');
                        } catch (err) {
                            setError('Payment verification failed');
                        }
                    },
                    prefill: {
                        name: user.name,
                        email: user.email,
                    },
                    theme: {
                        color: "#8C5E3C",
                    },
                };

                const paymentObject = new window.Razorpay(options);
                paymentObject.open();

            } else {
                // COD Flow
                clearCart();
                navigate('/order-success');
            }

            setLoading(false);

        } catch (err) {
            setError(err.response && err.response.data.message ? err.response.data.message : err.message);
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="container py-3xl text-center">
                <h2>Your cart is empty</h2>
                <button className="btn btn-primary mt-lg" onClick={() => navigate('/shop')}>Go Shopping</button>
            </div>
        )
    }

    return (
        <div className="checkout-page container py-2xl">
            <h1 className="mb-2xl text-center">Checkout</h1>

            {error && <div className="auth-error mb-xl">{error}</div>}

            <div className="checkout-layout">
                <div className="checkout-form-container">
                    <form onSubmit={placeOrderHandler}>
                        <div className="card mb-xl border-radius-md pt-lg">
                            <h2 className="mb-lg">1. Shipping Address</h2>
                            <div className="form-group">
                                <label className="form-label">Street Address</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    required
                                    value={shippingAddress.address}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-md">
                                <div className="form-group">
                                    <label className="form-label">City</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        required
                                        value={shippingAddress.city}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Postal Code</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        required
                                        value={shippingAddress.postalCode}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="card mb-xl border-radius-md pt-lg">
                            <h2 className="mb-lg">2. Payment Method</h2>
                            <div className="payment-options flex flex-col gap-sm">
                                <label className="payment-option">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="Razorpay"
                                        checked={paymentMethod === 'Razorpay'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <span>Pay with Razorpay (Cards, UPI, NetBanking)</span>
                                </label>
                                <label className="payment-option">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="COD"
                                        checked={paymentMethod === 'COD'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <span>Cash on Delivery (COD)</span>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full btn-large"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : `Place Order (₹${totalPrice})`}
                        </button>
                    </form>
                </div>

                <div className="checkout-summary card">
                    <h2 className="mb-xl text-lg">Order Summary</h2>
                    <div className="checkout-items mb-lg">
                        {cartItems.map((item, index) => (
                            <div key={index} className="checkout-item flex gap-md mb-md items-center">
                                <div className="checkout-item-image">
                                    <img src={item.image} alt={item.name} />
                                    <span className="checkout-item-qty">{item.qty}</span>
                                </div>
                                <div className="checkout-item-details flex-grow">
                                    <h4 className="text-sm m-0">{item.name}</h4>
                                    {item.customText && <p className="text-xs text-muted m-0 italic">"{item.customText}"</p>}
                                </div>
                                <div className="checkout-item-price font-medium">
                                    ₹{item.price * item.qty}
                                </div>
                            </div>
                        ))}
                    </div>

                    <hr className="my-md border-color-light" />

                    <div className="summary-row flex justify-between mb-sm text-sm">
                        <span className="text-muted">Subtotal</span>
                        <span className="font-medium">₹{getCartSubtotal()}</span>
                    </div>
                    <div className="summary-row flex justify-between mb-sm text-sm">
                        <span className="text-muted">Shipping</span>
                        <span className="font-medium">{shippingPrice === 0 ? 'Free' : `₹${shippingPrice}`}</span>
                    </div>
                    <div className="summary-row flex justify-between mb-sm text-sm">
                        <span className="text-muted">Estimated Tax</span>
                        <span className="font-medium">₹{taxPrice}</span>
                    </div>

                    <hr className="my-md border-color-light" />

                    <div className="summary-row flex justify-between text-lg text-primary-dark font-bold mt-md">
                        <span>Total</span>
                        <span>₹{totalPrice}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
