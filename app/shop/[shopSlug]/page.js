'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import useCartStore from '@/store/cartStore'
import api from '@/lib/api'

export default function StorefrontPage({ params }) {
  const { shopSlug } = React.use(params)
  const { addItem, getTotalItems } = useCartStore()
  const [shop, setShop] = useState(null)
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [added, setAdded] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchShop()
  }, [shopSlug])

  async function fetchShop() {
    try {
      const response = await api.get(`/shops/${shopSlug}`)
      const data = response.data.shop
      setShop(data)
      setProducts(data.products || [])
    } catch (err) {
      console.error('Error fetching shop:', err)
    } finally {
      setLoading(false)
    }
  }

  function handleAddToCart(product) {
    addItem(product)
    setAdded(product._id)
    setTimeout(() => setAdded(null), 1500)
  }

  const filtered = products.filter((p) =>
    p.product_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-400">Loading shop...</p>
      </div>
    )
  }

  if (!shop) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-400">Shop not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Shop header banner */}
      <div
        className="w-full py-16 flex flex-col items-center justify-center gap-3"
        style={{ backgroundColor: '#2563eb' }}
      >
        {shop.logoUrl && (
          <img
            src={`http://localhost:5000/${shop.logoUrl}`}
            alt={shop.name}
            className="w-16 h-16 rounded-full object-cover border-4 border-white"
          />
        )}
        <h1 className="text-3xl font-bold text-white">{shop.name}</h1>
        <p className="text-white opacity-80 text-sm max-w-md text-center">
          {shop.description}
        </p>
        <Link
          href={`/shop/${shopSlug}/cart`}
          className="mt-4 bg-white px-5 py-2 rounded-full text-sm font-medium flex items-center gap-2 text-blue-600"
        >
          🛒 Cart
          {getTotalItems() > 0 && (
            <Badge className="bg-red-500 text-white text-xs px-2">
              {getTotalItems()}
            </Badge>
          )}
        </Link>
      </div>

      {/* Products section */}
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-6">

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            All Products ({products.length})
          </h2>
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col"
            >
              <Link href={`/shop/${shopSlug}/product/${product._id}`}>
                <img
                  src={product.image
                    ? `http://localhost:5000/${product.image}`
                    : 'https://placehold.co/400x300'}
                  alt={product.product_name}
                  className="w-full h-48 object-cover bg-gray-100 hover:opacity-90 transition-opacity"
                />
              </Link>

              <div className="p-4 flex flex-col gap-3 flex-1">
                <div className="flex flex-col gap-1">
                  <Badge variant="secondary" className="w-fit text-xs">
                    {product.category}
                  </Badge>
                  <Link href={`/shop/${shopSlug}/product/${product._id}`}>
                    <h3 className="font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                      {product.product_name}
                    </h3>
                  </Link>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <p className="font-bold text-gray-800">
                    ₦{Number(product.price).toLocaleString()}
                  </p>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="text-sm px-3 py-1.5 rounded-lg text-white transition-colors"
                    style={{
                      backgroundColor: added === product._id ? '#10b981' : '#2563eb'
                    }}
                  >
                    {added === product._id ? '✓ Added!' : 'Add to cart'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            {search ? `No products found for "${search}"` : 'No products yet!'}
          </div>
        )}

      </div>
    </div>
  )
}