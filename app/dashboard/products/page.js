'use client'

import { useState } from 'react'
import Link from 'next/link'
import initialProducts from '@/mock/products'

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts)

  function handleDelete(id) {
    const confirmed = window.confirm('Are you sure you want to delete this product?')
    if (confirmed) {
      setProducts((prevProducts) => prevProducts.filter((p) => p.id !== id))
    }
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <Link
          href="/dashboard/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Add product
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
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
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                
                <td className="px-6 py-4 flex items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                  />
                  <span className="font-medium text-gray-800">
                    {product.name}
                  </span>
                </td>

                <td className="px-6 py-4 text-gray-500">
                  {product.category}
                </td>

                <td className="px-6 py-4 text-gray-800 font-medium">
                  ₦{product.price.toLocaleString()}
                </td>

                <td className="px-6 py-4 flex gap-3">
                  <Link
                    href={`/dashboard/products/${product.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No products yet. Add your first one!
          </div>
        )}

      </div>
    </div>
  )
}