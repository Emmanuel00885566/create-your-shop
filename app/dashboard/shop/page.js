'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/AuthContext'
import api from '@/lib/api'

export default function ShopSetupPage() {
  const { user } = useAuth()

  const [shopName, setShopName] = useState('')
  const [description, setDescription] = useState('')
  const [logo, setLogo] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const [existingShop, setExistingShop] = useState(null)

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (user?._id) {
      fetchMyShop()
    }
  }, [user])

  async function fetchMyShop() {
    try {
      setFetching(true)

      const response = await api.get('/shops')
      const shops = response.data

      const myShop = shops.find(
        (s) => s.owner === user?._id || s.owner?._id === user?._id
      )

      if (myShop) {
        setExistingShop(myShop)
        setShopName(myShop.name || '')
        setDescription(myShop.description || '')
        setLogoPreview(myShop.logoUrl || null)
      }
    } catch (err) {
      console.error('Error fetching shop:', err)
    } finally {
      setFetching(false)
    }
  }

  function handleLogoChange(e) {
    const file = e.target.files[0]

    if (file) {
      setLogo(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()

    setError('')
    setMessage('')

    if (!shopName.trim()) {
      setError('Shop name is required')
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()

      formData.append('name', shopName)
      formData.append('description', description)

      if (logo) {
        formData.append('logo', logo)
      }

      if (existingShop) {
        await api.put('/shops/update_shop', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        setMessage('Shop updated successfully! ✅')
      } else {
        const response = await api.post(
          '/shops/create_shop',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )

        setExistingShop(response.data.shop)

        setMessage('Shop created successfully! ✅')
      }

      fetchMyShop()
    } catch (err) {
      console.error(err)

      setError(
        err.response?.data?.message || 'Something went wrong'
      )
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <p className="text-gray-400">Loading your shop...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Shop Setup
        </h1>

        <p className="text-sm text-gray-500">
          {existingShop
            ? 'Update your shop details'
            : 'Create your shop to get started'}
        </p>
      </div>

      {/* Existing shop notice */}
      {existingShop && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700">
          ✅ Your shop is live at{' '}

          <a
            href={`/shop/${existingShop.slug}`}
            className="font-medium underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            /shop/{existingShop.slug}
          </a>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6"
      >

        {/* Basic info */}
        <Card className="p-6 flex flex-col gap-4">

          <h2 className="text-base font-semibold text-gray-700">
            Basic Information
          </h2>

          <div className="flex flex-col gap-2">
            <Label>Shop Name</Label>

            <Input
              placeholder="e.g. Emmanuel's Store"
              value={shopName}
              onChange={(e) =>
                setShopName(e.target.value)
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Description</Label>

            <textarea
              placeholder="Tell customers what your shop is about..."
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              rows={4}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

        </Card>

        {/* Logo upload */}
        <Card className="p-6 flex flex-col gap-4">

          <h2 className="text-base font-semibold text-gray-700">
            Shop Logo
          </h2>

          <div className="flex items-center gap-4">

            {/* Preview */}
            <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50">

              {logoPreview ? (
                <img
                  src={
                    logoPreview?.startsWith('blob')
                      ? logoPreview
                      : `http://localhost:5000/${logoPreview}`
                  }
                  alt="Logo Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl">🏪</span>
              )}

            </div>

            {/* Upload */}
            <div className="flex flex-col gap-2">

              <Label>Upload Logo</Label>

              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="text-sm text-gray-500"
              />

              <p className="text-xs text-gray-400">
                PNG, JPG up to 5MB
              </p>

            </div>

          </div>

        </Card>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm">
            {error}
          </p>
        )}

        {/* Success */}
        {message && (
          <p className="text-green-600 text-sm">
            {message}
          </p>
        )}

        {/* Submit button */}
        <div className="flex items-center gap-4">

          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? 'Saving...'
              : existingShop
              ? 'Update Shop'
              : 'Create Shop'}
          </Button>

        </div>

      </form>
    </div>
  )
}