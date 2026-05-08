'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import useCartStore from '@/store/cartStore'
import useProductStore from '@/store/productStore'
import shop from '@/mock/shop'

export default function StorefrontPage() {
  const { products } = useProductStore()
  const { addItem, getTotalItems } = useCartStore()
  const [search, setSearch] = useState('')
  const [added, setAdded] = useState(null)
  const { shopSlug } = { shopSlug: shop.slug }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  function handleAddToCart(product) {
    addItem(product)
    setAdded(product.id)
    setTimeout(() => setAdded(null), 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Shop header banner */}
      <div
        className="w-full py-16 flex flex-col items-center justify-center gap-3"
        style={{ backgroundColor: shop.themeColor }}
      >
        <h1 className="text-3xl font-bold text-white">{shop.name}</h1>
        <p className="text-white opacity-80 text-sm max-w-md text-center">
          {shop.description}
        </p>
        <Link
          href={`/shop/${shop.slug}/cart`}
          className="mt-4 bg-white px-5 py-2 rounded-full text-sm font-medium flex items-center gap-2"
          style={{ color: shop.themeColor }}
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

        {/* Search */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">All Products</h2>
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
              key={product.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col"
            >
              <Link href={`/shop/${shop.slug}/product/${product.id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover bg-gray-100 hover:opacity-90 transition-opacity"
                />
              </Link>

              <div className="p-4 flex flex-col gap-3 flex-1">
                <div className="flex flex-col gap-1">
                  <Badge variant="secondary" className="w-fit text-xs">
                    {product.category}
                  </Badge>
                  <Link href={`/shop/${shop.slug}/product/${product.id}`}>
                    <h3 className="font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <p className="font-bold text-gray-800">
                    ₦{product.price.toLocaleString()}
                  </p>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="text-sm px-3 py-1.5 rounded-lg text-white transition-colors"
                    style={{
                      backgroundColor: added === product.id ? '#10b981' : shop.themeColor
                    }}
                  >
                    {added === product.id ? '✓ Added!' : 'Add to cart'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            No products found for "{search}"
          </div>
        )}

      </div>
    </div>
  )
}