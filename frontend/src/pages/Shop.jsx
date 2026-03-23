import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import { MOCK_PRODUCTS } from '../data/products';

const SORT_OPTIONS = [
  { value:'newest',     label:'Newest First' },
  { value:'price_asc',  label:'Price: Low → High' },
  { value:'price_desc', label:'Price: High → Low' },
  { value:'popular',    label:'Most Popular' },
];

const BuyModal = ({ product, onConfirm, onClose }) => {
  if (!product) return null;
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(26,21,16,0.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background:'var(--cream)', borderRadius:24, padding:'2rem', maxWidth:400, width:'100%', boxShadow:'var(--shadow-lg)' }}>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:600, marginBottom:'0.4rem' }}>Confirm Purchase</h2>
        <p style={{ fontSize:'0.85rem', color:'var(--muted)', marginBottom:'1.4rem', lineHeight:1.6 }}>
          Payment will be processed securely via Razorpay.
        </p>
        <div style={{ display:'flex', alignItems:'center', gap:'0.9rem', background:'var(--warm)', borderRadius:12, padding:'1rem', marginBottom:'1.5rem' }}>
          <div style={{ width:52, height:52, borderRadius:10, background:'var(--clay)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.6rem', flexShrink:0 }}>
            {product.emoji}
          </div>
          <div>
            <div style={{ fontWeight:700, fontSize:'0.9rem' }}>{product.name}</div>
            <div style={{ fontSize:'0.72rem', color:'var(--muted)' }}>by {product.seller?.name}</div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:600, color:'var(--clay)', fontSize:'1.2rem' }}>
              ₹{product.price.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
        <div style={{ display:'flex', gap:'0.7rem', justifyContent:'flex-end' }}>
          <button className="btn btn-warm" onClick={onClose}>Cancel</button>
          <button className="btn btn-clay" onClick={() => onConfirm(product)}>Confirm & Pay →</button>
        </div>
      </div>
    </div>
  );
};

const Shop = () => {
  const currentUserId = localStorage.getItem('userId') || null;
  const [query,    setQuery]    = useState('');
  const [category, setCategory] = useState('all');
  const [sort,     setSort]     = useState('newest');
  const [buyModal, setBuyModal] = useState(null);
  const [toast,    setToast]    = useState('');

  // ── swap MOCK_PRODUCTS with: const [products, setProducts] = useState([])
  // ── then useEffect(() => axios.get('/api/products').then(r => setProducts(r.data)), [])
  const products = MOCK_PRODUCTS;

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3200); };

  const visible = useMemo(() => {
    let list = products.filter(p => p.approved);
    if (category !== 'all') list = list.filter(p => p.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.technique?.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q)) ||
        p.seller?.name.toLowerCase().includes(q)
      );
    }
    if (sort === 'price_asc')  return [...list].sort((a,b) => a.price - b.price);
    if (sort === 'price_desc') return [...list].sort((a,b) => b.price - a.price);
    if (sort === 'popular')    return [...list].sort((a,b) => b.sold - a.sold);
    return [...list].sort((a,b) => b.createdAt?.localeCompare(a.createdAt));
  }, [products, query, category, sort]);

  const handleBuyConfirm = (product) => {
    // TODO: axios.post('/api/orders', { productId: product._id })
    setBuyModal(null);
    showToast(`🎉 Order placed! "${product.name}" is on its way.`);
  };

  return (
    <div style={{ minHeight:'100vh', background:'var(--cream)' }}>

      {/* HEADER */}
      <div style={{ background:'var(--warm)', borderBottom:'1px solid var(--border)', padding:'2.5rem 2rem 2rem' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <span style={{ fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--clay)', background:'rgba(196,98,45,0.1)', borderRadius:30, padding:'0.3rem 0.9rem' }}>
            ✦ Village to World
          </span>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(2rem,4vw,3rem)', fontWeight:300, lineHeight:1.1, margin:'0.5rem 0' }}>
            Handmade <em style={{ fontStyle:'italic', color:'var(--clay)' }}>with heart</em>
          </h1>
          <p style={{ fontSize:'0.9rem', color:'var(--muted)', marginBottom:'1.5rem' }}>
            {products.length} products from artisans across India
            &nbsp;·&nbsp; <span style={{ color:'var(--floral)', fontWeight:700 }}>🌸 Floral Crafts available</span>
          </p>
          {/* Search + Sort */}
          <div style={{ display:'flex', gap:'0.8rem', flexWrap:'wrap', alignItems:'center' }}>
            <div className="search-bar" style={{ flex:'1 1 260px', maxWidth:420 }}>
              <span style={{ color:'var(--muted)' }}>🔍</span>
              <input placeholder="Search by name, craft, artisan, tag…" value={query} onChange={e => setQuery(e.target.value)} />
              {query && <button style={{ border:'none', background:'none', cursor:'pointer', color:'var(--muted)', fontSize:'1rem' }} onClick={() => setQuery('')}>×</button>}
            </div>
            <select className="form-select" style={{ width:'auto', padding:'0.5rem 1rem' }} value={sort} onChange={e => setSort(e.target.value)}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'1.8rem 2rem 4rem' }}>
        <CategoryFilter active={category} onChange={setCategory} />

        <div style={{ fontSize:'0.75rem', color:'var(--muted)', marginBottom:'1rem' }}>
          Showing <strong>{visible.length}</strong> products
          {query && <> for "<strong>{query}</strong>"</>}
        </div>

        {visible.length > 0 ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:'1.1rem' }}>
            {visible.map(p => (
              <ProductCard
                key={p._id}
                product={p}
                currentUserId={currentUserId}
                onBuyClick={setBuyModal}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="icon">🛍️</div>
            <div className="title">No products found</div>
            <div className="sub">Try a different search term or category filter.</div>
          </div>
        )}
      </div>

      <BuyModal product={buyModal} onConfirm={handleBuyConfirm} onClose={() => setBuyModal(null)} />
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
};

export default Shop;
