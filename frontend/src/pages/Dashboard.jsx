import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MOCK_PRODUCTS } from '../data/products'

const MOCK_ORDERS = [
  { _id:'o1', productName:'Brass Ganesha Idol',       emoji:'🔱', amount:1200, type:'bought', status:'delivered', date:'2025-02-01' },
  { _id:'o2', productName:'Chanderi Silk Saree',       emoji:'🎋', amount:3400, type:'sold',   status:'shipped',   date:'2025-02-10' },
  { _id:'o3', productName:'Dried Marigold Wreath',     emoji:'🌸', amount:450,  type:'bought', status:'delivered', date:'2025-02-20' },
  { _id:'o4', productName:'Pressed Wildflower Frame',  emoji:'🌼', amount:320,  type:'bought', status:'processing',date:'2025-03-01' },
  { _id:'o5', productName:'Terracotta Wall Panel',     emoji:'🎨', amount:850,  type:'sold',   status:'delivered', date:'2025-03-05' },
]

const statusBadge = (s) => {
  const map = { delivered:'badge-green', shipped:'badge-blue', processing:'badge-orange', cancelled:'badge-red', pending:'badge-muted' }
  return <span className={`badge ${map[s] || 'badge-muted'}`}>{s}</span>
}

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')

  const myListings = MOCK_PRODUCTS.filter(p => p.seller._id === user?._id)
  const bought     = MOCK_ORDERS.filter(o => o.type === 'bought')
  const sold       = MOCK_ORDERS.filter(o => o.type === 'sold')
  const totalEarned = myListings.reduce((a,p) => a + p.price * p.sold, 0)

  const TABS = [
    { id:'overview',  icon:'📊', label:'Overview' },
    { id:'listings',  icon:'📦', label:'My Listings' },
    { id:'purchases', icon:'🛍️', label:'Purchases' },
    { id:'sales',     icon:'💰', label:'Sales' },
  ]

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
            {tab === 'purchases' && `${bought.length} orders placed`}
            {tab === 'sales'     && `${sold.length} items sold`}
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
                  <div className="stat-num" style={{ color:'var(--indigo)' }}>{bought.length}</div>
                  <div className="stat-lbl">Purchases</div>
                </div>
                <div className="stat-card">
                  <div className="stat-num" style={{ color:'var(--saffron)' }}>{sold.length}</div>
                  <div className="stat-lbl">Items Sold</div>
                </div>
              </div>

              {/* Recent activity */}
              <div style={{ marginBottom:'0.8rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.4rem', fontWeight:600 }}>Recent Activity</h2>
              </div>
              <div className="table-card">
                {MOCK_ORDERS.map(o => (
                  <div key={o._id} className="history-item">
                    <div className="history-icon">{o.emoji}</div>
                    <div>
                      <div className="history-name">{o.productName}</div>
                      <div className="history-meta">
                        <span>{o.type === 'bought' ? 'Purchased' : 'Sold'}</span>
                        <span>·</span><span>{o.date}</span>
                        <span>·</span>{statusBadge(o.status)}
                      </div>
                    </div>
                    <div className={`history-amount ${o.type === 'sold' ? 'earn' : 'spent'}`}>
                      {o.type === 'sold' ? '+' : '−'}₹{o.amount.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
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
                      <div style={{ height:140, background:'#C4622D', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem' }}>{p.emoji}</div>
                      <div style={{ padding:'0.9rem 1rem' }}>
                        <div style={{ fontWeight:700, fontSize:'0.9rem', marginBottom:'0.2rem' }}>{p.name}</div>
                        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.2rem', fontWeight:600, color:'var(--clay)' }}>₹{p.price.toLocaleString('en-IN')}</div>
                        <div style={{ fontSize:'0.72rem', color:'var(--muted)', marginTop:'0.3rem', display:'flex', gap:'0.6rem' }}>
                          <span>{p.sold} sold</span><span>·</span><span>{p.stock} in stock</span>
                        </div>
                        <div style={{ marginTop:'0.6rem' }}>
                          <span className="badge badge-green">Live</span>
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
              {bought.length > 0 ? bought.map(o => (
                <div key={o._id} className="history-item">
                  <div className="history-icon">{o.emoji}</div>
                  <div>
                    <div className="history-name">{o.productName}</div>
                    <div className="history-meta"><span>{o.date}</span><span>·</span>{statusBadge(o.status)}</div>
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
              {sold.length > 0 ? sold.map(o => (
                <div key={o._id} className="history-item">
                  <div className="history-icon">{o.emoji}</div>
                  <div>
                    <div className="history-name">{o.productName}</div>
                    <div className="history-meta"><span>{o.date}</span><span>·</span>{statusBadge(o.status)}</div>
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