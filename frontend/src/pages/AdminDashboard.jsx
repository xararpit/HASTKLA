import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MOCK_PRODUCTS } from '../data/products'

const MOCK_USERS = [
  { _id:'u1', name:'Rameshwar Das', email:'ram@village.in',    village:'Jaipur, RJ',  craft:'Metalwork',       role:'user', balance:8500 },
  { _id:'u2', name:'Savitri Kanwar',email:'savitri@village.in',village:'Bhopal, MP',  craft:'Fabric & Floral', role:'user', balance:12000 },
  { _id:'u3', name:'Priya Meena',   email:'priya@village.in',  village:'Agra, UP',    craft:'Clay & Pottery',  role:'user', balance:5500 },
  { _id:'u4', name:'Mohan Singh',   email:'mohan@village.in',  village:'Jodhpur, RJ', craft:'Woodcraft',       role:'user', balance:3200 },
]

const MOCK_ORDERS = [
  { _id:'o1', productName:'Brass Ganesha Idol',       emoji:'🔱', buyer:'Savitri Kanwar', seller:'Rameshwar Das', amount:1200, status:'delivered', date:'2025-02-01' },
  { _id:'o2', productName:'Chanderi Silk Saree',       emoji:'🎋', buyer:'Priya Meena',    seller:'Savitri Kanwar',amount:3400, status:'shipped',   date:'2025-02-10' },
  { _id:'o3', productName:'Dried Marigold Wreath',     emoji:'🌸', buyer:'Mohan Singh',    seller:'Savitri Kanwar',amount:450,  status:'delivered', date:'2025-02-20' },
  { _id:'o4', productName:'Terracotta Wall Panel',     emoji:'🎨', buyer:'Rameshwar Das',  seller:'Priya Meena',   amount:850,  status:'delivered', date:'2025-03-01' },
  { _id:'o5', productName:'Pressed Wildflower Frame',  emoji:'🌼', buyer:'Rameshwar Das',  seller:'Priya Meena',   amount:320,  status:'processing',date:'2025-03-05' },
  { _id:'o6', productName:'Carved Sheesham Box',       emoji:'📦', buyer:'Priya Meena',    seller:'Mohan Singh',   amount:950,  status:'shipped',   date:'2025-03-10' },
]

const statusBadge = (s) => {
  const map = { delivered:'badge-green', shipped:'badge-blue', processing:'badge-orange', cancelled:'badge-red', pending:'badge-muted' }
  return <span className={`badge ${map[s] || 'badge-muted'}`}>{s}</span>
}

