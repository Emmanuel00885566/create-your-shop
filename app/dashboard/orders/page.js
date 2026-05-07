'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import OrderStatusBadge from '@/components/dashboard/OrderStatusBadge'
import initialOrders from '@/mock/orders'

const tabs = ['all', 'pending', 'processing', 'completed']

export default function OrdersPage() {
  const [orders] = useState(initialOrders)
  const [activeTab, setActiveTab] = useState('all')

  const filtered = activeTab === 'all'
    ? orders
    : orders.filter((o) => o.status === activeTab)

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        <p className="text-sm text-gray-500">{orders.length} total orders</p>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors
              ${activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders table */}
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-6 py-3 font-medium">Order ID</th>
              <th className="px-6 py-3 font-medium">Customer</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Total</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">

                <td className="px-6 py-4 font-medium text-gray-800">
                  #00{order.id}
                </td>

                <td className="px-6 py-4">
                  <p className="font-medium text-gray-800">{order.customer}</p>
                  <p className="text-gray-400 text-xs">{order.email}</p>
                </td>

                <td className="px-6 py-4 text-gray-500">
                  {order.date}
                </td>

                <td className="px-6 py-4 font-medium text-gray-800">
                  ₦{order.total.toLocaleString()}
                </td>

                <td className="px-6 py-4">
                  <OrderStatusBadge status={order.status} />
                </td>

                <td className="px-6 py-4">
                  <Link
                    href={`/dashboard/orders/${order.id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View
                  </Link>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No {activeTab} orders found
          </div>
        )}

      </Card>
    </div>
  )
}