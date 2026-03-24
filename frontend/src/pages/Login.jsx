import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import api from '../api/axios'

const Login = () => {
  const { login } = useAuth()
  const navigate   = useNavigate()

  // Step 1: credentials
  const [form, setForm] = useState({ email:'', password:'' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  // Step 2: OTP
  const [otpStep, setOtpStep]       = useState(false)
  const [otpEmail, setOtpEmail]     = useState('')
  const [otp, setOtp]               = useState(['','','','','',''])
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpError, setOtpError]     = useState('')
  const [resendTimer, setResendTimer] = useState(0)
  const [devOtp, setDevOtp]         = useState('')
  const inputRefs = useRef([])

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer <= 0) return
    const t = setTimeout(() => setResendTimer(r => r - 1), 1000)
    return () => clearTimeout(t)
  }, [resendTimer])

  // Focus first OTP input on step change
  useEffect(() => {
    if (otpStep) setTimeout(() => inputRefs.current[0]?.focus(), 100)
  }, [otpStep])

  // Step 1: Submit credentials
  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data } = await api.post('/auth/login', form)

      if (data.otpRequired) {
        setOtpEmail(data.email)
        setOtpStep(true)
        setResendTimer(30)
        if (data._devOtp) setDevOtp(data._devOtp)
      } else {
        // Direct login (fallback if OTP disabled)
        login(data.user, data.token)
        navigate(data.user.role === 'admin' ? '/admin' : '/dashboard')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // OTP input handler — auto-focus next
  const handleOtpChange = (idx, val) => {
    if (val.length > 1) val = val.slice(-1)
    if (val && !/^\d$/.test(val)) return

    const next = [...otp]
    next[idx] = val
    setOtp(next)

    if (val && idx < 5) inputRefs.current[idx + 1]?.focus()

    // Auto-submit when all 6 digits entered
    if (val && idx === 5) {
      const full = next.join('')
      if (full.length === 6) submitOtp(full)
    }
  }

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus()
    }
  }

  // Paste handler
  const handleOtpPaste = (e) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (text.length === 6) {
      setOtp(text.split(''))
      inputRefs.current[5]?.focus()
      submitOtp(text)
    }
  }

  // Step 2: Submit OTP
  const submitOtp = async (code) => {
    setOtpError('')
    setOtpLoading(true)

    try {
      const { data } = await api.post('/auth/verify-otp', { email: otpEmail, otp: code || otp.join('') })
      login(data.user, data.token)
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Invalid OTP. Try again.')
      setOtp(['','','','','',''])
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    } finally {
      setOtpLoading(false)
    }
  }

  // Resend OTP
  const handleResend = async () => {
    setOtpError('')
    try {
      const { data } = await api.post('/auth/resend-otp', { email: otpEmail })
      setResendTimer(30)
      if (data._devOtp) setDevOtp(data._devOtp)
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Failed to resend OTP.')
    }
  }

  return (
    <>
      <Navbar />
      <div style={{ minHeight:'calc(100vh - 60px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', background:'var(--cream)' }}>
        <div style={{ width:'100%', maxWidth:420 }}>

          {!otpStep ? (
            <>
              {/* ── STEP 1: CREDENTIALS ── */}
              <div style={{ textAlign:'center', marginBottom:'2rem' }}>
                <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'2.4rem', fontWeight:600 }}>Welcome back</h1>
                <p style={{ color:'var(--muted)', fontSize:'0.88rem', marginTop:'0.3rem' }}>Log in to buy, sell and manage your crafts</p>
              </div>

              <div style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', padding:'2rem' }}>
                <form onSubmit={handleLogin}>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({...f, email:e.target.value}))} required autoComplete="email" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({...f, password:e.target.value}))} required autoComplete="current-password" />
                  </div>

                  {error && (
                    <div style={{ background:'#fce7e7', border:'1px solid #f0b0b0', borderRadius:8, padding:'0.6rem 0.9rem', fontSize:'0.82rem', color:'var(--err)', marginBottom:'1rem' }}>
                      {error}
                    </div>
                  )}

                  <button className="btn btn-clay btn-full btn-lg" type="submit" disabled={loading}>
                    {loading ? <><span className="spinner" style={{borderTopColor:'#fff'}} /> Verifying…</> : 'Continue →'}
                  </button>
                </form>

                <p style={{ textAlign:'center', fontSize:'0.82rem', color:'var(--muted)', margin:'1.2rem 0 0' }}>
                  New artisan?{' '}
                  <Link to="/register" style={{ color:'var(--clay)', fontWeight:700, textDecoration:'none' }}>Register for free</Link>
                </p>
              </div>

              {/* Demo credentials */}
              <div style={{ marginTop:'1.5rem', background:'var(--warm)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'1rem' }}>
                <p style={{ fontSize:'0.72rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.09em', color:'var(--muted)', marginBottom:'0.5rem' }}>
                  Demo accounts (after seeding)
                </p>
                <div style={{ fontSize:'0.78rem', color:'var(--muted)', lineHeight:1.8 }}>
                  <div><strong>Admin:</strong> admin@hastkla.com / admin123</div>
                  <div><strong>User:</strong> ram@village.in / pass123</div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* ── STEP 2: OTP VERIFICATION ── */}
              <div style={{ textAlign:'center', marginBottom:'2rem' }}>
                <div style={{ width:56, height:56, borderRadius:'50%', background:'rgba(196,98,45,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.6rem', margin:'0 auto 1rem' }}>
                  🔐
                </div>
                <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'2rem', fontWeight:600 }}>Check your email</h1>
                <p style={{ color:'var(--muted)', fontSize:'0.85rem', marginTop:'0.4rem', lineHeight:1.6 }}>
                  We sent a 6-digit code to<br/>
                  <strong style={{ color:'var(--ink)' }}>{otpEmail}</strong>
                </p>
              </div>

              <div style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', padding:'2rem' }}>

                {/* OTP Input Boxes */}
                <div style={{ display:'flex', gap:'0.5rem', justifyContent:'center', marginBottom:'1.5rem' }} onPaste={handleOtpPaste}>
                  {otp.map((d, i) => (
                    <input
                      key={i}
                      ref={el => inputRefs.current[i] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={d}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      style={{
                        width:48, height:56, textAlign:'center', fontSize:'1.5rem', fontWeight:700,
                        border: d ? '2px solid var(--clay)' : '2px solid var(--border)',
                        borderRadius:12, outline:'none', fontFamily:"'Cormorant Garamond',serif",
                        transition:'border-color 0.2s',
                        color:'var(--clay)',
                      }}
                      onFocus={e => e.target.style.borderColor = 'var(--clay)'}
                      onBlur={e => { if (!d) e.target.style.borderColor = 'var(--border)' }}
                    />
                  ))}
                </div>

                {otpError && (
                  <div style={{ background:'#fce7e7', border:'1px solid #f0b0b0', borderRadius:8, padding:'0.6rem 0.9rem', fontSize:'0.82rem', color:'var(--err)', marginBottom:'1rem', textAlign:'center' }}>
                    {otpError}
                  </div>
                )}

                <button
                  className="btn btn-clay btn-full btn-lg"
                  disabled={otpLoading || otp.join('').length < 6}
                  onClick={() => submitOtp()}
                >
                  {otpLoading ? <><span className="spinner" style={{borderTopColor:'#fff'}} /> Verifying…</> : 'Verify OTP →'}
                </button>

                {/* Resend */}
                <div style={{ textAlign:'center', marginTop:'1.2rem' }}>
                  {resendTimer > 0 ? (
                    <p style={{ fontSize:'0.8rem', color:'var(--muted)' }}>
                      Resend OTP in <strong style={{ color:'var(--clay)' }}>{resendTimer}s</strong>
                    </p>
                  ) : (
                    <button
                      onClick={handleResend}
                      style={{ background:'none', border:'none', color:'var(--clay)', fontWeight:700, fontSize:'0.84rem', cursor:'pointer', textDecoration:'underline', fontFamily:'Nunito,sans-serif' }}
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                {/* Dev hint */}
                {devOtp && (
                  <div style={{ marginTop:'1rem', background:'#f0f7ff', border:'1px solid #d0e3f7', borderRadius:8, padding:'0.6rem 0.9rem', fontSize:'0.72rem', color:'#3a6ea5', textAlign:'center' }}>
                    🛠️ Dev mode OTP: <strong style={{ letterSpacing:'0.15em' }}>{devOtp}</strong>
                  </div>
                )}

                {/* Back link */}
                <p style={{ textAlign:'center', fontSize:'0.8rem', color:'var(--muted)', marginTop:'1rem' }}>
                  <button
                    onClick={() => { setOtpStep(false); setOtp(['','','','','','']); setOtpError(''); setDevOtp('') }}
                    style={{ background:'none', border:'none', color:'var(--muted)', cursor:'pointer', fontSize:'0.8rem', fontFamily:'Nunito,sans-serif' }}
                  >
                    ← Back to login
                  </button>
                </p>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  )
}

export default Login
