import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <nav style={{ position:'sticky', top:0, zIndex:100, background:'rgba(250,245,237,0.94)', backdropFilter:'blur(8px)', borderBottom:'1px solid var(--border)', padding:'0.9rem 2rem', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem' }}>

      {/* Logo */}
      <Link to="/shop" style={{ textDecoration:'none' }}>
        <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.7rem', fontWeight:600, color:'var(--clay)', letterSpacing:'0.08em' }}>
          HAST<span style={{ color:'var(--indigo)' }}>KLA</span>
        </span>
      </Link>

      {/* Links */}
      <div style={{ display:'flex', alignItems:'center', gap:'1.5rem' }}>
        <Link to="/shop" style={{ fontSize:'0.82rem', fontWeight:600, color:'var(--muted)', textDecoration:'none', letterSpacing:'0.05em', textTransform:'uppercase' }}>
          Shop
        </Link>

        {user ? (
          <>
            <Link to="/dashboard" style={{ fontSize:'0.82rem', fontWeight:600, color:'var(--muted)', textDecoration:'none', letterSpacing:'0.05em', textTransform:'uppercase' }}>
              Dashboard
            </Link>
            <Link to="/list-product" style={{ fontSize:'0.82rem', fontWeight:600, color:'var(--muted)', textDecoration:'none', letterSpacing:'0.05em', textTransform:'uppercase' }}>
              + Sell
            </Link>
            {isAdmin && (
              <Link to="/admin" style={{ fontSize:'0.82rem', fontWeight:600, color:'var(--indigo)', textDecoration:'none', letterSpacing:'0.05em', textTransform:'uppercase' }}>
                Admin
              </Link>
            )}
            <button className="btn btn-warm btn-sm" onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <>
            <Link to="/login"><button className="btn btn-ghost btn-sm">Log in</button></Link>
            <Link to="/register"><button className="btn btn-clay btn-sm">Register Free</button></Link>
          </>
        )}

        {/* Cart Link */}
        <Link to="/cart" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:'0.4rem', padding:'0.5rem 0.8rem', background:'var(--warm)', borderRadius:12 }}>
          <span style={{ fontSize:'1.2rem' }}>🛒</span>
          {cartCount > 0 && (
            <span style={{ background:'var(--clay)', color:'white', fontSize:'0.7rem', fontWeight:700, borderRadius:'50%', width:18, height:18, display:'flex', alignItems:'center', justifyContent:'center' }}>
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  )
}

export default Navbar