const AdminDashboard = () => {
  const { logout } = useAuth()
  const navigate   = useNavigate()
  const [tab, setTab] = useState('overview')

  const products = MOCK_PRODUCTS
  const totalRevenue = MOCK_ORDERS.reduce((a,o) => a + o.amount, 0)

  const TABS = [
    { id:'overview', icon:'📊', label:'Overview' },
    { id:'products', icon:'🏺', label:'Products' },
    { id:'users',    icon:'👥', label:'Users' },
    { id:'orders',   icon:'📋', label:'Orders' },
  ]

  const CATS = [
    { id:'metal',  name:'Metalwork',        icon:'🔨' },
    { id:'fabric', name:'Fabric & Textile', icon:'🪡' },
    { id:'decor',  name:'Decorative Art',   icon:'🏺' },
    { id:'clay',   name:'Clay & Pottery',   icon:'🫙' },
    { id:'wood',   name:'Woodcraft',        icon:'🪵' },
    { id:'leath',  name:'Leather & Bags',   icon:'👜' },
    { id:'floral', name:'Floral Crafts',    icon:'🌸' },
    { id:'other',  name:'Other',            icon:'🎁' },
  ]

  return (
    <div className="shell">

      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="sb-logo">HAST<span>KLA</span></div>
        <div className="sb-user">
          <div className="avatar av-sm" style={{ background:'var(--indigo)', width:32, height:32, fontSize:'0.7rem' }}>AD</div>
          <div>
            <div className="sb-uname">Admin</div>
            <div className="sb-utag">Platform Manager</div>
          </div>
        </div>
        <div className="sb-nav">
          {TABS.map(t => (
            <div key={t.id} className={`sbi${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
              <span>{t.icon}</span> {t.label}
            </div>
          ))}
          <div style={{ height:1, background:'rgba(255,255,255,0.07)', margin:'0.6rem 0' }} />
          <div className="sbi" onClick={() => navigate('/shop')}>
            <span>🛍️</span> View Shop
          </div>
        </div>
        <div className="sb-logout">
          <button onClick={() => { logout(); navigate('/login') }}>← Log Out</button>
        </div>
      </div>

      {/* MAIN */}
      <div className="shell-main">
        <div className="page-head" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <h1>
              {tab === 'overview' && 'Platform Overview'}
              {tab === 'products' && 'All Products'}
              {tab === 'users'    && 'Registered Users'}
              {tab === 'orders'   && 'All Orders'}
            </h1>
            <p>HASTKLA Admin Panel · Full platform control</p>
          </div>
          <span className="badge badge-blue" style={{ marginTop:'0.3rem' }}>Admin</span>
        </div>
        <div className="page-body">

          {/* ── OVERVIEW ── */}
          {tab === 'overview' && (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-num" style={{ color:'var(--clay)' }}>{MOCK_USERS.length}</div>
                  <div className="stat-lbl">Artisans</div>
                </div>
                <div className="stat-card">
                  <div className="stat-num" style={{ color:'var(--indigo)' }}>{products.length}</div>
                  <div className="stat-lbl">Products</div>
                </div>
                <div className="stat-card">
                  <div className="stat-num" style={{ color:'var(--ok)' }}>₹{totalRevenue.toLocaleString('en-IN')}</div>
                  <div className="stat-lbl">Total Revenue</div>
                </div>
                <div className="stat-card">
                  <div className="stat-num" style={{ color:'var(--saffron)' }}>{MOCK_ORDERS.length}</div>
                  <div className="stat-lbl">Orders</div>
                </div>
              </div>

              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.4rem', fontWeight:600, marginBottom:'1rem' }}>Products by Category</h2>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))', gap:'0.8rem', marginBottom:'2rem' }}>
                {CATS.map(c => {
                  const count = products.filter(p => p.category === c.id).length
                  return (
                    <div key={c.id} style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', padding:'0.9rem 1rem', display:'flex', alignItems:'center', gap:'0.75rem' }}>
                      <div style={{ width:36, height:36, borderRadius:9, background:'var(--warm)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', flexShrink:0 }}>{c.icon}</div>
                      <div>
                        <div style={{ fontWeight:700, fontSize:'0.8rem', lineHeight:1.2 }}>{c.name}</div>
                        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.3rem', fontWeight:600, color:'var(--clay)' }}>{count}</div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.4rem', fontWeight:600, marginBottom:'1rem' }}>Recent Orders</h2>
              <div className="table-card">
                <table className="data-table">
                  <thead><tr><th>Product</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {MOCK_ORDERS.slice().reverse().slice(0,5).map(o => (
                      <tr key={o._id}>
                        <td><div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}><span>{o.emoji}</span><span style={{ fontWeight:600 }}>{o.productName}</span></div></td>
                        <td style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:600, color:'var(--clay)' }}>₹{o.amount.toLocaleString('en-IN')}</td>
                        <td>{statusBadge(o.status)}</td>
                        <td style={{ color:'var(--muted)', fontSize:'0.8rem' }}>{o.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ── PRODUCTS ── */}
          {tab === 'products' && (
            <>
              <div style={{ display:'flex', gap:'0.6rem', marginBottom:'1.2rem' }}>
                <span className="badge badge-green">{products.filter(p => p.approved).length} live</span>
                <span className="badge badge-orange">{products.filter(p => !p.approved).length} pending</span>
              </div>
              <div className="product-grid">
                {products.map(p => (
                  <div key={p._id} style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', overflow:'hidden' }}>
                    <div style={{ height:140, background:'#C4622D', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem' }}>{p.emoji}</div>
                    <div style={{ padding:'0.9rem 1rem' }}>
                      <div style={{ fontWeight:700, fontSize:'0.9rem', marginBottom:'0.2rem' }}>{p.name}</div>
                      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:600, color:'var(--clay)', fontSize:'1.2rem' }}>₹{p.price.toLocaleString('en-IN')}</div>
                      <div style={{ fontSize:'0.72rem', color:'var(--muted)', marginTop:'0.25rem' }}>by {p.seller?.name}</div>
                      <div style={{ marginTop:'0.6rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                        {p.approved ? <span className="badge badge-green">✓ Live</span> : <span className="badge badge-orange">Pending</span>}
                        <span style={{ fontSize:'0.7rem', color:'var(--muted)' }}>sold {p.sold}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── USERS ── */}
          {tab === 'users' && (
            <div className="table-card">
              <div className="table-head">
                <h3>Registered Artisans</h3>
                <span className="badge badge-blue">{MOCK_USERS.length} users</span>
              </div>
              <table className="data-table">
                <thead><tr><th>Artisan</th><th>Village</th><th>Craft</th><th>Balance</th><th>Listings</th></tr></thead>
                <tbody>
                  {MOCK_USERS.map(u => (
                    <tr key={u._id}>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:'0.65rem' }}>
                          <div className="avatar av-sm" style={{ background:'var(--clay)' }}>{u.name.slice(0,2).toUpperCase()}</div>
                          <div>
                            <div style={{ fontWeight:700 }}>{u.name}</div>
                            <div style={{ fontSize:'0.7rem', color:'var(--muted)' }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ color:'var(--muted)', fontSize:'0.8rem' }}>{u.village}</td>
                      <td><span className="badge badge-clay">{u.craft}</span></td>
                      <td style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:600 }}>₹{u.balance.toLocaleString('en-IN')}</td>
                      <td style={{ fontWeight:600 }}>{products.filter(p => p.seller._id === u._id).length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── ORDERS ── */}
          {tab === 'orders' && (
            <div className="table-card">
              <div className="table-head">
                <h3>All Orders</h3>
                <span className="badge badge-blue">{MOCK_ORDERS.length} total</span>
              </div>
              <table className="data-table">
                <thead><tr><th>Product</th><th>Buyer</th><th>Seller</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                  {MOCK_ORDERS.slice().reverse().map(o => (
                    <tr key={o._id}>
                      <td><div style={{ display:'flex', alignItems:'center', gap:'0.4rem' }}><span>{o.emoji}</span><span style={{ fontWeight:600, fontSize:'0.82rem' }}>{o.productName}</span></div></td>
                      <td style={{ color:'var(--muted)', fontSize:'0.8rem' }}>{o.buyer}</td>
                      <td style={{ color:'var(--muted)', fontSize:'0.8rem' }}>{o.seller}</td>
                      <td style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:600, color:'var(--clay)' }}>₹{o.amount.toLocaleString('en-IN')}</td>
                      <td>{statusBadge(o.status)}</td>
                      <td style={{ color:'var(--muted)', fontSize:'0.78rem' }}>{o.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
