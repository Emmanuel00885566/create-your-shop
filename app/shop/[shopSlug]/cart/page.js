'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import useCartStore from '@/store/cartStore'
import shop from '@/mock/shop'

export default function CartPage() {
  const { shopSlug } = useParams()
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">

        {/* Top nav */}
        <div
          className="w-full px-6 py-4"
          style={{ backgroundColor: shop.themeColor }}
        >
          <Link
            href={`/shop/${shopSlug}`}
            className="text-white opacity-80 hover:opacity-100 text-sm"
          >
            ← Back to {shop.name}
          </Link>
        </div>

        {/* Empty state */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-6xl">🛒</p>
          <h2 className="text-xl font-bold text-gray-800">Your cart is empty</h2>
          <p className="text-gray-500 text-sm">Add some products to get started!</p>
          <Link href={`/shop/${shopSlug}`}>
            <Button style={{ backgroundColor: shop.themeColor }}>
              Continue shopping
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
        style={{ backgroundColor: shop.themeColor }}
      >
        <Link
          href={`/shop/${shopSlug}`}
          className="text-white opacity-80 hover:opacity-100 text-sm"
        >
          ← Back to {shop.name}
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-6">

        <h1 className="text-2xl font-bold text-gray-800">
          Your Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
        </h1>

        {/* Cart items */}
        <Card className="overflow-hidden">
          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4">

                {/* Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                />

                {/* Name and price */}
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    ₦{item.price.toLocaleString()} each
                  </p>
                </div>

                {/* Quantity controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    −
                  </button>
                  <span className="w-6 text-center font-medium text-gray-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Item total */}
                <p className="font-bold text-gray-800 min-w-24 text-right">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </p>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-400 hover:text-red-600 transition-colors text-lg"
                >
                  ×
                </button>

              </div>
            ))}
          </div>
        </Card>

        {/* Order summary */}
        <Card className="p-6 flex flex-col gap-4">
          <h2 className="text-base font-semibold text-gray-700">Order summary</h2>

          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({items.length} items)</span>
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

          <Link href={`/shop/${shopSlug}/checkout`}>
            <Button
              className="w-full text-white"
              style={{ backgroundColor: shop.themeColor }}
            >
              Proceed to checkout →
            </Button>
          </Link>

        </Card>

      </div>
    </div>
  )
}