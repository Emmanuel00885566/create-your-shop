'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import useCartStore from '@/store/cartStore'
import api from '@/lib/api'

export default function CheckoutPage() {
  const { shopSlug } = useParams()
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [shop, setShop] = useState(null)
  const [deliveryType, setDeliveryType] = useState('delivery')
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    note: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchShop()
  }, [shopSlug])

  async function fetchShop() {
    try {
      const response = await api.get(`/shops/${shopSlug}`)
      setShop(response.data.shop)
    } catch (err) {
      console.error('Error fetching shop:', err)
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.name || !form.email || !form.phone) {
      setError('Please fill in your name, email and phone number')
      return
    }

    if (deliveryType === 'delivery' && !form.address) {
      setError('Please enter your delivery address')
      return
    }

    if (items.length === 0) {
      setError('Your cart is empty!')
      return
    }

    if (!shop) {
      setError('Shop not found!')
      return
    }

    setLoading(true)
    try {
      const orderData = {
        shop: shop._id,
        customerName: form.name,
        customerEmail: form.email,
        deliveryAddress: deliveryType === 'delivery'
          ? form.address
          : 'Pickup',
        items: items.map((item) => ({
          product: item._id,
          title: item.product_name || item.name,
          price: item.price,
          qty: item.quantity,
        })),
        meta: {
          phone: form.phone,
          note: form.note,
          deliveryType,
        }
      }

      await api.post('/orders/create_order', orderData)
      clearCart()
      router.push(`/shop/${shopSlug}/thankyou`)
    } catch (err) {
      console.error('Order error:', err)
      setError(err.response?.data?.message || 'Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div
          className="w-full px-6 py-4"
          style={{ backgroundColor: shop?.themeColor || '#2563eb' }}
        >
          <Link
            href={`/shop/${shopSlug}`}
            className="text-white opacity-80 hover:opacity-100 text-sm"
          >
            ← Back to shop
          </Link>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-6xl">🛒</p>
          <h2 className="text-xl font-bold text-gray-800">Your cart is empty!</h2>
          <Link href={`/shop/${shopSlug}`}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Go shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top nav */}
      <div
        className="w-full px-6 py-4"
        style={{ backgroundColor: shop?.themeColor || '#2563eb' }}
      >
        <Link
          href={`/shop/${shopSlug}/cart`}
          className="text-white opacity-80 hover:opacity-100 text-sm"
        >
          ← Back to cart
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">

          {/* Left - form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            <Card className="p-6 flex flex-col gap-4">
              <h2 className="text-base font-semibold text-gray-700">
                Contact details
              </h2>

              <div className="flex flex-col gap-2">
                <Label>Full name</Label>
                <Input
                  name="name"
                  placeholder="Emmanuel"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Email</Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Phone number</Label>
                <Input
                  name="phone"
                  placeholder="08012345678"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
            </Card>

            <Card className="p-6 flex flex-col gap-4">
              <h2 className="text-base font-semibold text-gray-700">
                Delivery option
              </h2>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryType('delivery')}
                  className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-colors
                    ${deliveryType === 'delivery'
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  🚚 Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryType('pickup')}
                  className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-colors
                    ${deliveryType === 'pickup'
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  🏪 Pickup
                </button>
              </div>

              {deliveryType === 'delivery' && (
                <div className="flex flex-col gap-2">
                  <Label>Delivery address</Label>
                  <Input
                    name="address"
                    placeholder="12 Lagos Island, Lagos"
                    value={form.address}
                    onChange={handleChange}
                  />
                </div>
              )}

              {deliveryType === 'pickup' && (
                <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                  You will pick up your order directly from our location.
                  We will contact you with pickup details.
                </p>
              )}

              <div className="flex flex-col gap-2">
                <Label>Order note (optional)</Label>
                <textarea
                  name="note"
                  placeholder="Any special instructions..."
                  value={form.note}
                  onChange={handleChange}
                  rows={3}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </Card>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full text-white py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Placing order...' : 'Place order →'}
            </Button>

          </form>

          {/* Right - order summary */}
          <div className="flex flex-col gap-4">
            <Card className="p-6 flex flex-col gap-4">
              <h2 className="text-base font-semibold text-gray-700">
                Order summary
              </h2>

              <div className="flex flex-col divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item._id || item.id} className="flex items-center gap-3 py-3">
                    <img
                      src={item.image
                        ? `http://localhost:5000/${item.image}`
                        : 'https://placehold.co/60x60'}
                      alt={item.product_name || item.name}
                      className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        {item.product_name || item.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-gray-800">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2 pt-2 border-t border-gray-100 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₦{getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between font-bold text-gray-800 text-base pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span>₦{getTotalPrice().toLocaleString()}</span>
                </div>
              </div>

            </Card>

            <p className="text-xs text-gray-400 text-center">
              By placing your order you agree to our terms and conditions
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}