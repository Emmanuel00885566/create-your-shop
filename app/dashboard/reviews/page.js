'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import StarRating from '@/components/dashboard/StarRating'
import api from '@/lib/api'

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
  }, [])

  async function fetchReviews() {
    try {
      const shopsRes = await api.get('/shops')
      const user = JSON.parse(localStorage.getItem('shop_user'))
      const myShop = shopsRes.data.find((s) => s.owner === user?._id)

      if (myShop && myShop.products?.length > 0) {
        const allReviews = []
        for (const product of myShop.products) {
          try {
            const res = await api.get(`/reviews/${product._id}`)
            const productReviews = res.data.reviews || []
            productReviews.forEach((r) => {
              allReviews.push({
                ...r,
                productName: product.product_name,
              })
            })
          } catch {
            continue
          }
        }
        setReviews(allReviews)
      }
    } catch (err) {
      console.error('Error fetching reviews:', err)
    } finally {
      setLoading(false)
    }
  }

  const grouped = reviews.reduce((acc, review) => {
    const key = review.productName || 'Unknown Product'
    if (!acc[key]) acc[key] = []
    acc[key].push(review)
    return acc
  }, {})

  function getAverage(productReviews) {
    const total = productReviews.reduce((sum, r) => sum + r.rating, 0)
    return (total / productReviews.length).toFixed(1)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <p className="text-gray-400">Loading reviews...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">

      <div>
        <h1 className="text-2xl font-bold text-gray-800">Reviews</h1>
        <p className="text-sm text-gray-500">
          {reviews.length} total reviews across all products
        </p>
      </div>

      {Object.keys(grouped).length === 0 && (
        <div className="text-center py-20 text-gray-400">
          No reviews yet. Reviews will appear here when customers leave them!
        </div>
      )}

      {Object.entries(grouped).map(([productName, productReviews]) => (
        <Card key={productName} className="p-6 flex flex-col gap-4">

          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-800">{productName}</h2>
            <div className="flex items-center gap-2">
              <StarRating rating={Math.round(getAverage(productReviews))} />
              <span className="text-sm text-gray-500">
                {getAverage(productReviews)} avg · {productReviews.length} reviews
              </span>
            </div>
          </div>

          <div className="flex flex-col divide-y divide-gray-100">
            {productReviews.map((review) => (
              <div key={review._id} className="py-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
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
                <p className="text-sm text-gray-600 leading-relaxed pl-11">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>

        </Card>
      ))}

    </div>
  )
}