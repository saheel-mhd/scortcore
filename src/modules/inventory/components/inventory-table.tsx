import type { ReactNode } from 'react'
import { History, SlidersHorizontal } from 'lucide-react'
import type { InventoryVariant } from '@/modules/inventory/types/inventory.types'
import { Button } from '@/ui/button'

type Props = {
  items: InventoryVariant[]
  threshold: number
  onAdjust: (variant: InventoryVariant) => void
  onViewMovements: (variant: InventoryVariant) => void
  emptyMessage?: string
}

export function InventoryTable({
  items,
  threshold,
  onAdjust,
  onViewMovements,
  emptyMessage = 'No stock records yet. Create a product with variants first.',
}: Props) {
  if (items.length === 0) {
    return (
      <div className="flex min-h-32 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-6 text-center">
        <p className="text-sm text-slate-400">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="min-w-full divide-y divide-white/5 text-sm">
        <thead className="bg-slate-950/70 text-left text-xs uppercase tracking-[0.2em] text-slate-400">
          <tr>
            <Th>Product</Th>
            <Th>SKU</Th>
            <Th>Unit</Th>
            <Th className="text-right">Stock</Th>
            <Th className="text-right">Actions</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 bg-slate-950/40">
          {items.map((item) => {
            const isLow = item.isLowStock ?? item.stock <= threshold

            return (
              <tr key={item.id} className="text-slate-200">
                <Td>
                  <span className="font-medium text-white">{item.product.name}</span>
                  {!item.product.isActive ? (
                    <span className="ml-2 rounded bg-white/5 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-slate-400">
                      Inactive
                    </span>
                  ) : null}
                </Td>
                <Td>
                  <code className="rounded bg-white/5 px-2 py-0.5 text-xs text-slate-300">
                    {item.product.sku}
                  </code>
                </Td>
                <Td className="text-slate-300">
                  {item.unit.name}
                  <span className="text-slate-500"> · {item.unit.category.name}</span>
                </Td>
                <Td className="text-right">
                  <span
                    className={`inline-flex min-w-12 justify-center rounded-lg px-2 py-1 tabular-nums ${
                      isLow
                        ? 'bg-amber-400/10 font-semibold text-amber-200'
                        : 'text-slate-200'
                    }`}
                    title={isLow ? `At or below the threshold of ${threshold}` : undefined}
                  >
                    {item.stock}
                  </span>
                </Td>
                <Td className="text-right">
                  <div className="inline-flex items-center gap-1">
                    <Button
                      aria-label={`Adjust stock for ${item.product.name}`}
                      onClick={() => onAdjust(item)}
                      size="sm"
                      variant="outline"
                    >
                      <SlidersHorizontal />
                      Adjust
                    </Button>
                    <Button
                      aria-label={`View stock history for ${item.product.name}`}
                      onClick={() => onViewMovements(item)}
                      size="icon-sm"
                      variant="ghost"
                    >
                      <History />
                    </Button>
                  </div>
                </Td>
              </tr>
            )
          })}
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
