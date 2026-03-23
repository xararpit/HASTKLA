import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Admin.css';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('products');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user || !user.isAdmin) {
            navigate('/');
            return;
        }

        const fetchData = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                const [{ data: productsData }, { data: ordersData }] = await Promise.all([
                    axios.get('/api/products', config),
                    axios.get('/api/orders', config)
                ]);

                setProducts(productsData);
                setOrders(ordersData);
                setLoading(false);
            } catch (err) {
                setError(err.response && err.response.data.message ? err.response.data.message : err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [user, navigate]);

    const deleteProductHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };
                await axios.delete(`/api/products/${id}`, config);
                setProducts(products.filter(p => p._id !== id));
            } catch (err) {
                alert(err.response && err.response.data.message ? err.response.data.message : err.message);
            }
        }
    };

    const createProductHandler = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const { data } = await axios.post('/api/products', {}, config);
            navigate(`/admin/product/${data._id}/edit`);
        } catch (err) {
            alert(err.response && err.response.data.message ? err.response.data.message : err.message);
        }
    };

    const updateOrderStatus = async (id, status) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
            };
            await axios.put(`/api/orders/${id}/status`, { status }, config);

            // Refresh orders locally
            setOrders(orders.map(o => o._id === id ? { ...o, status } : o));
        } catch (err) {
            alert(err.response && err.response.data.message ? err.response.data.message : err.message);
        }
    };

    if (loading) return <div className="container py-3xl text-center">Loading Dashboard...</div>;
    if (error) return <div className="container py-3xl text-center text-accent">{error}</div>;

    return (
        <div className="admin-page container py-2xl">
            <h1 className="mb-2xl text-center">Admin Dashboard</h1>

            <div className="admin-tabs flex justify-center gap-md mb-xl">
                <button
                    className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setActiveTab('products')}
                >
                    Products ({products.length})
                </button>
                <button
                    className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setActiveTab('orders')}
                >
                    Orders ({orders.length})
                </button>
            </div>

            <div className="admin-content card">
                {activeTab === 'products' ? (
                    <div>
                        <div className="flex justify-between items-center mb-lg">
                            <h2>Products Management</h2>
                            <button className="btn btn-primary btn-sm" onClick={createProductHandler}>
                                + Create Product
                            </button>
                        </div>
                        <div className="table-responsive">
                            <table className="admin-table w-full text-left">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>NAME</th>
                                        <th>PRICE</th>
                                        <th>CATEGORY</th>
                                        <th>STOCK</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product._id}>
                                            <td className="text-sm font-mono">{product._id.substring(0, 8)}...</td>
                                            <td>{product.name}</td>
                                            <td>₹{product.price}</td>
                                            <td>{product.category}</td>
                                            <td>{product.stock}</td>
                                            <td>
                                                <div className="flex gap-sm">
                                                    <Link to={`/admin/product/${product._id}/edit`} className="btn btn-outline btn-sm">Edit</Link>
                                                    <button
                                                        className="btn btn-outline btn-sm text-accent"
                                                        style={{ borderColor: 'var(--color-accent)' }}
                                                        onClick={() => deleteProductHandler(product._id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h2 className="mb-lg">Orders Management</h2>
                        <div className="table-responsive">
                            <table className="admin-table w-full text-left">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>USER</th>
                                        <th>DATE</th>
                                        <th>TOTAL</th>
                                        <th>PAID</th>
                                        <th>STATUS</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order._id}>
                                            <td className="text-sm font-mono">{order._id.substring(0, 8)}...</td>
                                            <td>{order.user && order.user.name}</td>
                                            <td>{order.createdAt.substring(0, 10)}</td>
                                            <td>₹{order.totalPrice}</td>
                                            <td>
                                                {order.isPaid ? (
                                                    <span className="text-success text-sm">Yes ({order.paidAt.substring(0, 10)})</span>
                                                ) : (
                                                    <span className="text-accent text-sm">No</span>
                                                )}
                                            </td>
                                            <td>
                                                <span className={`status-badge status-${order.status.toLowerCase()}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td>
                                                <select
                                                    className="form-control btn-sm py-xs"
                                                    value={order.status}
                                                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Processing">Processing</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
