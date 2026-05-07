'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'

const navLinks = [
  { label: 'Overview',  href: '/dashboard' },
  { label: 'Products',  href: '/dashboard/products' },
  { label: 'Orders',    href: '/dashboard/orders' },
  { label: 'Reviews',   href: '/dashboard/reviews' },
]

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()
  const { logout, user } = useAuth()

  function handleLogout() {
    logout()
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">

        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-56' : 'w-16'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}>

          {/* Logo + toggle */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
            {sidebarOpen && (
              <span className="font-bold text-blue-600 text-sm">My Shop</span>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              {sidebarOpen ? '←' : '→'}
            </button>
          </div>

          {/* User info */}
          {sidebarOpen && user && (
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-xs text-gray-400">Logged in as</p>
              <p className="text-sm font-medium text-gray-700 truncate">{user.email}</p>
            </div>
          )}

          {/* Nav links */}
          <nav className="flex flex-col gap-1 p-2 flex-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  {sidebarOpen && link.label}
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-2 border-t border-gray-100">
                    <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
        <span>🚪</span>
        {sidebarOpen && 'Logout'}
        </button>
          </div>

        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">
          {children}
        </main>

      </div>
    </ProtectedRoute>
  )
}