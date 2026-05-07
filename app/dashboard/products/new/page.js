'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import useProductStore from '@/store/productStore'

const categories = [
  'Electronics',
  'Fashion',
  'Home & Living',
  'Health',
  'Food & Drinks',
  'Sports',
  'Beauty',
  'Other',
]

export default function NewProductPage() {
  const router = useRouter()
  const { addProduct } = useProductStore()
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    image: '',
  })
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.name || !form.price || !form.category) {
      setError('Please fill in name, price and category')
      return
    }

    if (isNaN(form.price) || Number(form.price) <= 0) {
      setError('Please enter a valid price')
      return
    }

    addProduct({ ...form, price: Number(form.price) })
    setSaved(true)
    setTimeout(() => {
      router.push('/dashboard/products')
    }, 1500)
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">

      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-gray-600 text-xl"
        >
          ←
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Add product</h1>
          <p className="text-sm text-gray-500">Fill in the details below</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* Basic details */}
        <Card className="p-6 flex flex-col gap-4">
          <h2 className="text-base font-semibold text-gray-700">Product details</h2>

          <div className="flex flex-col gap-2">
            <Label>Product name</Label>
            <Input
              name="name"
              placeholder="e.g. Wireless Earbuds"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Price (₦)</Label>
              <Input
                name="price"
                type="number"
                placeholder="e.g. 15000"
                value={form.price}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Category</Label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Description</Label>
            <textarea
              name="description"
              placeholder="Describe your product..."
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </Card>

        {/* Image */}
        <Card className="p-6 flex flex-col gap-4">
          <h2 className="text-base font-semibold text-gray-700">Product image</h2>
          <div className="flex flex-col gap-2">
            <Label>Image URL</Label>
            <Input
              name="image"
              placeholder="https://example.com/image.jpg"
              value={form.image}
              onChange={handleChange}
            />
          </div>

          <div className="w-full h-48 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50">
            {form.image ? (
              <img
                src={form.image}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            ) : (
              <p className="text-gray-400 text-sm">Image preview will appear here</p>
            )}
          </div>
        </Card>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <div className="flex items-center gap-4">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={saved}
          >
            {saved ? '✅ Product saved!' : 'Save product'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>

      </form>
    </div>
  )
}