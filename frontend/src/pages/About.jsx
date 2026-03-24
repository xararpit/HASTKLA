import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
    return (
        <>
            <Navbar />
            <div className="about-page pb-3xl">
                {/* Hero Image Section */}
                <div className="about-hero" style={{
                    height: '400px',
                    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'><rect width=\'100\' height=\'100\' fill=\'%238C5E3C\'/></svg>")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                }}>
                    <div className="text-center">
                        <h1 style={{ color: 'white', fontSize: '3rem', marginBottom: '1rem' }}>Our Story</h1>
                        <p style={{ fontSize: '1.2rem', opacity: '0.9' }}>Preserving the heritage of Indian craftsmanship.</p>
                    </div>
                </div>

                <div className="container mt-3xl">
                    <div className="grid grid-cols-2 gap-3xl items-center mb-3xl">
                        <div>
                            <h2 className="mb-lg text-primary-dark">Who We Are</h2>
                            <p className="mb-md text-muted" style={{ lineHeight: '1.8' }}>
                                Based in the heart of Jaipur, HASTKLA was born out of a profound respect for the generations-old traditions of Indian textile weaving and metalworking.
                                We are a bridge between the skilled artisans of our local villages and modern homes around the world.
                            </p>
                            <p className="text-muted" style={{ lineHeight: '1.8' }}>
                                Our mission is to provide these master craftsmen with a global platform while offering our customers affordable, premium, and ethically produced home décor that carries the warmth of a human touch.
                            </p>
                        </div>
                        <div style={{ height: '400px', backgroundColor: 'var(--color-secondary-light)', borderRadius: 'var(--radius-lg)' }}>
                            {/* Placeholder for artisan workshop image */}
                        </div>
                    </div>

                    <div className="bg-surface p-3xl border-radius-lg text-center shadow-sm">
                        <h2 className="mb-md">"Every piece we create is a piece of our culture."</h2>
                        <p className="text-muted italic">- The Artisans of HASTKLA</p>
                    </div>

                    <div className="text-center mt-3xl">
                        <Link to="/shop" className="btn btn-primary btn-large">Explore Our Crafts</Link>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default About;
