import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS, getCategoryById } from '../data/products';
import { useState } from 'react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [toast, setToast] = useState('');

  // TODO: fetch from API — axios.get(`/api/products/${id}`)
  const product = MOCK_PRODUCTS.find(p => p._id === id);

  if (!product) return (
    <div className="empty-state" style={{ paddingTop:'8rem' }}>
      <div className="icon">🔍</div>
      <div className="title">Product not found</div>
      <button className="btn btn-clay" style={{ marginTop:'1rem' }} onClick={() => navigate('/shop')}>← Back to Shop</button>
    </div>
  );

  const cat = getCategoryById(product.category);

  const handleBuy = () => {
    // TODO: axios.post('/api/orders', { productId: product._id })
    setToast(`🎉 Order placed for "${product.name}"!`);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div style={{ minHeight:'100vh', background:'var(--cream)', padding:'2rem' }}>
      <div style={{ maxWidth:900, margin:'0 auto' }}>

        {/* Back */}
        <button className="btn btn-warm btn-sm" style={{ marginBottom:'1.5rem' }} onClick={() => navigate('/shop')}>
          ← Back to Shop
        </button>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2.5rem', alignItems:'start' }}>

          {/* IMAGE */}
          <div style={{ borderRadius:24, overflow:'hidden', background:cat.color, aspectRatio:'1', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'6rem', position:'relative' }}>
            {product.images?.[0]
              ? <img src={product.images[0]} alt={product.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              : <span>{product.emoji}</span>
            }
            <span style={{ position:'absolute', top:12, right:12, background:'rgba(250,245,237,0.92)', backdropFilter:'blur(4px)', borderRadius:20, padding:'4px 12px', fontSize:'0.72rem', fontWeight:700, color:'var(--muted)', textTransform:'uppercase' }}>
              {cat.icon} {cat.name}
            </span>
          </div>

          {/* INFO */}
          <div>
            <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'2.2rem', fontWeight:600, lineHeight:1.15, marginBottom:'0.5rem' }}>
              {product.name}
            </h1>

            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'2rem', fontWeight:600, color:'var(--clay)', marginBottom:'1rem' }}>
              ₹{product.price.toLocaleString('en-IN')}
            </div>

            <p style={{ fontSize:'0.9rem', color:'var(--muted)', lineHeight:1.7, marginBottom:'1.5rem' }}>
              {product.description}
            </p>

            {/* Details grid */}
            {[
              ['Artisan',   product.seller?.name],
              ['Village',   product.seller?.village],
              ['Technique', product.technique],
              ['Origin',    product.origin],
              ['Stock',     `${product.stock} available`],
              ['Sold',      `${product.sold} times`],
            ].map(([label, value]) => value && (
              <div key={label} style={{ display:'flex', gap:'0.6rem', marginBottom:'0.5rem', alignItems:'baseline' }}>
                <span style={{ fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--muted)', minWidth:70 }}>{label}</span>
                <span style={{ fontSize:'0.88rem', color:'var(--ink)', fontWeight:600 }}>{value}</span>
              </div>
            ))}

            {/* Tags */}
            <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap', margin:'1.2rem 0' }}>
              {product.tags?.map(tag => (
                <span key={tag} style={{ background:'var(--warm)', border:'1px solid var(--border)', borderRadius:20, padding:'3px 10px', fontSize:'0.72rem', color:'var(--muted)', fontWeight:600 }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA */}
            {product.stock > 0 ? (
              <button className="btn btn-clay btn-lg btn-full" onClick={handleBuy}>
                Buy Now — ₹{product.price.toLocaleString('en-IN')}
              </button>
            ) : (
              <div className="badge badge-red" style={{ padding:'0.6rem 1.2rem', fontSize:'0.8rem' }}>Out of Stock</div>
            )}

            <p style={{ fontSize:'0.72rem', color:'var(--muted)', marginTop:'0.7rem', textAlign:'center' }}>
              🔒 Secure payment via Razorpay
            </p>
          </div>
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
};

export default ProductDetail;
