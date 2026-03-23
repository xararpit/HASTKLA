import { useNavigate } from 'react-router-dom';
import { getCategoryById } from '../data/products';

const ProductCard = ({ product, currentUserId, onBuyClick }) => {
  const navigate = useNavigate();
  const cat = getCategoryById(product.category);
  const isOwn = product.seller?._id === currentUserId;
  const thumb = product.images?.[0] || null;

  return (
    <div
      style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', overflow:'hidden', transition:'transform 0.22s, box-shadow 0.22s', cursor:'pointer', display:'flex', flexDirection:'column' }}
      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-5px)'; e.currentTarget.style.boxShadow='var(--shadow-lg)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)';    e.currentTarget.style.boxShadow='none'; }}
      onClick={() => navigate(`/product/${product._id}`)}
    >
      {/* THUMBNAIL */}
      <div style={{ height:170, background:cat.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3.4rem', position:'relative', overflow:'hidden', flexShrink:0 }}>
        {thumb
          ? <img src={thumb} alt={product.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          : <span>{product.emoji}</span>
        }
        {/* Category badge */}
        <span style={{ position:'absolute', top:8, right:8, background:'rgba(250,245,237,0.92)', backdropFilter:'blur(4px)', borderRadius:20, padding:'2px 9px', fontSize:'0.65rem', fontWeight:700, color:'var(--muted)', textTransform:'uppercase' }}>
          {cat.icon} {cat.name}
        </span>
        {/* Low stock */}
        {product.stock <= 3 && product.stock > 0 && (
          <span style={{ position:'absolute', top:8, left:8, background:'rgba(196,55,45,0.88)', color:'#fff', borderRadius:20, padding:'2px 8px', fontSize:'0.6rem', fontWeight:700 }}>
            Only {product.stock} left!
          </span>
        )}
        {/* Sold out */}
        {product.stock === 0 && (
          <div style={{ position:'absolute', inset:0, background:'rgba(26,21,16,0.55)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:'0.85rem', letterSpacing:'0.1em', textTransform:'uppercase' }}>
            Sold Out
          </div>
        )}
      </div>

      {/* BODY */}
      <div style={{ padding:'1rem 1.1rem', flex:1, display:'flex', flexDirection:'column', gap:'0.3rem' }}>
        <div style={{ fontWeight:700, fontSize:'0.92rem', lineHeight:1.3 }}>{product.name}</div>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.3rem', fontWeight:600, color:'var(--clay)' }}>
          ₹{product.price.toLocaleString('en-IN')}
        </div>
        <div style={{ fontSize:'0.72rem', color:'var(--muted)' }}>
          by {product.seller?.name} · {product.technique}
        </div>
        <div style={{ fontSize:'0.76rem', color:'var(--muted)', lineHeight:1.45, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
          {product.description}
        </div>
        {/* Tags */}
        <div style={{ display:'flex', gap:'0.3rem', flexWrap:'wrap', marginTop:'0.2rem' }}>
          {product.tags?.slice(0,3).map(tag => (
            <span key={tag} style={{ background:'var(--warm)', borderRadius:20, padding:'2px 7px', fontSize:'0.62rem', color:'var(--muted)', fontWeight:600 }}>
              {tag}
            </span>
          ))}
        </div>
        {/* Action row */}
        <div style={{ marginTop:'auto', paddingTop:'0.8rem', display:'flex', gap:'0.4rem', alignItems:'center' }}
          onClick={e => e.stopPropagation()}>
          {isOwn ? (
            <span className="badge badge-blue">Your listing</span>
          ) : product.stock > 0 ? (
            <>
              <button className="btn btn-clay btn-sm" onClick={() => onBuyClick && onBuyClick(product)}>Buy Now</button>
              <button className="btn btn-warm btn-sm"  onClick={() => navigate(`/product/${product._id}`)}>Details</button>
            </>
          ) : (
            <span className="badge badge-red">Out of stock</span>
          )}
          {isOwn && <span style={{ marginLeft:'auto', fontSize:'0.68rem', color:'var(--muted)' }}>{product.sold} sold</span>}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
