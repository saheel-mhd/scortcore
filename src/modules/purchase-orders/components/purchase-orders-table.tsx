import type { ReactNode } from 'react'
import { PackageCheck } from 'lucide-react'
import { PurchaseOrderStatusBadge } from '@/modules/purchase-orders/components/purchase-order-status-badge'
import type { PurchaseOrder } from '@/modules/purchase-orders/types/purchase-order.types'
import { Button } from '@/ui/button'

type Props = {
  items: PurchaseOrder[]
  onReceive: (purchaseOrder: PurchaseOrder) => void
}

const currencyFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' })

function canReceive(purchaseOrder: PurchaseOrder): boolean {
  return (
    purchaseOrder.status !== 'received' &&
    purchaseOrder.status !== 'cancelled' &&
    purchaseOrder.receivedQuantity < purchaseOrder.quantity
  )
}

export function PurchaseOrdersTable({ items, onReceive }: Props) {
  if (items.length === 0) {
    return (
      <div className="flex min-h-32 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-6 text-center">
        <p className="text-sm text-slate-400">
          No purchase orders yet. Create one to restock a product variant.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="min-w-full divide-y divide-white/5 text-sm">
        <thead className="bg-slate-950/70 text-left text-xs uppercase tracking-[0.2em] text-slate-400">
          <tr>
            <Th>Number</Th>
            <Th>Supplier</Th>
            <Th>Product</Th>
            <Th className="text-right">Received</Th>
            <Th className="text-right">Total cost</Th>
            <Th>Status</Th>
            <Th>Ordered</Th>
            <Th className="text-right">Actions</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 bg-slate-950/40">
          {items.map((item) => (
            <tr key={item.id} className="text-slate-200">
              <Td>
                <code className="rounded bg-white/5 px-2 py-0.5 text-xs text-slate-300">
                  {item.purchaseNumber}
                </code>
              </Td>
              <Td>
                <span className="font-medium text-white">{item.supplierName}</span>
                {item.supplierEmail ? (
                  <span className="block text-xs text-slate-500">{item.supplierEmail}</span>
                ) : null}
              </Td>
              <Td className="text-slate-300">
                {item.productVariant.product.name}
                <span className="block text-xs text-slate-500">
                  {item.productVariant.unit.name} · SKU {item.productVariant.product.sku}
                </span>
              </Td>
              <Td className="text-right tabular-nums">
                <span className="text-white">{item.receivedQuantity}</span>
                <span className="text-slate-500"> / {item.quantity}</span>
              </Td>
              <Td className="text-right tabular-nums text-slate-200">
                ${currencyFormatter.format(item.totalCost)}
                <span className="block text-xs text-slate-500">
                  @ ${currencyFormatter.format(item.unitCost)}
                </span>
              </Td>
              <Td>
                <PurchaseOrderStatusBadge status={item.status} />
              </Td>
              <Td className="whitespace-nowrap text-slate-400">
                {dateFormatter.format(new Date(item.orderedAt))}
              </Td>
              <Td className="text-right">
                {canReceive(item) ? (
                  <Button
                    aria-label={`Receive stock for ${item.purchaseNumber}`}
                    onClick={() => onReceive(item)}
                    size="sm"
                    variant="outline"
                  >
                    <PackageCheck />
                    Receive
                  </Button>
                ) : (
                  <span className="text-xs text-slate-500">—</span>
                )}
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Th({ children, className }: { children: ReactNode; className?: string }) {
  return <th className={`px-4 py-3 font-medium ${className ?? ''}`}>{children}</th>
}

function Td({ children, className }: { children: ReactNode; className?: string }) {
  return <td className={`px-4 py-3 ${className ?? ''}`}>{children}</td>
}
