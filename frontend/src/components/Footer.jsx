import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer style={{
            background: 'var(--color-primary-dark, #2D1E12)',
            color: 'white',
            padding: '4rem 2rem 2.5rem',
            marginTop: 'auto',
            textAlign: 'center'
        }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    gap: '2rem',
                    marginBottom: '3rem',
                    textAlign: 'left'
                }}>
                    <div style={{ flex: '1 1 280px' }}>
                        <h2 style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: '1.8rem',
                            marginBottom: '1rem',
                            letterSpacing: '0.05em'
                        }}>
                            HAST<span style={{ color: 'var(--color-accent, #C4622D)' }}>KLA</span>
                        </h2>
                        <p style={{ fontSize: '0.88rem', opacity: 0.7, lineHeight: 1.6, maxWidth: 300 }}>
                            Preserving India's rich heritage by bringing handcrafted village treasures directly to your home.
                        </p>
                    </div>

                    <div style={{ flex: '1 1 120px' }}>
                        <h4 style={{ textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.1em', marginBottom: '1.2rem', color: 'var(--color-accent, #C4622D)' }}>Explore</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                            <Link to="/shop" style={{ color: 'white', textDecoration: 'none', fontSize: '0.9rem', opacity: 0.8 }}>View All Crafts</Link>
                            <Link to="/about" style={{ color: 'white', textDecoration: 'none', fontSize: '0.9rem', opacity: 0.8 }}>Our Story</Link>
                            <Link to="/contact" style={{ color: 'white', textDecoration: 'none', fontSize: '0.9rem', opacity: 0.8 }}>Contact Us</Link>
                        </div>
                    </div>

                    <div style={{ flex: '1 1 120px' }}>
                        <h4 style={{ textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.1em', marginBottom: '1.2rem', color: 'var(--color-accent, #C4622D)' }}>Customer Care</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                            <Link to="/policies" style={{ color: 'white', textDecoration: 'none', fontSize: '0.9rem', opacity: 0.8 }}>Store Policies</Link>
                            <Link to="/cart" style={{ color: 'white', textDecoration: 'none', fontSize: '0.9rem', opacity: 0.8 }}>Shopping Cart</Link>
                        </div>
                    </div>

                    <div style={{ flex: '1 1 200px' }}>
                        <h4 style={{ textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.1em', marginBottom: '1.2rem', color: 'var(--color-accent, #C4622D)' }}>Newsletter</h4>
                        <p style={{ fontSize: '0.72rem', opacity: 0.7, marginBottom: '0.8rem' }}>Stay updated on new collections.</p>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                placeholder="Email"
                                style={{
                                    flex: 1,
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 4,
                                    padding: '0.4rem 0.8rem',
                                    color: 'white',
                                    fontSize: '0.8rem'
                                }}
                            />
                            <button className="btn btn-clay btn-sm">Join</button>
                        </div>
                    </div>
                </div>

                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    paddingTop: '2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    fontSize: '0.75rem',
                    opacity: 0.5
                }}>
                    <div>© {currentYear} HASTKLA Artisans Guild. All rights reserved.</div>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <span>Instagram</span>
                        <span>Twitter</span>
                        <span>Facebook</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
