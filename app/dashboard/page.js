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
} from 'recharts'
import analytics from '@/mock/analytics'

const stats = [
  { label: 'Products',  value: '12' },
  { label: 'Orders',    value: '57' },
  { label: 'Revenue',   value: '₦499,000' },
  { label: 'Reviews',   value: '23' },
]

export default function DashboardPage() {
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
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6 flex flex-col gap-2">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Charts row */}
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

    </div>
  )
}