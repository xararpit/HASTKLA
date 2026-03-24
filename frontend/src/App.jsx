import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import ProtectedRoute from './components/ProtectedRoute'

import Login          from './pages/Login'
import Register       from './pages/Register'
import Shop           from './pages/Shop'
import ProductDetail  from './pages/ProductDetail'
import Dashboard      from './pages/Dashboard'
import ListProduct    from './pages/ListProduct'
import AdminDashboard from './pages/AdminDashboard'
import About          from './pages/About'
import Contact        from './pages/Contact'
import Policies       from './pages/Policies'
import Cart           from './pages/Cart'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <main>
            <Routes>
              {/* Public */}
              <Route path="/"            element={<Navigate to="/shop" replace />} />
              <Route path="/shop"        element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/login"       element={<Login />} />
              <Route path="/register"    element={<Register />} />
              <Route path="/about"       element={<About />} />
              <Route path="/contact"     element={<Contact />} />
              <Route path="/policies"    element={<Policies />} />
              <Route path="/cart"        element={<Cart />} />

              {/* Protected — any logged-in user */}
              <Route path="/dashboard"    element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/list-product" element={<ProtectedRoute><ListProduct /></ProtectedRoute>} />

              {/* Protected — admin only */}
              <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/shop" replace />} />
            </Routes>
          </main>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
