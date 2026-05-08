'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import shop from '@/mock/shop'

export default function ThankYouPage() {
  const { shopSlug } = useParams()
  const [show, setShow] = useState(false)
  const [orderNumber] = useState(() =>
    Math.floor(Math.random() * 90000) + 10000
  )

  useEffect(() => {
    setTimeout(() => setShow(true), 100)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Top nav */}
      <div
        className="w-full px-6 py-4"
        style={{ backgroundColor: shop.themeColor }}
      >
        <span className="text-white font-bold">{shop.name}</span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div
          className={`flex flex-col items-center gap-6 text-center max-w-md transition-all duration-700
            ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >

          {/* Animated checkmark */}
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl transition-all duration-500 delay-300
              ${show ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
            style={{ backgroundColor: shop.themeColor }}
          >
            ✓
          </div>

          {/* Message */}
          <div
            className={`flex flex-col gap-2 transition-all duration-500 delay-500
              ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <h1 className="text-3xl font-bold text-gray-800">
              Thank you for shopping! 🎉
            </h1>
            <p className="text-gray-500">
              Your order has been placed successfully.
              We will contact you soon with updates!
            </p>
          </div>

          {/* Order number */}
          <div
            className={`bg-white rounded-2xl shadow-sm px-8 py-4 flex flex-col gap-1 transition-all duration-500 delay-700
              ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <p className="text-sm text-gray-400">Order number</p>
            <p className="text-2xl font-bold" style={{ color: shop.themeColor }}>
              #{orderNumber}
            </p>
          </div>

          {/* What happens next */}
          <div
            className={`bg-white rounded-2xl shadow-sm p-6 w-full flex flex-col gap-3 text-left transition-all duration-500 delay-1000
              ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <h2 className="text-sm font-semibold text-gray-700">What happens next?</h2>
            <div className="flex flex-col gap-2">
              {[
                { step: '1', text: 'We confirm your order and payment' },
                { step: '2', text: 'We prepare and package your items' },
                { step: '3', text: 'Your order is delivered to you' },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-3 text-sm">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: shop.themeColor }}
                  >
                    {item.step}
                  </div>
                  <span className="text-gray-600">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div
            className={`flex gap-3 w-full transition-all duration-500 delay-1000
              ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <Link href={`/shop/${shopSlug}`} className="flex-1">
              <Button
                className="w-full text-white"
                style={{ backgroundColor: shop.themeColor }}
              >
                Continue shopping
              </Button>
            </Link>
          </div>

        </div>
      </div>

    </div>
  )
}