import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const statusBadge = (s) => {
  const map = { delivered:'badge-green', shipped:'badge-blue', processing:'badge-orange', cancelled:'badge-red', pending:'badge-muted' }
  return <span className={`badge ${map[s] || 'badge-muted'}`}>{s}</span>
}

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

const AdminDashboard = () => {
  const { logout } = useAuth()
  const navigate   = useNavigate()
  const [tab, setTab] = useState('overview')
  const [loading, setLoading] = useState(true)

  const [stats, setStats]       = useState({ users:0, products:0, orders:0, revenue:0, recentOrders:[] })
  const [users, setUsers]       = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders]     = useState([])

  useEffect(() => {
    fetchData()
  }, [tab])

  const fetchData = async () => {
    try {
      if (tab === 'overview') {
        const { data } = await api.get('/admin/stats')
        setStats(data)
      } else if (tab === 'users') {
        const { data } = await api.get('/admin/users')
        setUsers(data)
      } else if (tab === 'products') {
        const { data } = await api.get('/admin/products')
        setProducts(data)
      } else if (tab === 'orders') {
        const { data } = await api.get('/admin/orders')
        setOrders(data)
      }
    } catch (err) {
      console.error('Admin fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id, approved) => {
    try {
      const { data } = await api.put(`/admin/products/${id}/approve`, { approved })
      setProducts(prev => prev.map(p => p._id === id ? data : p))
    } catch (err) {
      console.error('Approve error:', err)
    }
  }

  const handleOrderStatus = async (id, status) => {
    try {
      const { data } = await api.put(`/admin/orders/${id}/status`, { status })
      setOrders(prev => prev.map(o => o._id === id ? data : o))
    } catch (err) {
      console.error('Status update error:', err)
    }
  }

  const TABS = [
    { id:'overview', icon:'📊', label:'Overview' },
    { id:'products', icon:'🏺', label:'Products' },
    { id:'users',    icon:'👥', label:'Users' },
    { id:'orders',   icon:'📋', label:'Orders' },
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
            <div key={t.id} className={`sbi${tab === t.id ? ' active' : ''}`} onClick={() => { setTab(t.id); setLoading(true) }}>
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

          {loading && (
            <div style={{ textAlign:'center', padding:'3rem' }}>
              <span className="spinner" style={{ width:28, height:28 }} />
              <p style={{ color:'var(--muted)', marginTop:'0.8rem', fontSize:'0.84rem' }}>Loading…</p>
            </div>
          )}

          {/* ── OVERVIEW ── */}
          {!loading && tab === 'overview' && (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-num" style={{ color:'var(--clay)' }}>{stats.users}</div>
                  <div className="stat-lbl">Artisans</div>
                </div>
                <div className="stat-card">
                  <div className="stat-num" style={{ color:'var(--indigo)' }}>{stats.products}</div>
                  <div className="stat-lbl">Products</div>
                </div>
                <div className="stat-card">
                  <div className="stat-num" style={{ color:'var(--ok)' }}>₹{stats.revenue.toLocaleString('en-IN')}</div>
                  <div className="stat-lbl">Total Revenue</div>
                </div>
                <div className="stat-card">
                  <div className="stat-num" style={{ color:'var(--saffron)' }}>{stats.orders}</div>
                  <div className="stat-lbl">Orders</div>
                </div>
              </div>

              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.4rem', fontWeight:600, marginBottom:'1rem' }}>Recent Orders</h2>
              <div className="table-card">
                <table className="data-table">
                  <thead><tr><th>Product</th><th>Buyer</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {(stats.recentOrders || []).map(o => (
                      <tr key={o._id}>
                        <td><div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}><span>{o.product?.emoji || '🎁'}</span><span style={{ fontWeight:600 }}>{o.product?.name}</span></div></td>
                        <td style={{ color:'var(--muted)', fontSize:'0.8rem' }}>{o.buyer?.name}</td>
                        <td style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:600, color:'var(--clay)' }}>₹{o.amount?.toLocaleString('en-IN')}</td>
                        <td>{statusBadge(o.status)}</td>
                        <td style={{ color:'var(--muted)', fontSize:'0.8rem' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ── PRODUCTS ── */}
          {!loading && tab === 'products' && (
            <>
              <div style={{ display:'flex', gap:'0.6rem', marginBottom:'1.2rem' }}>
                <span className="badge badge-green">{products.filter(p => p.approved).length} live</span>
                <span className="badge badge-orange">{products.filter(p => !p.approved).length} pending</span>
              </div>
              <div className="product-grid">
                {products.map(p => (
                  <div key={p._id} style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', overflow:'hidden' }}>
                    <div style={{ height:140, background:'#C4622D', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem', overflow:'hidden' }}>
                      {p.images?.[0] ? <img src={p.images[0]} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : p.emoji || '🎁'}
                    </div>
                    <div style={{ padding:'0.9rem 1rem' }}>
                      <div style={{ fontWeight:700, fontSize:'0.9rem', marginBottom:'0.2rem' }}>{p.name}</div>
                      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:600, color:'var(--clay)', fontSize:'1.2rem' }}>₹{p.price?.toLocaleString('en-IN')}</div>
                      <div style={{ fontSize:'0.72rem', color:'var(--muted)', marginTop:'0.25rem' }}>by {p.seller?.name}</div>
                      <div style={{ marginTop:'0.6rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                        {p.approved
                          ? <button className="badge badge-green" style={{ cursor:'pointer', border:'none' }} onClick={() => handleApprove(p._id, false)}>✓ Live</button>
                          : <button className="badge badge-orange" style={{ cursor:'pointer', border:'none' }} onClick={() => handleApprove(p._id, true)}>Approve →</button>
                        }
                        <span style={{ fontSize:'0.7rem', color:'var(--muted)' }}>sold {p.sold || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── USERS ── */}
          {!loading && tab === 'users' && (
            <div className="table-card">
              <div className="table-head">
                <h3>Registered Artisans</h3>
                <span className="badge badge-blue">{users.length} users</span>
              </div>
              <table className="data-table">
                <thead><tr><th>Artisan</th><th>Village</th><th>Craft</th><th>Balance</th><th>Listings</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:'0.65rem' }}>
                          <div className="avatar av-sm" style={{ background:'var(--clay)' }}>{u.name?.slice(0,2).toUpperCase()}</div>
                          <div>
                            <div style={{ fontWeight:700 }}>{u.name}</div>
                            <div style={{ fontSize:'0.7rem', color:'var(--muted)' }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ color:'var(--muted)', fontSize:'0.8rem' }}>{u.village}</td>
                      <td><span className="badge badge-clay">{u.craft || '—'}</span></td>
                      <td style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:600 }}>₹{(u.balance || 0).toLocaleString('en-IN')}</td>
                      <td style={{ fontWeight:600 }}>{u.listingCount || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── ORDERS ── */}
          {!loading && tab === 'orders' && (
            <div className="table-card">
              <div className="table-head">
                <h3>All Orders</h3>
                <span className="badge badge-blue">{orders.length} total</span>
              </div>
              <table className="data-table">
                <thead><tr><th>Product</th><th>Buyer</th><th>Seller</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o._id}>
                      <td><div style={{ display:'flex', alignItems:'center', gap:'0.4rem' }}><span>{o.product?.emoji || '🎁'}</span><span style={{ fontWeight:600, fontSize:'0.82rem' }}>{o.product?.name}</span></div></td>
                      <td style={{ color:'var(--muted)', fontSize:'0.8rem' }}>{o.buyer?.name}</td>
                      <td style={{ color:'var(--muted)', fontSize:'0.8rem' }}>{o.seller?.name}</td>
                      <td style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:600, color:'var(--clay)' }}>₹{o.amount?.toLocaleString('en-IN')}</td>
                      <td>
                        <select
                          value={o.status}
                          onChange={(e) => handleOrderStatus(o._id, e.target.value)}
                          style={{ fontSize:'0.72rem', padding:'2px 6px', borderRadius:6, border:'1px solid var(--border)', background:'var(--warm)', cursor:'pointer', fontWeight:600 }}
                        >
                          {['pending','processing','shipped','delivered','cancelled'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td style={{ color:'var(--muted)', fontSize:'0.78rem' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
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
