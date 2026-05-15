'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import api from '@/lib/api'

const COLORS = ['#2563eb', '#f59e0b', '#10b981']

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const user = JSON.parse(localStorage.getItem('shop_user'))
      const shopsRes = await api.get('/shops')
      const myShop = shopsRes.data.find((s) => s.owner === user?._id)

      if (myShop) {
        const ordersRes = await api.get(`/orders/list_orders?shopId=${myShop._id}`)
        const allOrders = ordersRes.data
        setOrders(allOrders)

        const productsRes = await api.get('/products/products')

        const totalRevenue = allOrders
          .filter((o) => o.status === 'completed')
          .reduce((sum, o) => sum + o.total, 0)

        const pendingOrders = allOrders.filter((o) => o.status === 'pending').length
        const completedOrders = allOrders.filter((o) => o.status === 'completed').length
        const processingOrders = allOrders.filter((o) => o.status === 'processing').length

        const monthlyMap = {}
        allOrders.forEach((order) => {
          const month = new Date(order.createdAt).toLocaleString('default', { month: 'short' })
          if (!monthlyMap[month]) monthlyMap[month] = { month, orders: 0, revenue: 0 }
          monthlyMap[month].orders++
          if (order.status === 'completed') {
            monthlyMap[month].revenue += order.total
          }
        })

        setStats({
          totalProducts: productsRes.data.length,
          totalOrders: allOrders.length,
          totalRevenue,
          pendingOrders,
          completedOrders,
          processingOrders,
          monthlyStats: Object.values(monthlyMap),
        })
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <p className="text-gray-400">Loading dashboard...</p>
      </div>
    )
  }

  const statusData = [
    { name: 'Pending', value: stats?.pendingOrders || 0 },
    { name: 'Processing', value: stats?.processingOrders || 0 },
    { name: 'Completed', value: stats?.completedOrders || 0 },
  ]

  const cardStats = [
    { label: 'Total orders', value: stats?.totalOrders || 0 },
    { label: 'Pending orders', value: stats?.pendingOrders || 0 },
    { label: 'Revenue', value: `₦${(stats?.totalRevenue || 0).toLocaleString()}` },
    { label: 'Products', value: stats?.totalProducts || 0 },
  ]

  return (
    <div className="flex flex-col gap-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Overview</h1>
          <p className="text-sm text-gray-500">Welcome back, Shop Owner!</p>
        </div>
        <Badge>Live</Badge>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {cardStats.map((stat) => (
          <Card key={stat.label} className="p-6 flex flex-col gap-2">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        <Card className="p-6 flex flex-col gap-4">
          <h2 className="text-base font-semibold text-gray-700">Orders per month</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats?.monthlyStats || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="orders" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 flex flex-col gap-4">
          <h2 className="text-base font-semibold text-gray-700">Revenue trend (₦)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats?.monthlyStats || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        <Card className="p-6 flex flex-col gap-4">
          <h2 className="text-base font-semibold text-gray-700">Orders by status</h2>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 min-w-fit">
              {statusData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="text-gray-600">{item.name}</span>
                  <span className="font-medium text-gray-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6 flex flex-col gap-4">
          <h2 className="text-base font-semibold text-gray-700">Recent orders</h2>
          <div className="flex flex-col divide-y divide-gray-100">
            {orders.slice(0, 4).map((order) => (
              <div key={order._id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-800">{order.customerName}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-sm font-bold text-gray-800">
                  ₦{Number(order.total).toLocaleString()}
                </p>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-gray-400 text-sm py-4 text-center">No orders yet</p>
            )}
          </div>
        </Card>

      </div>

    </div>
  )
}