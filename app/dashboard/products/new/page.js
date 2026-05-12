'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/AuthContext'
import api from '@/lib/api'

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
  const { user } = useAuth()

  const [shopId, setShopId] = useState(null)

  const [form, setForm] = useState({
    product_name: '',
    price: '',
    category: '',
    description: '',
    stock: '',
  })

  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user?._id) {
      fetchMyShop()
    }
  }, [user])

  async function fetchMyShop() {
    try {
      const response = await api.get('/shops')

      const shops = response.data

      const myShop = shops.find(
        (s) => s.owner === user?._id || s.owner?._id === user?._id
      )

      if (myShop) {
        setShopId(myShop._id)
      }
    } catch (err) {
      console.error('Error fetching shop:', err)
    }
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  function handleImageChange(e) {
    const file = e.target.files[0]

    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()

    setError('')

    if (!form.product_name || !form.price || !form.category) {
      setError('Please fill in name, price and category')
      return
    }

    if (isNaN(form.price) || Number(form.price) <= 0) {
      setError('Please enter a valid price')
      return
    }

    if (!shopId) {
      setError('You need to create a shop first!')
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()

      formData.append('product_name', form.product_name)
      formData.append('price', form.price)
      formData.append('category', form.category)
      formData.append('description', form.description)
      formData.append('stock', form.stock || 0)
      formData.append('shop', shopId)

      if (image) {
        formData.append('image', image)
      }

      await api.post('/products/create_product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setSaved(true)

      setTimeout(() => {
        router.push('/dashboard/products')
      }, 1500)
    } catch (err) {
      console.error(err)

      setError(
        err.response?.data?.message || 'Failed to create product'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">

      {/* Header */}
      <div className="flex items-center gap-4">

        <button
          type="button"
          onClick={() => router.back()}
          className="text-gray-400 hover:text-gray-600 text-xl"
        >
          ←
        </button>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Add Product
          </h1>

          <p className="text-sm text-gray-500">
            Fill in the details below
          </p>
        </div>

      </div>

      {/* No shop warning */}
      {!shopId && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-700">
          ⚠️ You need to create a shop first before adding products!{' '}

          <a
            href="/dashboard/shop"
            className="font-medium underline"
          >
            Create shop →
          </a>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6"
      >

        {/* Product details */}
        <Card className="p-6 flex flex-col gap-4">

          <h2 className="text-base font-semibold text-gray-700">
            Product Details
          </h2>

          {/* Product name */}
          <div className="flex flex-col gap-2">

            <Label>Product Name</Label>

            <Input
              name="product_name"
              placeholder="e.g. Wireless Earbuds"
              value={form.product_name}
              onChange={handleChange}
            />

          </div>

          {/* Price + Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Price */}
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

            {/* Category */}
            <div className="flex flex-col gap-2">

              <Label>Category</Label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">
                  Select category
                </option>

                {categories.map((cat) => (
                  <option
                    key={cat}
                    value={cat}
                  >
                    {cat}
                  </option>
                ))}

              </select>

            </div>

          </div>

          {/* Stock */}
          <div className="flex flex-col gap-2">

            <Label>Stock Quantity</Label>

            <Input
              name="stock"
              type="number"
              placeholder="e.g. 50"
              value={form.stock}
              onChange={handleChange}
            />

          </div>

          {/* Description */}
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

        {/* Image upload */}
        <Card className="p-6 flex flex-col gap-4">

          <h2 className="text-base font-semibold text-gray-700">
            Product Image
          </h2>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm text-gray-500"
          />

          <div className="w-full h-48 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50">

            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <p className="text-gray-400 text-sm">
                Image preview will appear here
              </p>
            )}

          </div>

        </Card>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm">
            {error}
          </p>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-4">

          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={saved || loading || !shopId}
          >
            {saved
              ? '✅ Product saved!'
              : loading
              ? 'Saving...'
              : 'Save product'}
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