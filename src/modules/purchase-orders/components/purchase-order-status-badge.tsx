import type { PurchaseOrderStatus } from '@/modules/purchase-orders/types/purchase-order.types'

const styles: Record<PurchaseOrderStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-slate-400/10 text-slate-300' },
  ordered: { label: 'Ordered', className: 'bg-sky-400/10 text-sky-200' },
  partially_received: { label: 'Partially received', className: 'bg-amber-400/10 text-amber-200', },
  received: { label: 'Received', className: 'bg-emerald-400/10 text-emerald-200' },
  cancelled: { label: 'Cancelled', className: 'bg-red-500/10 text-red-200' },
}

export function PurchaseOrderStatusBadge({ status }: { status: PurchaseOrderStatus }) {
  const style = styles[status]

  return (
    <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${style.className}`}>
      {style.label}
    </span>
  )
}
