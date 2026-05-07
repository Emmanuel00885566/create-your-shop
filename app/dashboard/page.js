'use client'

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
import analytics from '@/mock/analytics'
import orders from '@/mock/orders'
import reviews from '@/mock/reviews'

const COLORS = ['#2563eb', '#f59e0b', '#10b981']

export default function DashboardPage() {
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
  const pendingOrders = orders.filter((o) => o.status === 'pending').length
  const avgRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  ).toFixed(1)

  const stats = [
    { label: 'Total orders',    value: orders.length },
    { label: 'Pending orders',  value: pendingOrders },
    { label: 'Total revenue',   value: `₦${totalRevenue.toLocaleString()}` },
    { label: 'Avg rating',      value: `⭐ ${avgRating}` },
  ]

  const statusData = [
    { name: 'Pending',    value: orders.filter((o) => o.status === 'pending').length },
    { name: 'Processing', value: orders.filter((o) => o.status === 'processing').length },
    { name: 'Completed',  value: orders.filter((o) => o.status === 'completed').length },
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

      {/* Stats cards - now using real data! */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6 flex flex-col gap-2">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        {/* Orders bar chart */}
        <Card className="p-6 flex flex-col gap-4">
          <h2 className="text-base font-semibold text-gray-700">Orders per month</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={analytics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="orders" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Revenue line chart */}
        <Card className="p-6 flex flex-col gap-4">
          <h2 className="text-base font-semibold text-gray-700">Revenue trend (₦)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={analytics}>
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

        {/* Order status pie chart */}
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

        {/* Recent orders */}
        <Card className="p-6 flex flex-col gap-4">
          <h2 className="text-base font-semibold text-gray-700">Recent orders</h2>
          <div className="flex flex-col divide-y divide-gray-100">
            {orders.slice(0, 3).map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-800">{order.customer}</p>
                  <p className="text-xs text-gray-400">{order.date}</p>
                </div>
                <p className="text-sm font-bold text-gray-800">
                  ₦{order.total.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </Card>

      </div>

    </div>
  )
}