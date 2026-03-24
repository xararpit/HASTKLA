import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

// MOCK users — remove when backend is ready
const MOCK_USERS = [
  { _id:'u1', name:'Rameshwar Das', email:'ram@village.in',     password:'pass123', role:'user',  village:'Jaipur, RJ',  craft:'Metalwork',         balance:8500 },
  { _id:'u2', name:'Savitri Kanwar',email:'savitri@village.in', password:'pass123', role:'user',  village:'Bhopal, MP',  craft:'Fabric & Floral',   balance:12000 },
  { _id:'u3', name:'Priya Meena',   email:'priya@village.in',   password:'pass123', role:'user',  village:'Agra, UP',    craft:'Clay & Pottery',    balance:5500 },
  { _id:'u4', name:'Mohan Singh',   email:'mohan@village.in',   password:'pass123', role:'user',  village:'Jodhpur, RJ', craft:'Woodcraft',         balance:3200 },
  { _id:'a1', name:'Admin',         email:'admin@hastkla.com',  password:'admin123',role:'admin', village:'Platform HQ', craft:'Platform Admin',    balance:0 },
]

const Login = () => {
  const { login } = useAuth()
  const navigate   = useNavigate()
  const [form, setForm] = useState({ email:'', password:'' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // ── MOCK login — replace with: axios.post('/api/auth/login', form)
    await new Promise(r => setTimeout(r, 600))
    const found = MOCK_USERS.find(u => u.email === form.email && u.password === form.password)

    if (!found) {
      setError('Invalid email or password.')
      setLoading(false)
      return
    }

    const { password: _, ...safeUser } = found
    login(safeUser, 'mock-jwt-token')
    navigate(safeUser.role === 'admin' ? '/admin' : '/dashboard')
  }

  const quickLogin = (u) => {
    const { password: _, ...safeUser } = u
    login(safeUser, 'mock-jwt-token')
    navigate(safeUser.role === 'admin' ? '/admin' : '/dashboard')
  }

  return (
    <>
      <Navbar />
      <div style={{ minHeight:'calc(100vh - 60px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', background:'var(--cream)' }}>
        <div style={{ width:'100%', maxWidth:420 }}>

          {/* Title */}
          <div style={{ textAlign:'center', marginBottom:'2rem' }}>
            <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'2.4rem', fontWeight:600 }}>Welcome back</h1>
            <p style={{ color:'var(--muted)', fontSize:'0.88rem', marginTop:'0.3rem' }}>Log in to buy, sell and manage your crafts</p>
          </div>

          {/* Form */}
          <div style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', padding:'2rem' }}>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({...f, email:e.target.value}))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({...f, password:e.target.value}))} required />
              </div>

              {error && (
                <div style={{ background:'#fce7e7', border:'1px solid #f0b0b0', borderRadius:8, padding:'0.6rem 0.9rem', fontSize:'0.82rem', color:'var(--err)', marginBottom:'1rem' }}>
                  {error}
                </div>
              )}

              <button className="btn btn-clay btn-full btn-lg" type="submit" disabled={loading}>
                {loading ? <><span className="spinner" style={{borderTopColor:'#fff'}} /> Logging in…</> : 'Log In →'}
              </button>
            </form>

            <p style={{ textAlign:'center', fontSize:'0.82rem', color:'var(--muted)', margin:'1.2rem 0 0' }}>
              New artisan?{' '}
              <Link to="/register" style={{ color:'var(--clay)', fontWeight:700, textDecoration:'none' }}>Register for free</Link>
            </p>
          </div>

          {/* Quick demo logins */}
          <div style={{ marginTop:'1.5rem', background:'var(--warm)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'1.2rem' }}>
            <p style={{ fontSize:'0.72rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.09em', color:'var(--muted)', marginBottom:'0.8rem' }}>
              Quick demo — click to log in instantly
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
              {MOCK_USERS.map(u => (
                <button key={u._id} onClick={() => quickLogin(u)}
                  style={{ display:'flex', alignItems:'center', gap:'0.8rem', background:'var(--white)', border:'1px solid var(--border)', borderRadius:10, padding:'0.6rem 0.9rem', cursor:'pointer', transition:'all 0.15s', textAlign:'left' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor='var(--clay)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}
                >
                  <div style={{ width:32, height:32, borderRadius:'50%', background: u.role==='admin' ? 'var(--indigo)' : 'var(--clay)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'0.7rem', fontWeight:700, flexShrink:0 }}>
                    {u.name.slice(0,2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:'0.82rem' }}>{u.name}</div>
                    <div style={{ fontSize:'0.7rem', color:'var(--muted)' }}>{u.role === 'admin' ? 'Admin' : u.craft} · {u.village}</div>
                  </div>
                  {u.role === 'admin' && <span className="badge badge-blue" style={{ marginLeft:'auto' }}>Admin</span>}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default Login
