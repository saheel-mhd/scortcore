import { Eye } from 'lucide-react'
import { Link } from 'react-router-dom'

import { OrderStatusBadge } from '@/modules/orders/components/order-status-badge'
import type { Order } from '@/modules/orders/types/order.types'
import { routePaths } from '@/routes/paths'
import { Button } from '@/ui/button'

type Props = {
  orders: Order[]
}

const currencyFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function OrdersTable({ orders }: Props) {
  if (orders.length === 0) {
    return (
      <div className="flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-8 text-center">
        <p className="text-sm text-slate-400">No orders match your filters.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <table className="min-w-full divide-y divide-white/5 text-sm">
        <thead className="bg-slate-950/70 text-left text-xs uppercase tracking-[0.2em] text-slate-400">
          <tr>
            <Th>Order</Th>
            <Th>Customer</Th>
            <Th>Placed</Th>
            <Th className="text-right">Items</Th>
            <Th className="text-right">Total</Th>
            <Th>Status</Th>
            <Th className="text-right">Actions</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 bg-slate-950/40">
          {orders.map((order) => (
            <tr key={order.id} className="text-slate-200">
              <Td>
                <Link
                  className="font-medium text-white hover:text-sky-300"
                  to={routePaths.ordersDetail.replace(':id', order.id)}
                >
                  {order.orderNumber}
                </Link>
              </Td>
              <Td>
                <p className="truncate">{order.customer?.email ?? '—'}</p>
                <p className="text-xs text-slate-500">{order.customerId}</p>
              </Td>
              <Td className="whitespace-nowrap text-xs text-slate-400">
                {dateFormatter.format(new Date(order.createdAt))}
              </Td>
              <Td className="text-right tabular-nums">{order.items.length}</Td>
              <Td className="text-right tabular-nums">
                ${currencyFormatter.format(order.totalAmount)}
              </Td>
              <Td>
                <OrderStatusBadge status={order.status} />
              </Td>
              <Td className="text-right">
                <Link
                  aria-label={`View ${order.orderNumber}`}
                  to={routePaths.ordersDetail.replace(':id', order.id)}
                >
                  <Button size="icon-sm" variant="ghost">
                    <Eye />
                  </Button>
                </Link>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-4 py-3 font-medium ${className ?? ''}`}>{children}</th>
}

function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 ${className ?? ''}`}>{children}</td>
}
