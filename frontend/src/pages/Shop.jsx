import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import CategoryFilter from '../components/CategoryFilter'
import { MOCK_PRODUCTS } from '../data/products'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'

const SORT_OPTIONS = [
  { value:'newest',     label:'Newest First' },
  { value:'price_asc',  label:'Price: Low → High' },
  { value:'price_desc', label:'Price: High → Low' },
  { value:'popular',    label:'Most Popular' },
]

const BuyModal = ({ product, onConfirm, onClose }) => {
  if (!product) return null
  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-box">
        <div className="modal-title">Confirm Purchase</div>
        <div className="modal-sub">Payment will be processed securely via Razorpay.</div>
        <div style={{ display:'flex', alignItems:'center', gap:'0.9rem', background:'var(--warm)', borderRadius:12, padding:'1rem', marginBottom:'1.5rem' }}>
          <div style={{ width:52, height:52, borderRadius:10, background:'var(--clay)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.6rem', flexShrink:0 }}>
            {product.emoji}
          </div>
          <div>
            <div style={{ fontWeight:700, fontSize:'0.9rem' }}>{product.name}</div>
            <div style={{ fontSize:'0.72rem', color:'var(--muted)' }}>by {product.seller?.name}</div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:600, color:'var(--clay)', fontSize:'1.2rem' }}>
              ₹{product.price?.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
        <div style={{ display:'flex', gap:'0.7rem', justifyContent:'flex-end' }}>
          <button className="btn btn-warm" onClick={onClose}>Cancel</button>
          <button className="btn btn-clay" onClick={() => onConfirm(product)}>Confirm & Pay →</button>
        </div>
      </div>
    </div>
  )
}

const Shop = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [query,    setQuery]    = useState('')
  const [category, setCategory] = useState('all')
  const [sort,     setSort]     = useState('newest')
  const [buyModal, setBuyModal] = useState(null)
  const [toast,    setToast]    = useState('')

  // TODO: replace with API call
  // useEffect(() => { axios.get('/api/products').then(r => setProducts(r.data)) }, [])
  const products = MOCK_PRODUCTS

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3200) }

  const visible = useMemo(() => {
    let list = products.filter(p => p.approved)
    if (category !== 'all') list = list.filter(p => p.category === category)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.technique?.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q)) ||
        p.seller?.name.toLowerCase().includes(q)
      )
    }
    const sorted = [...list]
    if (sort === 'price_asc')  sorted.sort((a,b) => a.price - b.price)
    if (sort === 'price_desc') sorted.sort((a,b) => b.price - a.price)
    if (sort === 'popular')    sorted.sort((a,b) => b.sold - a.sold)
    if (sort === 'newest')     sorted.sort((a,b) => b.createdAt?.localeCompare(a.createdAt))
    return sorted
  }, [products, query, category, sort])

  const handleBuyConfirm = (product) => {
    if (!user) { navigate('/login'); return }
    // TODO: axios.post('/api/orders', { productId: product._id })
    setBuyModal(null)
    showToast(`🎉 Order placed! "${product.name}" is on its way.`)
  }

  return (
    <>
      <Navbar />
      <div style={{ minHeight:'100vh', background:'var(--cream)' }}>

        {/* HEADER */}
        <div style={{ background:'var(--warm)', borderBottom:'1px solid var(--border)', padding:'2.5rem 2rem 2rem' }}>
          <div style={{ maxWidth:1100, margin:'0 auto' }}>
            <span style={{ fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--clay)', background:'rgba(196,98,45,0.1)', borderRadius:30, padding:'0.3rem 0.9rem' }}>
              ✦ Village to World · Free for every artisan
            </span>
            <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(2rem,4vw,3rem)', fontWeight:300, lineHeight:1.1, margin:'0.5rem 0' }}>
              Handmade <em style={{ fontStyle:'italic', color:'var(--clay)' }}>with heart</em>
            </h1>
            <p style={{ fontSize:'0.9rem', color:'var(--muted)', marginBottom:'1.5rem' }}>
              {products.length} products from artisans across India &nbsp;·&nbsp;
              <span style={{ color:'var(--floral)', fontWeight:700 }}>🌸 Floral Crafts available</span>
            </p>
            <div style={{ display:'flex', gap:'0.8rem', flexWrap:'wrap', alignItems:'center' }}>
              <div className="search-bar" style={{ flex:'1 1 260px', maxWidth:420 }}>
                <span style={{ color:'var(--muted)' }}>🔍</span>
                <input placeholder="Search name, craft, artisan, tag…" value={query} onChange={e => setQuery(e.target.value)} />
                {query && <button style={{ border:'none', background:'none', cursor:'pointer', color:'var(--muted)', fontSize:'1.1rem' }} onClick={() => setQuery('')}>×</button>}
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
            {query && <> matching "<strong>{query}</strong>"</>}
          </div>

          {visible.length > 0 ? (
            <div className="product-grid">
              {visible.map(p => (
                <ProductCard key={p._id} product={p} currentUserId={user?._id} onBuyClick={setBuyModal} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="icon">🛍️</div>
              <div className="title">No products found</div>
              <div className="sub">Try a different search or category.</div>
            </div>
          )}
        </div>
      </div>

      <BuyModal product={buyModal} onConfirm={handleBuyConfirm} onClose={() => setBuyModal(null)} />
      {toast && <div className="toast">{toast}</div>}
      <Footer />
    </>
  )
}

export default Shop