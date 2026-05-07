'use client'

import { Card } from '@/components/ui/card'
import StarRating from '@/components/dashboard/StarRating'
import reviews from '@/mock/reviews'

export default function ReviewsPage() {
  const grouped = reviews.reduce((acc, review) => {
    if (!acc[review.productName]) {
      acc[review.productName] = []
    }
    acc[review.productName].push(review)
    return acc
  }, {})

  function getAverage(productReviews) {
    const total = productReviews.reduce((sum, r) => sum + r.rating, 0)
    return (total / productReviews.length).toFixed(1)
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Reviews</h1>
        <p className="text-sm text-gray-500">{reviews.length} total reviews across all products</p>
      </div>

      {/* Grouped by product */}
      {Object.entries(grouped).map(([productName, productReviews]) => (
        <Card key={productName} className="p-6 flex flex-col gap-4">

          {/* Product header */}
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-800">{productName}</h2>
            <div className="flex items-center gap-2">
              <StarRating rating={Math.round(getAverage(productReviews))} />
              <span className="text-sm text-gray-500">
                {getAverage(productReviews)} avg · {productReviews.length} reviews
              </span>
            </div>
          </div>

          {/* Individual reviews */}
          <div className="flex flex-col divide-y divide-gray-100">
            {productReviews.map((review) => (
              <div key={review.id} className="py-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                      {review.customer.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{review.customer}</p>
                      <p className="text-xs text-gray-400">{review.date}</p>
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