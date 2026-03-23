import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './Shop.css';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [searchFilter, setSearchFilter] = useState('');

    const location = useLocation();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const queryParams = new URLSearchParams(location.search);
                const category = queryParams.get('category') || categoryFilter;
                let url = '/api/products';

                let queryArray = [];
                if (category) queryArray.push(`category=${category}`);
                if (searchFilter) queryArray.push(`keyword=${searchFilter}`);

                if (queryArray.length > 0) {
                    url += `?${queryArray.join('&')}`;
                }

                const { data } = await axios.get(url);
                setProducts(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProducts();
    }, [location.search, categoryFilter, searchFilter]);

    return (
        <div className="shop-page container py-2xl">
            <h1 className="text-center mb-xl">Our Collection</h1>

            <div className="shop-layout">
                <aside className="shop-sidebar">
                    <div className="filter-group mb-lg">
                        <h3 className="mb-md">Search</h3>
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="form-control"
                            value={searchFilter}
                            onChange={(e) => setSearchFilter(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <h3 className="mb-md">Categories</h3>
                        <ul className="category-list">
                            <li>
                                <button
                                    className={`filter-btn ${categoryFilter === '' ? 'active' : ''}`}
                                    onClick={() => setCategoryFilter('')}
                                >
                                    All Products
                                </button>
                            </li>
                            <li>
                                <button
                                    className={`filter-btn ${categoryFilter === 'Textile' ? 'active' : ''}`}
                                    onClick={() => setCategoryFilter('Textile')}
                                >
                                    Textile Art
                                </button>
                            </li>
                            <li>
                                <button
                                    className={`filter-btn ${categoryFilter === 'Metal' ? 'active' : ''}`}
                                    onClick={() => setCategoryFilter('Metal')}
                                >
                                    Metal Decor
                                </button>
                            </li>
                        </ul>
                    </div>
                </aside>

                <main className="shop-content">
                    {loading ? (
                        <div className="text-center py-2xl">Loading products...</div>
                    ) : error ? (
                        <div className="text-center text-accent py-2xl">{error}</div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-2xl">No products found.</div>
                    ) : (
                        <div className="product-grid grid grid-cols-3 gap-lg">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Shop;
