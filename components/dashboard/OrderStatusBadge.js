import { Badge } from '@/components/ui/badge'

export default function OrderStatusBadge({ status }) {
  const styles = {
    pending:    'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
    processing: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
    completed:  'bg-green-100 text-green-700 hover:bg-green-100',
  }

  return (
    <Badge className={styles[status] || 'bg-gray-100 text-gray-700'}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}