import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [qty, setQty] = useState(1);
    const [customText, setCustomText] = useState('');
    const [mainImage, setMainImage] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/api/products/${id}`);
                setProduct(data);
                setMainImage(data.images[0]);
                setLoading(false);
            } catch (err) {
                setError(err.response && err.response.data.message ? err.response.data.message : err.message);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product, qty, customText);
        navigate('/cart');
    };

    const handleWhatsAppInquiry = () => {
        const message = `Hi, I am interested in the ${product.name}. Could you provide more details?`;
        const encodedMessage = encodeURIComponent(message);
        // Using a dummy number for the brand
        window.open(`https://wa.me/919876543210?text=${encodedMessage}`, '_blank');
    }

    if (loading) return <div className="container py-3xl text-center">Loading product details...</div>;
    if (error) return <div className="container py-3xl text-center text-accent">{error}</div>;
    if (!product) return null;

    return (
        <div className="product-detail-page container py-2xl">
            <button className="btn btn-outline mb-xl" onClick={() => navigate(-1)}>
                &larr; Back to Shop
            </button>

            <div className="product-detail-grid grid grid-cols-2 gap-2xl">
                {/* Image Gallery */}
                <div className="product-gallery">
                    <div className="main-image-container">
                        <img src={mainImage} alt={product.name} className="main-image" />
                    </div>
                    {product.images.length > 1 && (
                        <div className="thumbnail-grid flex gap-sm mt-md">
                            {product.images.map((img, index) => (
                                <div
                                    key={index}
                                    className={`thumbnail ${mainImage === img ? 'active' : ''}`}
                                    onClick={() => setMainImage(img)}
                                >
                                    <img src={img} alt={`${product.name} thumbnail ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="product-info">
                    <div className="text-muted text-sm mb-xs uppercase spacing-wide">{product.category}</div>
                    <h1 className="product-h1 mb-sm">{product.name}</h1>
                    <div className="product-price-large mb-lg">₹{product.price}</div>

                    <p className="product-description mb-xl">{product.description}</p>

                    <div className="product-meta grid grid-cols-2 gap-md mb-xl p-md bg-surface border-radius-md">
                        <div><span className="font-medium">Material:</span> {product.material}</div>
                        <div><span className="font-medium">Size:</span> {product.size}</div>
                        <div><span className="font-medium">Crafted in:</span> Jaipur</div>
                        <div><span className="font-medium">Delivery:</span> {product.deliveryTime}</div>
                    </div>

                    <div className="stock-status mb-lg">
                        {product.stock > 0 ? (
                            <span className="text-success">In Stock</span>
                        ) : (
                            <span className="text-accent">Made to Order (Takes 4-5 Days)</span>
                        )}
                    </div>

                    <div className="purchase-options flex flex-col gap-md">
                        <div className="qty-selector flex items-center gap-md">
                            <label className="font-medium">Quantity:</label>
                            <select
                                value={qty}
                                onChange={(e) => setQty(Number(e.target.value))}
                                className="form-control w-auto"
                            >
                                {[...Array(product.stock > 0 ? Math.min(product.stock, 5) : 5).keys()].map((x) => (
                                    <option key={x + 1} value={x + 1}>
                                        {x + 1}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {product.isCustomizable && (
                            <div className="customization-field mt-sm">
                                <label className="form-label">{product.customizationOptions || 'Add custom text/name (Optional)'}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. Ramesh Family"
                                    value={customText}
                                    onChange={(e) => setCustomText(e.target.value)}
                                    maxLength={20}
                                />
                            </div>
                        )}

                        <div className="action-buttons flex gap-md mt-md">
                            <button
                                className="btn btn-primary w-full"
                                onClick={handleAddToCart}
                            >
                                Add to Cart
                            </button>
                            <button
                                className="btn btn-outline w-full whatsapp-btn"
                                onClick={handleWhatsAppInquiry}
                            >
                                Inquire on WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
