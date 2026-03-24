import { useNavigate } from 'react-router-dom'

const CATEGORIES = {
  metal:  { name:'Metalwork',        icon:'🔨', color:'#B8903A' },
  fabric: { name:'Fabric & Textile', icon:'🪡', color:'#6B4C8A' },
  decor:  { name:'Decorative Art',   icon:'🏺', color:'#C4622D' },
  clay:   { name:'Clay & Pottery',   icon:'🫙', color:'#A06040' },
  wood:   { name:'Woodcraft',        icon:'🪵', color:'#7A5B3A' },
  leath:  { name:'Leather & Bags',   icon:'👜', color:'#8B6040' },
  floral: { name:'Floral Crafts',    icon:'🌸', color:'#C8547A' },
  other:  { name:'Other',            icon:'🎁', color:'#888780' },
}

const ProductCard = ({ product, currentUserId, onBuyClick }) => {
  const navigate = useNavigate()
  const cat   = CATEGORIES[product.category] || CATEGORIES.other
  const isOwn = product.seller?._id === currentUserId
  const thumb = product.images?.[0] || null

  return (
    <div
      style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', overflow:'hidden', transition:'transform 0.22s, box-shadow 0.22s', cursor:'pointer', display:'flex', flexDirection:'column' }}
      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-5px)'; e.currentTarget.style.boxShadow='var(--shadow-lg)' }}
      onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)';    e.currentTarget.style.boxShadow='none' }}
      onClick={() => navigate(`/product/${product._id}`)}
    >
      {/* THUMBNAIL */}
      <div style={{ height:170, background:cat.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3.2rem', position:'relative', overflow:'hidden', flexShrink:0 }}>
        {thumb
          ? <img src={thumb} alt={product.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          : <span>{product.emoji}</span>
        }
        <span style={{ position:'absolute', top:8, right:8, background:'rgba(250,245,237,0.92)', backdropFilter:'blur(4px)', borderRadius:20, padding:'2px 9px', fontSize:'0.65rem', fontWeight:700, color:'var(--muted)', textTransform:'uppercase' }}>
          {cat.icon} {cat.name}
        </span>
        {product.stock > 0 && product.stock <= 3 && (
          <span style={{ position:'absolute', top:8, left:8, background:'rgba(196,55,45,0.88)', color:'#fff', borderRadius:20, padding:'2px 8px', fontSize:'0.6rem', fontWeight:700 }}>
            Only {product.stock} left!
          </span>
        )}
        {product.stock === 0 && (
          <div style={{ position:'absolute', inset:0, background:'rgba(26,21,16,0.55)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:'0.85rem', letterSpacing:'0.1em' }}>
            SOLD OUT
          </div>
        )}
      </div>

      {/* BODY */}
      <div style={{ padding:'1rem 1.1rem', flex:1, display:'flex', flexDirection:'column', gap:'0.28rem' }}>
        <div style={{ fontWeight:700, fontSize:'0.92rem', lineHeight:1.3 }}>{product.name}</div>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.3rem', fontWeight:600, color:'var(--clay)' }}>
          ₹{product.price?.toLocaleString('en-IN')}
        </div>
        <div style={{ fontSize:'0.72rem', color:'var(--muted)' }}>by {product.seller?.name} · {product.technique}</div>
        <div style={{ fontSize:'0.76rem', color:'var(--muted)', lineHeight:1.45, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
          {product.description}
        </div>
        <div style={{ display:'flex', gap:'0.3rem', flexWrap:'wrap', marginTop:'0.2rem' }}>
          {product.tags?.slice(0,3).map(t => (
            <span key={t} style={{ background:'var(--warm)', borderRadius:20, padding:'2px 7px', fontSize:'0.62rem', color:'var(--muted)', fontWeight:600 }}>{t}</span>
          ))}
        </div>

        {/* ACTIONS */}
        <div style={{ marginTop:'auto', paddingTop:'0.8rem', display:'flex', gap:'0.4rem', alignItems:'center' }}
          onClick={e => e.stopPropagation()}>
          {isOwn ? (
            <>
              <span className="badge badge-blue">Your listing</span>
              <span style={{ marginLeft:'auto', fontSize:'0.68rem', color:'var(--muted)' }}>{product.sold || 0} sold</span>
            </>
          ) : product.stock > 0 ? (
            <>
              <button className="btn btn-clay btn-sm"  onClick={() => onBuyClick && onBuyClick(product)}>Buy Now</button>
              <button className="btn btn-warm btn-sm"  onClick={() => navigate(`/product/${product._id}`)}>Details</button>
            </>
          ) : (
            <span className="badge badge-red">Out of stock</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard