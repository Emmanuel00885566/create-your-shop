'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import StarRating from '@/components/dashboard/StarRating'
import useCartStore from '@/store/cartStore'
import useProductStore from '@/store/productStore'
import reviews from '@/mock/reviews'
import shop from '@/mock/shop'

export default function ProductDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { products } = useProductStore()
  const { addItem, getTotalItems } = useCartStore()
  const [added, setAdded] = useState(false)

  const product = products.find((p) => p.id === Number(id))
  const productReviews = reviews.filter((r) => r.productName === product?.name)
  const avgRating = productReviews.length
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
    : null

  function handleAddToCart() {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-400">Product not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top nav */}
      <div
        className="w-full px-6 py-4 flex items-center justify-between"
        style={{ backgroundColor: shop.themeColor }}
      >
        <Link
          href={`/shop/${shop.slug}`}
          className="text-white opacity-80 hover:opacity-100 text-sm"
        >
          ← Back to {shop.name}
        </Link>
        <Link
          href={`/shop/${shop.slug}/cart`}
          className="bg-white px-4 py-1.5 rounded-full text-sm font-medium"
          style={{ color: shop.themeColor }}
        >
          🛒 Cart {getTotalItems() > 0 && `(${getTotalItems()})`}
        </Link>
      </div>

      {/* Product content */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">

          {/* Product image */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-80 object-cover bg-gray-100"
            />
          </div>

          {/* Product info */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Badge variant="secondary" className="w-fit">
                {product.category}
              </Badge>
              <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>

              {avgRating && (
                <div className="flex items-center gap-2">
                  <StarRating rating={Math.round(avgRating)} />
                  <span className="text-sm text-gray-500">
                    {avgRating} ({productReviews.length} reviews)
                  </span>
                </div>
              )}
            </div>

            <p className="text-3xl font-bold text-gray-800">
              ₦{product.price.toLocaleString()}
            </p>

            {product.description && (
              <p className="text-gray-600 text-sm leading-relaxed">
                {product.description}
              </p>
            )}

            <div className="flex gap-3 mt-auto">
              <Button
                onClick={handleAddToCart}
                className="flex-1 text-white"
                style={{
                  backgroundColor: added ? '#10b981' : shop.themeColor
                }}
              >
                {added ? '✓ Added to cart!' : 'Add to cart'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  addItem(product)
                  router.push(`/shop/${shop.slug}/cart`)
                }}
              >
                Buy now
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews section */}
        {productReviews.length > 0 && (
          <div className="mt-12 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-gray-800">
              Customer Reviews ({productReviews.length})
            </h2>
            <div className="flex flex-col gap-4">
              {productReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                        {review.customer.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {review.customer}
                        </p>
                        <p className="text-xs text-gray-400">{review.date}</p>
                      </div>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed pl-12">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}