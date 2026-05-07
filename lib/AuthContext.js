'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { saveToken, removeToken, getToken } from './auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (token) {
      setUser({ email: 'owner@myshop.com', name: 'Shop Owner' })
    }
    setLoading(false)
  }, [])

  function login(email, password) {
    const fakeToken = 'mock-jwt-token-12345'
    saveToken(fakeToken)
    setUser({ email, name: 'Shop Owner' })
  }

  function logout() {
    removeToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}