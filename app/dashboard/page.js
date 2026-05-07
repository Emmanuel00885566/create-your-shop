export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-800">Overview</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: 'Products',  value: '12' },
          { label: 'Orders',    value: '8' },
          { label: 'Revenue',   value: '₦24,000' },
          { label: 'Reviews',   value: '5' },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-2">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="text-2xl font-bold text-gray-800">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}