import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer bg-primary">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h3>Twilight<span>Star</span></h3>
                        <p>Handcrafted textile and metal home décor items. Affordable, premium-looking, crafted by local artisans.</p>
                    </div>

                    <div className="footer-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/shop">Shop Collection</Link></li>
                            <li><Link to="/about">Our Story</Link></li>
                            <li><Link to="/contact">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h4>Customer Service</h4>
                        <ul>
                            <li><Link to="/policies">Shipping Policy</Link></li>
                            <li><Link to="/policies">Refund Policy</Link></li>
                            <li><Link to="/policies">Customization Terms</Link></li>
                        </ul>
                    </div>

                    <div className="footer-contact">
                        <h4>Connect</h4>
                        <p>Made in Jaipur</p>
                        <p>Email: hello@twilightstar.in</p>
                        <p>Phone: +91 98765 43210</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Twilight Star Handicrafts. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
