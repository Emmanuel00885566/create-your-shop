'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import api from '@/lib/api'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      const response = await api.get('/products/products')
      setProducts(response.data)
    } catch (err) {
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(product_name) {
    const confirmed = window.confirm('Are you sure you want to delete this product?')
    if (confirmed) {
      try {
        await api.delete(`/products/product/${product_name}`)
        setProducts((prev) => prev.filter((p) => p.product_name !== product_name))
      } catch (err) {
        alert('Failed to delete product')
      }
    }
  }

  const filtered = products.filter((p) =>
    p.product_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <p className="text-gray-400">Loading products...</p>
      </div>
    )
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
              <th className="px-6 py-3 font-medium">Stock</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50 transition-colors">

                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image
                        ? `http://localhost:5000/${product.image}`
                        : 'https://placehold.co/60x60'}
                      alt={product.product_name}
                      className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                    />
                    <span className="font-medium text-gray-800">
                      {product.product_name}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <Badge variant="secondary">{product.category}</Badge>
                </td>

                <td className="px-6 py-4 font-medium text-gray-800">
                  ₦{Number(product.price).toLocaleString()}
                </td>

                <td className="px-6 py-4 text-gray-500">
                  {product.stock}
                </td>

                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <Link
                      href={`/dashboard/products/${product.product_name}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product.product_name)}
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

        {filtered.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-400">
            {search ? `No products found for "${search}"` : 'No products yet. Add your first one!'}
          </div>
        )}
      </Card>
    </div>
  )
}