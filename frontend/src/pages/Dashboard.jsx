import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const statusBadge = (s) => {
  const map = { delivered:'badge-green', shipped:'badge-blue', processing:'badge-orange', cancelled:'badge-red', pending:'badge-muted' }
  return <span className={`badge ${map[s] || 'badge-muted'}`}>{s}</span>
}

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')
  const [myListings, setMyListings] = useState([])
  const [purchases, setPurchases] = useState([])
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listRes, purRes, salRes] = await Promise.all([
          api.get('/products/my'),
          api.get('/orders/my-purchases'),
          api.get('/orders/my-sales'),
        ])
        setMyListings(listRes.data)
        setPurchases(purRes.data)
        setSales(salRes.data)
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const totalEarned = sales.reduce((a, o) => a + o.amount, 0)

  // Combine purchases and sales for recent activity
  const recentActivity = [
    ...purchases.map(o => ({ ...o, type: 'bought' })),
    ...sales.map(o => ({ ...o, type: 'sold' })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10)

  const TABS = [
    { id:'overview',  icon:'📊', label:'Overview' },
    { id:'listings',  icon:'📦', label:'My Listings' },
    { id:'purchases', icon:'🛍️', label:'Purchases' },
    { id:'sales',     icon:'💰', label:'Sales' },
  ]

  if (loading) {
    return (
      <div className="shell">
        <div className="sidebar">
          <div className="sb-logo">HAST<span>KLA</span></div>
        </div>
        <div className="shell-main" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ textAlign:'center' }}>
            <span className="spinner" style={{ width:32, height:32 }} />
            <p style={{ color:'var(--muted)', marginTop:'1rem', fontSize:'0.88rem' }}>Loading your dashboard…</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="shell">

      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="sb-logo">HAST<span>KLA</span></div>
        <div className="sb-user">
          <div className="avatar av-sm" style={{ background:'var(--clay)', width:32, height:32, fontSize:'0.72rem' }}>
            {user?.name?.slice(0,2).toUpperCase()}
          </div>
          <div>
            <div className="sb-uname">{user?.name}</div>
            <div className="sb-utag">{user?.village}</div>
          </div>
        </div>
        <div className="sb-nav">
          {TABS.map(t => (
            <div key={t.id} className={`sbi${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
              <span>{t.icon}</span> {t.label}
            </div>
          ))}
          <div style={{ height:1, background:'rgba(255,255,255,0.07)', margin:'0.6rem 0' }} />
          <div className="sbi" onClick={() => navigate('/list-product')}>
            <span>➕</span> List a Product
          </div>
          <div className="sbi" onClick={() => navigate('/shop')}>
            <span>🛍️</span> Go to Shop
          </div>
        </div>
        <div className="sb-bal">
          <div className="sb-bal-lbl">Wallet Balance</div>
          <div className="sb-bal-val">₹{(user?.balance || 0).toLocaleString('en-IN')}</div>
        </div>
        <div className="sb-logout">
          <button onClick={() => { logout(); navigate('/login') }}>← Log Out</button>
        </div>
      </div>

      {/* MAIN */}
      <div className="shell-main">
        <div className="page-head">
          <h1>
            {tab === 'overview'  && 'My Dashboard'}
            {tab === 'listings'  && 'My Listings'}
            {tab === 'purchases' && 'My Purchases'}
            {tab === 'sales'     && 'My Sales'}
          </h1>
          <p>
            {tab === 'overview'  && `Welcome back, ${user?.name}! Here's your activity summary.`}
            {tab === 'listings'  && `${myListings.length} products listed · Anyone on HASTKLA can buy them`}
            {tab === 'purchases' && `${purchases.length} orders placed`}
            {tab === 'sales'     && `${sales.length} items sold`}
          </p>
        </div>
        <div className="page-body">

          {/* ── OVERVIEW ── */}
          {tab === 'overview' && (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-num" style={{ color:'var(--clay)' }}>{myListings.length}</div>
                  <div className="stat-lbl">My Listings</div>
                </div>
                <div className="stat-card">
                  <div className="stat-num" style={{ color:'var(--ok)' }}>₹{totalEarned.toLocaleString('en-IN')}</div>
                  <div className="stat-lbl">Total Earned</div>
                </div>
                <div className="stat-card">
                  <div className="stat-num" style={{ color:'var(--indigo)' }}>{purchases.length}</div>
                  <div className="stat-lbl">Purchases</div>
                </div>
                <div className="stat-card">
                  <div className="stat-num" style={{ color:'var(--saffron)' }}>{sales.length}</div>
                  <div className="stat-lbl">Items Sold</div>
                </div>
              </div>

              <div style={{ marginBottom:'0.8rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.4rem', fontWeight:600 }}>Recent Activity</h2>
              </div>
              <div className="table-card">
                {recentActivity.length > 0 ? recentActivity.map(o => (
                  <div key={o._id} className="history-item">
                    <div className="history-icon">{o.product?.emoji || '🎁'}</div>
                    <div>
                      <div className="history-name">{o.product?.name || 'Product'}</div>
                      <div className="history-meta">
                        <span>{o.type === 'bought' ? 'Purchased' : 'Sold'}</span>
                        <span>·</span><span>{new Date(o.createdAt).toLocaleDateString('en-IN')}</span>
                        <span>·</span>{statusBadge(o.status)}
                      </div>
                    </div>
                    <div className={`history-amount ${o.type === 'sold' ? 'earn' : 'spent'}`}>
                      {o.type === 'sold' ? '+' : '−'}₹{o.amount.toLocaleString('en-IN')}
                    </div>
                  </div>
                )) : (
                  <div className="empty-state">
                    <div className="icon">📊</div>
                    <div className="title">No activity yet</div>
                    <div className="sub">Start buying or selling to see your activity here.</div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── LISTINGS ── */}
          {tab === 'listings' && (
            <>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.2rem' }}>
                <span style={{ fontSize:'0.82rem', color:'var(--muted)' }}>{myListings.length} products</span>
                <button className="btn btn-clay btn-sm" onClick={() => navigate('/list-product')}>+ Add Product</button>
              </div>
              {myListings.length > 0 ? (
                <div className="product-grid">
                  {myListings.map(p => (
                    <div key={p._id} style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', overflow:'hidden' }}>
                      <div style={{ height:140, background:'#C4622D', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem', overflow:'hidden' }}>
                        {p.images?.[0] ? <img src={p.images[0]} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : p.emoji || '🎁'}
                      </div>
                      <div style={{ padding:'0.9rem 1rem' }}>
                        <div style={{ fontWeight:700, fontSize:'0.9rem', marginBottom:'0.2rem' }}>{p.name}</div>
                        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.2rem', fontWeight:600, color:'var(--clay)' }}>₹{p.price?.toLocaleString('en-IN')}</div>
                        <div style={{ fontSize:'0.72rem', color:'var(--muted)', marginTop:'0.3rem', display:'flex', gap:'0.6rem' }}>
                          <span>{p.sold || 0} sold</span><span>·</span><span>{p.stock || 0} in stock</span>
                        </div>
                        <div style={{ marginTop:'0.6rem' }}>
                          {p.approved ? <span className="badge badge-green">✓ Live</span> : <span className="badge badge-orange">Pending</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="icon">📦</div>
                  <div className="title">No listings yet</div>
                  <div className="sub">Add your first product and start selling.</div>
                  <button className="btn btn-clay" style={{ marginTop:'1rem' }} onClick={() => navigate('/list-product')}>+ List a Product</button>
                </div>
              )}
            </>
          )}

          {/* ── PURCHASES ── */}
          {tab === 'purchases' && (
            <div className="table-card">
              {purchases.length > 0 ? purchases.map(o => (
                <div key={o._id} className="history-item">
                  <div className="history-icon">{o.product?.emoji || '🎁'}</div>
                  <div>
                    <div className="history-name">{o.product?.name || 'Product'}</div>
                    <div className="history-meta"><span>{new Date(o.createdAt).toLocaleDateString('en-IN')}</span><span>·</span>{statusBadge(o.status)}</div>
                  </div>
                  <div className="history-amount spent">−₹{o.amount.toLocaleString('en-IN')}</div>
                </div>
              )) : (
                <div className="empty-state">
                  <div className="icon">🛍️</div>
                  <div className="title">No purchases yet</div>
                  <div className="sub">Browse the shop and buy something beautiful.</div>
                </div>
              )}
            </div>
          )}

          {/* ── SALES ── */}
          {tab === 'sales' && (
            <div className="table-card">
              {sales.length > 0 ? sales.map(o => (
                <div key={o._id} className="history-item">
                  <div className="history-icon">{o.product?.emoji || '🎁'}</div>
                  <div>
                    <div className="history-name">{o.product?.name || 'Product'}</div>
                    <div className="history-meta"><span>{new Date(o.createdAt).toLocaleDateString('en-IN')}</span><span>·</span>{statusBadge(o.status)}</div>
                  </div>
                  <div className="history-amount earn">+₹{o.amount.toLocaleString('en-IN')}</div>
                </div>
              )) : (
                <div className="empty-state">
                  <div className="icon">💰</div>
                  <div className="title">No sales yet</div>
                  <div className="sub">List a product to start earning.</div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Dashboard