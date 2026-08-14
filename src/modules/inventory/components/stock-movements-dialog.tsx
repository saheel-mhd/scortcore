import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { extractErrorMessage } from '@/api/client'
import { useInventoryMovements } from '@/modules/inventory/hooks/use-inventory'
import type { InventoryMovement, InventoryMovementType, InventoryVariant, } from '@/modules/inventory/types/inventory.types'
import { PaginationControls } from '@/shared/pagination-controls'
import { Button } from '@/ui/button'

type Props = {
  open: boolean
  variant: InventoryVariant | null
  onClose: () => void
}

const PAGE_SIZE = 10

const movementLabels: Record<InventoryMovementType, string> = {
  set: 'Set',
  increase: 'Added',
  decrease: 'Removed',
  order: 'Customer order',
  purchase_order: 'Purchase order',
}

const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short',})

export function StockMovementsDialog({ open, variant, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-auto h-fit w-fit max-w-[95vw] rounded-3xl border border-white/10 bg-slate-950/95 p-0 text-white backdrop:bg-slate-950/70 backdrop:backdrop-blur-sm"
      onClose={onClose}
    >
      {variant ? (
        <MovementsBody key={variant.id} onClose={onClose} variant={variant} />
      ) : null}
    </dialog>
  )
}

function MovementsBody({
  variant,
  onClose,
}: {
  variant: InventoryVariant
  onClose: () => void
}) {
  const [page, setPage] = useState(1)

  const query = useInventoryMovements(variant.id, {
    page,
    limit: PAGE_SIZE,
    sortOrder: 'desc',
  })

  return (
    <div className="flex w-[min(46rem,95vw)] flex-col gap-5 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Inventory</p>
          <h2 className="mt-1 text-lg font-semibold">Stock history</h2>
          <p className="mt-1 text-sm text-slate-400">
            {variant.product.name} · {variant.unit.name} · current stock {variant.stock}
          </p>
        </div>
        <Button aria-label="Close" onClick={onClose} size="icon-sm" type="button" variant="ghost">
          <X />
        </Button>
      </div>

      {query.isLoading ? (
        <p className="text-sm text-slate-400">Loading movements…</p>
      ) : query.isError ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          {extractErrorMessage(query.error, 'Failed to load stock history')}
        </p>
      ) : query.data && query.data.items.length > 0 ? (
        <>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="min-w-full divide-y divide-white/5 text-sm">
              <thead className="bg-slate-950/70 text-left text-xs uppercase tracking-[0.2em] text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">When</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 text-right font-medium">Change</th>
                  <th className="px-4 py-3 text-right font-medium">Stock after</th>
                  <th className="px-4 py-3 font-medium">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-slate-950/40">
                {query.data.items.map((movement) => (
                  <MovementRow key={movement.id} movement={movement} />
                ))}
              </tbody>
            </table>
          </div>

          <PaginationControls
            limit={query.data.pagination.limit}
            onChange={setPage}
            page={query.data.pagination.page}
            total={query.data.pagination.total}
            totalPages={query.data.pagination.totalPages}
          />
        </>
      ) : (
        <div className="flex min-h-24 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-6 text-center">
          <p className="text-sm text-slate-400">
            No movements recorded for this variant yet.
          </p>
        </div>
      )}
    </div>
  )
}

function MovementRow({ movement }: { movement: InventoryMovement }) {
  const isPositive = movement.quantityChange > 0

  return (
    <tr className="text-slate-200">
      <td className="px-4 py-3 whitespace-nowrap text-slate-300">
        {dateFormatter.format(new Date(movement.createdAt))}
      </td>
      <td className="px-4 py-3">
        <span className="rounded bg-white/5 px-2 py-0.5 text-xs text-slate-300">
          {movementLabels[movement.type]}
        </span>
      </td>
      <td
        className={`px-4 py-3 text-right tabular-nums ${
          isPositive ? 'text-emerald-300' : movement.quantityChange < 0 ? 'text-amber-300' : 'text-slate-400'
        }`}
      >
        {isPositive ? '+' : ''}
        {movement.quantityChange}
      </td>
      <td className="px-4 py-3 text-right tabular-nums text-white">{movement.nextStock}</td>
      <td className="max-w-xs px-4 py-3 text-slate-400">{movement.reason ?? '—'}</td>
    </tr>
  )
}
