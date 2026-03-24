import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('hastkla_user')) || null }
    catch { return null }
  })

  const login = (userData, token) => {
    localStorage.setItem('hastkla_user',  JSON.stringify(userData))
    localStorage.setItem('hastkla_token', token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('hastkla_user')
    localStorage.removeItem('hastkla_token')
    setUser(null)
  }

  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
