import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Loader2, X } from 'lucide-react'
import { extractErrorMessage } from '@/api/client'
import { useAdjustStock } from '@/modules/inventory/hooks/use-inventory'
import type { InventoryVariant, StockOperation, } from '@/modules/inventory/types/inventory.types'
import { Button } from '@/ui/button'

type Props = {
  open: boolean
  variant: InventoryVariant | null
  onClose: () => void
}

const inputClasses = 'w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/50 focus:outline-none'

const operations: { value: StockOperation; label: string; hint: string }[] = [
  { value: 'increase', label: 'Add', hint: 'Add units to the current stock.' },
  { value: 'decrease', label: 'Remove', hint: 'Remove units from the current stock.' },
  { value: 'set', label: 'Set to', hint: 'Overwrite the stock with an exact count.' },
]

function resolveNextStock(
  currentStock: number,
  operation: StockOperation,
  quantity: number,
): number {
  if (operation === 'set') return quantity
  if (operation === 'increase') return currentStock + quantity
  return currentStock - quantity
}

export function StockAdjustDialog({ open, variant, onClose }: Props) {
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
      className="fixed inset-0 m-auto h-fit w-fit max-w-[90vw] rounded-3xl border border-white/10 bg-slate-950/95 p-0 text-white backdrop:bg-slate-950/70 backdrop:backdrop-blur-sm"
      onClose={onClose}
    >
      {variant ? (
        <AdjustForm key={variant.id} onClose={onClose} variant={variant} />
      ) : null}
    </dialog>
  )
}

function AdjustForm({
  variant,
  onClose,
}: {
  variant: InventoryVariant
  onClose: () => void
}) {
  const [operation, setOperation] = useState<StockOperation>('increase')
  const [quantity, setQuantity] = useState('')
  const [reason, setReason] = useState('')
  const adjustMutation = useAdjustStock()
  const parsedQuantity = Number(quantity)
  const hasValidQuantity = quantity !== '' && Number.isInteger(parsedQuantity) && parsedQuantity >= 0
  const nextStock = hasValidQuantity ? resolveNextStock(variant.stock, operation, parsedQuantity) : variant.stock
  const wouldGoNegative = nextStock < 0
  const activeOperation = operations.find((item) => item.value === operation)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!hasValidQuantity || wouldGoNegative) return

    const trimmedReason = reason.trim()

    adjustMutation.mutate(
      {
        variantId: variant.id,
        input: {
          operation,
          quantity: parsedQuantity,
          ...(trimmedReason ? { reason: trimmedReason } : {}),
        },
      },
      { onSuccess: onClose },
    )
  }

  return (
    <form className="flex w-[min(28rem,90vw)] flex-col gap-5 p-6" onSubmit={handleSubmit}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Inventory</p>
          <h2 className="mt-1 text-lg font-semibold">Adjust stock</h2>
          <p className="mt-1 text-sm text-slate-400">
            {variant.product.name} · {variant.unit.name}
          </p>
        </div>
        <Button aria-label="Close" onClick={onClose} size="icon-sm" type="button" variant="ghost">
          <X />
        </Button>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm">
        <span className="text-slate-400">Current stock</span>
        <span className="tabular-nums text-white">{variant.stock}</span>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Operation</span>
        <div className="grid grid-cols-3 gap-2">
          {operations.map((item) => (
            <Button
              key={item.value}
              onClick={() => setOperation(item.value)}
              type="button"
              variant={operation === item.value ? 'default' : 'outline'}
            >
              {item.label}
            </Button>
          ))}
        </div>
        {activeOperation ? <p className="text-xs text-slate-500">{activeOperation.hint}</p> : null}
      </div>

      <div className="flex flex-col gap-2">
        <label
          className="text-xs uppercase tracking-[0.2em] text-slate-400"
          htmlFor="stock-quantity"
        >
          Quantity <span className="text-sky-300">*</span>
        </label>
        <input
          className={inputClasses}
          id="stock-quantity"
          min={0}
          onChange={(event) => setQuantity(event.target.value)}
          placeholder="0"
          required
          step={1}
          type="number"
          value={quantity}
        />
      </div>

      {hasValidQuantity ? (
        <div
          className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm ${
            wouldGoNegative
              ? 'border-red-500/30 bg-red-500/10 text-red-200'
              : 'border-sky-400/30 bg-sky-400/10 text-sky-100'
          }`}
        >
          <span>{wouldGoNegative ? 'Stock cannot go below zero' : 'New stock will be'}</span>
          <span className="tabular-nums font-semibold">{nextStock}</span>
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <label className="text-xs uppercase tracking-[0.2em] text-slate-400" htmlFor="stock-reason">
          Reason
        </label>
        <input
          className={inputClasses}
          id="stock-reason"
          maxLength={300}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Stock count correction"
          type="text"
          value={reason}
        />
        <p className="text-xs text-slate-500">
          Saved on the movement record for the audit trail.
        </p>
      </div>

      {adjustMutation.error ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {extractErrorMessage(adjustMutation.error, 'Unable to adjust stock')}
        </p>
      ) : null}

      <div className="flex justify-end gap-2">
        <Button
          disabled={adjustMutation.isPending}
          onClick={onClose}
          type="button"
          variant="outline"
        >
          Cancel
        </Button>
        <Button
          disabled={adjustMutation.isPending || !hasValidQuantity || wouldGoNegative}
          type="submit"
        >
          {adjustMutation.isPending ? (
            <>
              <Loader2 className="animate-spin" />
              Saving…
            </>
          ) : (
            'Apply adjustment'
          )}
        </Button>
      </div>
    </form>
  )
}
