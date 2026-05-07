import { AuthProvider } from '@/lib/AuthContext'
import './globals.css'

export const metadata = {
  title: 'Create Your Shop',
  description: 'Build and manage your own online store',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}