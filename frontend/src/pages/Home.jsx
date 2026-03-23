import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="container hero-content">
                    <h1>Handcrafted Elegance for Your Home</h1>
                    <p>Discover our exclusive collection of premium textile and metal décor items, ethically made by local artisans in Jaipur.</p>
                    <div className="hero-actions flex gap-md mt-lg">
                        <Link to="/shop" className="btn btn-primary">Shop Collection</Link>
                        <Link to="/about" className="btn btn-outline">Our Story</Link>
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="process bg-surface pb-3xl pt-2xl">
                <div className="container text-center">
                    <h2>The Art of Handcrafting</h2>
                    <p className="text-muted mb-xl">Every piece tells a story of tradition, skill, and passion.</p>
                    <div className="grid grid-cols-3 gap-xl">
                        <div className="process-step">
                            <div className="step-number">1</div>
                            <h3>Ethical Sourcing</h3>
                            <p>We source the finest raw materials directly from local weavers and metalworkers.</p>
                        </div>
                        <div className="process-step">
                            <div className="step-number">2</div>
                            <h3>Artisan Crafting</h3>
                            <p>Skilled artisans bring designs to life using techniques passed down through generations.</p>
                        </div>
                        <div className="process-step">
                            <div className="step-number">3</div>
                            <h3>Custom Finishing</h3>
                            <p>Each item is carefully inspected and can be personalized with engravings or embroidery.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Categories (Placeholder for visual structure) */}
            <section className="featured bg-background py-3xl">
                <div className="container">
                    <h2 className="text-center mb-2xl">Shop by Material</h2>
                    <div className="grid grid-cols-2 gap-2xl">
                        <Link to="/shop?category=Textile" className="category-card">
                            <div className="category-image textile-bg"></div>
                            <div className="category-info">
                                <h3>Textile Art</h3>
                                <p>Cushions, Throws & Wall Hangings</p>
                            </div>
                        </Link>
                        <Link to="/shop?category=Metal" className="category-card">
                            <div className="category-image metal-bg"></div>
                            <div className="category-info">
                                <h3>Metal Decor</h3>
                                <p>Lamps, Trays & Sculptures</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="testimonials bg-surface py-3xl">
                <div className="container text-center">
                    <h2 className="mb-2xl">What Our Customers Say</h2>
                    <div className="grid grid-cols-3 gap-xl text-left">
                        <div className="card">
                            <p className="italic text-muted mb-base">"The brass lamp I ordered is simply stunning. The craftsmanship is evident in every detail. It completely transformed my living room!"</p>
                            <h4 className="mt-md">- Priya S.</h4>
                        </div>
                        <div className="card">
                            <p className="italic text-muted mb-base">"I love the customized embroidered cushions. The quality of the fabric is premium and they look very elegant."</p>
                            <h4 className="mt-md">- Rahul M.</h4>
                        </div>
                        <div className="card">
                            <p className="italic text-muted mb-base">"Excellent customer service and beautiful products. Proud to support local artisans through Twilight Star."</p>
                            <h4 className="mt-md">- Anita K.</h4>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
