'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import OrderStatusBadge from '@/components/dashboard/OrderStatusBadge'
import initialOrders from '@/mock/orders'

const statusFlow = {
  pending:    'processing',
  processing: 'completed',
  completed:  null,
}

const statusLabel = {
  pending:    'Mark as Processing',
  processing: 'Mark as Completed',
  completed:  'Order Completed',
}

export default function OrderDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [orders, setOrders] = useState(initialOrders)

  const order = orders.find((o) => o.id === Number(id))

  function handleStatusUpdate() {
    const nextStatus = statusFlow[order.status]
    if (!nextStatus) return
    setOrders((prev) =>
      prev.map((o) =>
        o.id === Number(id) ? { ...o, status: nextStatus } : o
      )
    )
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Order not found</p>
      </div>
    )
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
          <h1 className="text-2xl font-bold text-gray-800">Order #00{order.id}</h1>
          <p className="text-sm text-gray-500">{order.date}</p>
        </div>
        <div className="ml-auto">
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      {/* Customer info */}
      <Card className="p-6 flex flex-col gap-3">
        <h2 className="text-base font-semibold text-gray-700">Customer details</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Name</p>
            <p className="font-medium text-gray-800">{order.customer}</p>
          </div>
          <div>
            <p className="text-gray-400">Email</p>
            <p className="font-medium text-gray-800">{order.email}</p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-400">Delivery address</p>
            <p className="font-medium text-gray-800">{order.address}</p>
          </div>
        </div>
      </Card>

      {/* Order items */}
      <Card className="p-6 flex flex-col gap-4">
        <h2 className="text-base font-semibold text-gray-700">Order items</h2>
        <div className="flex flex-col divide-y divide-gray-100">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
              </div>
              <p className="font-medium text-gray-800">
                ₦{(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <p className="font-semibold text-gray-800">Total</p>
          <p className="font-bold text-lg text-blue-600">
            ₦{order.total.toLocaleString()}
          </p>
        </div>
      </Card>

      {/* Status update */}
      <Card className="p-6 flex flex-col gap-4">
        <h2 className="text-base font-semibold text-gray-700">Update order status</h2>
        <p className="text-sm text-gray-500">
          Current status: <span className="font-medium capitalize">{order.status}</span>
          {order.status !== 'completed' && (
            <span className="text-gray-400">
              {' '}→ next: <span className="capitalize">{statusFlow[order.status]}</span>
            </span>
          )}
        </p>
        <Button
          onClick={handleStatusUpdate}
          disabled={order.status === 'completed'}
          className={`w-fit ${
            order.status === 'completed'
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed hover:bg-gray-100'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {statusLabel[order.status]}
        </Button>
      </Card>

    </div>
  )
}