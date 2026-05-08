'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import api from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('shop_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  async function login(email, password) {
    const response = await api.post('/auth/login', { email, password })
    const userData = response.data.user
    localStorage.setItem('shop_token', userData.token)
    localStorage.setItem('shop_user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  async function signup(name, email, password, role) {
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
      role,
    })
    const userData = response.data.user
    localStorage.setItem('shop_token', userData.token)
    localStorage.setItem('shop_user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  function logout() {
    localStorage.removeItem('shop_token')
    localStorage.removeItem('shop_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}