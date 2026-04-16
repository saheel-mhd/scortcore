import type { OrderStatus } from '@/modules/orders/types/order.types'

const styles: Record<OrderStatus, string> = {
  pending: 'bg-amber-500/10 text-amber-300',
  paid: 'bg-sky-500/10 text-sky-300',
  shipped: 'bg-indigo-500/10 text-indigo-300',
  delivered: 'bg-emerald-500/10 text-emerald-300',
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  )
}
