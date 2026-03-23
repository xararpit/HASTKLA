import { Link } from 'react-router-dom';

const OrderSuccess = () => {
    return (
        <div className="container py-3xl text-center" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div className="success-icon mb-lg" style={{ width: '80px', height: '80px', backgroundColor: '#e8f5e9', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 2rem' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
            <h1 className="mb-md text-primary-dark">Thank You for Your Order!</h1>
            <p className="text-muted mb-xl max-w-lg mx-auto" style={{ maxWidth: '600px' }}>
                Your order has been placed successfully. A confirmation email has been sent to your registered email address.
                Our artisans will start working on your handcrafted items soon.
            </p>
            <div className="flex gap-md justify-center mt-lg">
                <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
                <Link to="/" className="btn btn-outline">Back to Home</Link>
            </div>
        </div>
    );
};

export default OrderSuccess;
