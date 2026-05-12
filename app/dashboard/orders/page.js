'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import OrderStatusBadge from '@/components/dashboard/OrderStatusBadge'
import api from '@/lib/api'

const tabs = ['all', 'pending', 'processing', 'completed', 'cancelled']

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [loading, setLoading] = useState(true)
  const [shopId, setShopId] = useState(null)

  useEffect(() => {
    fetchShopThenOrders()
  }, [])

  async function fetchShopThenOrders() {
    try {
      const shopsRes = await api.get('/shops')
      const allShops = shopsRes.data
      const token = localStorage.getItem('shop_token')
      const user = JSON.parse(localStorage.getItem('shop_user'))
      const myShop = allShops.find((s) => s.owner === user?._id)
      if (myShop) {
        setShopId(myShop._id)
        const ordersRes = await api.get(`/orders/list_orders?shopId=${myShop._id}`)
        setOrders(ordersRes.data)
      }
    } catch (err) {
      console.error('Error fetching orders:', err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = activeTab === 'all'
    ? orders
    : orders.filter((o) => o.status === activeTab)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <p className="text-gray-400">Loading orders...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">

      <div>
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        <p className="text-sm text-gray-500">{orders.length} total orders</p>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap">
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
              <tr key={order._id} className="hover:bg-gray-50 transition-colors">

                <td className="px-6 py-4 font-medium text-gray-800">
                  #{order._id.slice(-5).toUpperCase()}
                </td>

                <td className="px-6 py-4">
                  <p className="font-medium text-gray-800">{order.customerName}</p>
                  <p className="text-gray-400 text-xs">{order.customerEmail}</p>
                </td>

                <td className="px-6 py-4 text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>

                <td className="px-6 py-4 font-medium text-gray-800">
                  ₦{Number(order.total).toLocaleString()}
                </td>

                <td className="px-6 py-4">
                  <OrderStatusBadge status={order.status} />
                </td>

                <td className="px-6 py-4">
                  <Link
                    href={`/dashboard/orders/${order._id}`}
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
            No {activeTab === 'all' ? '' : activeTab} orders yet
          </div>
        )}
      </Card>
    </div>
  )
}