import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const OrderSuccess = () => {
    return (
        <>
            <Navbar />
            <div className="container py-3xl text-center" style={{ minHeight: '65vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div className="success-icon mb-lg" style={{ width: '80px', height: '80px', backgroundColor: '#e8f5e9', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 2rem' }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
                <h1 className="mb-md text-primary-dark" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem' }}>Thank You for Your Order!</h1>
                <p className="text-muted mb-xl max-w-lg mx-auto" style={{ maxWidth: '600px', fontSize: '1.1rem' }}>
                    Your order has been placed successfully. A confirmation email has been sent to your registered email address.
                    Our artisans will start working on your handcrafted items soon.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                    <Link to="/shop" className="btn btn-clay">Continue Shopping</Link>
                    <Link to="/dashboard" className="btn btn-warm">View My Orders</Link>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default OrderSuccess;
