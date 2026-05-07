'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center flex flex-col items-center gap-6">

        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold text-blue-600">
            Create Your Shop 🛍️
          </h1>
          <p className="text-gray-500 text-lg">
            Build and manage your own online store in minutes
          </p>
        </div>

        <div className="flex gap-4">

          <Link
            href="/auth/login"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Login
          </Link>

          <Link
            href="/auth/signup"
            className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            Sign up
          </Link>

        </div>

      </div>
    </main>
  )
}