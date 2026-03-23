import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { getCartCount } = useContext(CartContext);
    const { user, logout } = useContext(AuthContext);

    return (
        <header className="navbar">
            <div className="container navbar-container">
                <Link to="/" className="navbar-logo">
                    Twilight<span>Star</span>
                </Link>
                <nav className="navbar-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/shop" className="nav-link">Shop</Link>
                    <Link to="/about" className="nav-link">About</Link>
                </nav>
                <div className="navbar-actions">
                    {user ? (
                        <div className="flex gap-md items-center">
                            <span className="text-sm">Hi, {user.name.split(' ')[0]}</span>
                            {user.isAdmin && <Link to="/admin" className="nav-link">Admin</Link>}
                            <button onClick={logout} className="nav-link bg-transparent border-0 cursor-pointer p-0 font-inherit">Logout</button>
                        </div>
                    ) : (
                        <Link to="/login" className="nav-link">Login</Link>
                    )}

                    <Link to="/cart" className="cart-icon">
                        Cart
                        {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
