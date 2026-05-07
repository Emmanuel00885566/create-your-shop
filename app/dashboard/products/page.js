'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import initialProducts from '@/mock/products'

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch] = useState('')

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  function handleDelete(id) {
    const confirmed = window.confirm('Are you sure you want to delete this product?')
    if (confirmed) {
      setProducts((prev) => prev.filter((p) => p.id !== id))
    }
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-sm text-gray-500">{products.length} products in your shop</p>
        </div>
        <Link href="/dashboard/products/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            + Add product
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Input
        placeholder="Search by name or category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {/* Table */}
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-6 py-3 font-medium">Product</th>
              <th className="px-6 py-3 font-medium">Category</th>
              <th className="px-6 py-3 font-medium">Price</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">

                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                    />
                    <span className="font-medium text-gray-800">{product.name}</span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <Badge variant="secondary">{product.category}</Badge>
                </td>

                <td className="px-6 py-4 text-gray-800 font-medium">
                  ₦{product.price.toLocaleString()}
                </td>

                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <Link
                      href={`/dashboard/products/${product.id}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            {search ? `No products found for "${search}"` : 'No products yet. Add your first one!'}
          </div>
        )}

      </Card>
    </div>
  )
}