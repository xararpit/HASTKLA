import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    return (
        <div className="product-card card">
            <Link to={`/product/${product._id}`} className="product-image-container">
                <img src={product.images[0]} alt={product.name} className="product-image" />
                {product.isCustomizable && (
                    <span className="badge badge-customizable">Customizable</span>
                )}
            </Link>

            <div className="product-details">
                <div className="product-category text-muted text-sm">{product.category}</div>
                <Link to={`/product/${product._id}`}>
                    <h3 className="product-title">{product.name}</h3>
                </Link>
                <div className="product-footer flex justify-between items-center mt-sm">
                    <span className="product-price">₹{product.price}</span>
                    <Link to={`/product/${product._id}`} className="btn btn-outline btn-sm">
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
