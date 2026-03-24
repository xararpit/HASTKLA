import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

const CRAFTS = ['Metalwork','Fabric & Textile','Clay & Pottery','Woodcraft','Leather & Bags','Floral Crafts','Decorative Art','Other']

const Register = () => {
  const { login }  = useAuth()
  const navigate   = useNavigate()
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', village:'', craft:'' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({...f, [k]:v}))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.password || !form.village) {
      setError('Please fill in all required fields.')
      return
    }
    setLoading(true)

    // ── Replace with: axios.post('/api/auth/register', form)
    await new Promise(r => setTimeout(r, 700))
    const newUser = { _id: 'u_' + Date.now(), name:form.name, email:form.email, phone:form.phone, village:form.village, craft:form.craft, role:'user', balance:0 }
    login(newUser, 'mock-jwt-token')
    navigate('/dashboard')
  }

  return (
    <>
      <Navbar />
      <div style={{ minHeight:'calc(100vh - 60px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', background:'var(--cream)' }}>
        <div style={{ width:'100%', maxWidth:500 }}>

          <div style={{ textAlign:'center', marginBottom:'2rem' }}>
            <span style={{ display:'inline-block', background:'rgba(196,98,45,0.1)', color:'var(--clay)', borderRadius:30, padding:'0.3rem 1rem', fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'0.7rem' }}>
              100% Free · No fees ever
            </span>
            <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'2.4rem', fontWeight:600 }}>Join HASTKLA</h1>
            <p style={{ color:'var(--muted)', fontSize:'0.88rem', marginTop:'0.3rem' }}>Sell your handmade crafts to the world, completely free</p>
          </div>

          <div style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', padding:'2rem' }}>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className="form-input" placeholder="Your name" value={form.name} onChange={e => set('name', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={e => set('phone', e.target.value)} />
                </div>
                <div className="form-group full">
                  <label className="form-label">Email Address *</label>
                  <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Village / City *</label>
                  <input className="form-input" placeholder="e.g. Jaipur, Rajasthan" value={form.village} onChange={e => set('village', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Your Craft</label>
                  <select className="form-select" value={form.craft} onChange={e => set('craft', e.target.value)}>
                    <option value="">— select craft —</option>
                    {CRAFTS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group full">
                  <label className="form-label">Password *</label>
                  <input className="form-input" type="password" placeholder="Min. 6 characters" value={form.password} onChange={e => set('password', e.target.value)} required minLength={6} />
                </div>
              </div>

              {error && (
                <div style={{ background:'#fce7e7', borderRadius:8, padding:'0.6rem 0.9rem', fontSize:'0.82rem', color:'var(--err)', marginBottom:'1rem' }}>
                  {error}
                </div>
              )}

              <button className="btn btn-clay btn-full btn-lg" type="submit" disabled={loading}>
                {loading ? <><span className="spinner" style={{borderTopColor:'#fff'}} /> Creating account…</> : 'Create Free Account →'}
              </button>

              <p style={{ textAlign:'center', fontSize:'0.75rem', color:'var(--muted)', marginTop:'0.8rem', lineHeight:1.5 }}>
                By registering you agree to HASTKLA's terms. Registration is always free.
              </p>
            </form>

            <p style={{ textAlign:'center', fontSize:'0.82rem', color:'var(--muted)', marginTop:'1.2rem' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color:'var(--clay)', fontWeight:700, textDecoration:'none' }}>Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register