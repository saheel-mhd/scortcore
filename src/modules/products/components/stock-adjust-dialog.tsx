import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Loader2, X } from 'lucide-react'

import { extractErrorMessage } from '@/api/client'
import { useUpdateProductStock } from '@/modules/products/hooks/use-update-product-stock'
import type { Product, StockOperation } from '@/modules/products/types/product.types'
import { Button } from '@/ui/button'

type Props = {
  product: Product | null
  onClose: () => void
}

const operations: { label: string; value: StockOperation; helper: string }[] = [
  { label: 'Set to', value: 'set', helper: 'Overwrite the current stock level.' },
  { label: 'Increase by', value: 'increase', helper: 'Add to the current stock level.' },
  { label: 'Decrease by', value: 'decrease', helper: 'Subtract from the current stock level.' },
]

const inputClasses =
  'w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/50 focus:outline-none'

export function StockAdjustDialog({ product, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [operation, setOperation] = useState<StockOperation>('set')
  const [quantity, setQuantity] = useState('0')
  const { mutate, isPending, error, reset } = useUpdateProductStock()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (product && !dialog.open) {
      dialog.showModal()
      setOperation('set')
      setQuantity(String(product.stock))
      reset()
    }

    if (!product && dialog.open) {
      dialog.close()
    }
  }, [product, reset])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!product) return

    const quantityNumber = Number(quantity)

    mutate(
      { id: product.id, input: { operation, quantity: quantityNumber } },
      { onSuccess: onClose }
    )
  }

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-auto h-fit w-fit max-w-[90vw] rounded-3xl border border-white/10 bg-slate-950/95 p-0 text-white backdrop:bg-slate-950/70 backdrop:backdrop-blur-sm"
      onClose={onClose}
    >
      {product ? (
        <form className="flex w-[min(28rem,90vw)] flex-col gap-5 p-6" onSubmit={handleSubmit}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Inventory</p>
              <h2 className="mt-1 text-lg font-semibold">Adjust stock</h2>
              <p className="mt-1 text-sm text-slate-400">
                {product.name} · current stock{' '}
                <span className="font-semibold text-white">{product.stock}</span>
              </p>
            </div>
            <Button aria-label="Close" onClick={onClose} size="icon-sm" type="button" variant="ghost">
              <X />
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-[0.2em] text-slate-400" htmlFor="stock-operation">
              Operation
            </label>
            <select
              className={inputClasses}
              id="stock-operation"
              onChange={(event) => setOperation(event.target.value as StockOperation)}
              value={operation}
            >
              {operations.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500">
              {operations.find((op) => op.value === operation)?.helper}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-[0.2em] text-slate-400" htmlFor="stock-quantity">
              Quantity
            </label>
            <input
              className={inputClasses}
              id="stock-quantity"
              min={0}
              onChange={(event) => setQuantity(event.target.value)}
              required
              step={1}
              type="number"
              value={quantity}
            />
          </div>

          {error ? (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {extractErrorMessage(error, 'Unable to adjust stock')}
            </p>
          ) : null}

          <div className="flex justify-end gap-2">
            <Button onClick={onClose} type="button" variant="outline">
              Cancel
            </Button>
            <Button disabled={isPending} type="submit">
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" />
                  Saving…
                </>
              ) : (
                'Save'
              )}
            </Button>
          </div>
        </form>
      ) : null}
    </dialog>
  )
}
