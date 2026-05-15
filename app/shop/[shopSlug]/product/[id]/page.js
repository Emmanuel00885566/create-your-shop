'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import StarRating from '@/components/dashboard/StarRating'
import useCartStore from '@/store/cartStore'
import api from '@/lib/api'

export default function ProductDetailPage() {
  const { id, shopSlug } = useParams()
  const router = useRouter()
  const { addItem, getTotalItems } = useCartStore()
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [shop, setShop] = useState(null)
  const [added, setAdded] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [id])

  async function fetchData() {
    try {
      const shopRes = await api.get(`/shops/${shopSlug}`)
      setShop(shopRes.data.shop)
      const shopProducts = shopRes.data.shop.products || []
      const found = shopProducts.find((p) => p._id === id)
      if (found) setProduct(found)

      try {
        const reviewsRes = await api.get(`/reviews/${id}`)
        setReviews(reviewsRes.data.reviews || [])
      } catch {
        setReviews([])
      }
    } catch (err) {
      console.error('Error fetching product:', err)
    } finally {
      setLoading(false)
    }
  }

  function handleAddToCart() {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-400">Loading product...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-400">Product not found</p>
      </div>
    )
  }

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top nav */}
      <div className="w-full px-6 py-4 bg-blue-600">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Link
            href={`/shop/${shopSlug}`}
            className="text-white opacity-80 hover:opacity-100 text-sm"
          >
            ← Back to {shop?.name}
          </Link>
          <Link
            href={`/shop/${shopSlug}/cart`}
            className="bg-white px-4 py-1.5 rounded-full text-sm font-medium text-blue-600"
          >
            🛒 Cart {getTotalItems() > 0 && `(${getTotalItems()})`}
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">

          {/* Product image */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <img
              src={product.image
                ? `http://localhost:5000/${product.image}`
                : 'https://placehold.co/400x400'}
              alt={product.product_name}
              className="w-full h-80 object-cover bg-gray-100"
            />
          </div>

          {/* Product info */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Badge variant="secondary" className="w-fit">
                {product.category}
              </Badge>
              <h1 className="text-2xl font-bold text-gray-800">
                {product.product_name}
              </h1>
              {avgRating && (
                <div className="flex items-center gap-2">
                  <StarRating rating={Math.round(avgRating)} />
                  <span className="text-sm text-gray-500">
                    {avgRating} ({reviews.length} reviews)
                  </span>
                </div>
              )}
            </div>

            <p className="text-3xl font-bold text-gray-800">
              ₦{Number(product.price).toLocaleString()}
            </p>

            {product.description && (
              <p className="text-gray-600 text-sm leading-relaxed">
                {product.description}
              </p>
            )}

            <p className="text-sm text-gray-500">
              Stock: <span className="font-medium text-gray-800">{product.stock}</span>
            </p>

            <div className="flex gap-3 mt-auto">
              <Button
                onClick={handleAddToCart}
                className="flex-1 text-white"
                style={{ backgroundColor: added ? '#10b981' : '#2563eb' }}
              >
                {added ? '✓ Added to cart!' : 'Add to cart'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  addItem(product)
                  router.push(`/shop/${shopSlug}/cart`)
                }}
              >
                Buy now
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews section */}
        <div className="mt-12 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-gray-800">
            Customer Reviews {reviews.length > 0 && `(${reviews.length})`}
          </h2>

          {reviews.length > 0 ? (
            <div className="flex flex-col gap-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                        {review.user?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {review.user?.name || 'Customer'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
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
          ) : (
            <p className="text-gray-400 text-sm">
              No reviews yet for this product!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}