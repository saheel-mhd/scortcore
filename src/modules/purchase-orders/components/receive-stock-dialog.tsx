import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Loader2, X } from 'lucide-react'
import { extractErrorMessage } from '@/api/client'
import { useReceivePurchaseOrder } from '@/modules/purchase-orders/hooks/use-purchase-orders'
import type { PurchaseOrder } from '@/modules/purchase-orders/types/purchase-order.types'
import { Button } from '@/ui/button'

type Props = {
  open: boolean
  purchaseOrder: PurchaseOrder | null
  onClose: () => void
}

const inputClasses = 'w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/50 focus:outline-none'
const labelClasses = 'text-xs uppercase tracking-[0.2em] text-slate-400'

export function ReceiveStockDialog({ open, purchaseOrder, onClose }: Props) {
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
      {purchaseOrder ? (
        <ReceiveForm key={purchaseOrder.id} onClose={onClose} purchaseOrder={purchaseOrder} />
      ) : null}
    </dialog>
  )
}

function ReceiveForm({
  purchaseOrder,
  onClose,
}: {
  purchaseOrder: PurchaseOrder
  onClose: () => void
}) {
  const remaining = purchaseOrder.quantity - purchaseOrder.receivedQuantity
  const [receivedQuantity, setReceivedQuantity] = useState(String(remaining))
  const [reason, setReason] = useState('')
  const receiveMutation = useReceivePurchaseOrder()
  const parsed = Number(receivedQuantity)
  const isValid = receivedQuantity !== '' && Number.isInteger(parsed) && parsed >= 1 && parsed <= remaining
  const currentStock = purchaseOrder.productVariant.stock
  const nextStock = isValid ? currentStock + parsed : currentStock
  const completesOrder = isValid && purchaseOrder.receivedQuantity + parsed >= purchaseOrder.quantity

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isValid) return

    const trimmedReason = reason.trim()

    receiveMutation.mutate(
      {
        id: purchaseOrder.id,
        input: {
          receivedQuantity: parsed,
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
          <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Purchase orders</p>
          <h2 className="mt-1 text-lg font-semibold">Receive stock</h2>
          <p className="mt-1 text-sm text-slate-400">
            {purchaseOrder.purchaseNumber} · {purchaseOrder.productVariant.product.name} ·{' '}
            {purchaseOrder.productVariant.unit.name}
          </p>
        </div>
        <Button aria-label="Close" onClick={onClose} size="icon-sm" type="button" variant="ghost">
          <X />
        </Button>
      </div>

      <dl className="grid grid-cols-3 gap-2 rounded-xl border border-white/10 bg-slate-950/60 p-4 text-sm">
        <div>
          <dt className="text-xs text-slate-500">Ordered</dt>
          <dd className="tabular-nums text-white">{purchaseOrder.quantity}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Received</dt>
          <dd className="tabular-nums text-white">{purchaseOrder.receivedQuantity}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Remaining</dt>
          <dd className="tabular-nums text-amber-200">{remaining}</dd>
        </div>
      </dl>

      <div className="flex flex-col gap-2">
        <label className={labelClasses} htmlFor="receive-quantity">
          Quantity received <span className="text-sky-300">*</span>
        </label>
        <input
          className={inputClasses}
          id="receive-quantity"
          max={remaining}
          min={1}
          onChange={(event) => setReceivedQuantity(event.target.value)}
          required
          step={1}
          type="number"
          value={receivedQuantity}
        />
        <p className="text-xs text-slate-500">
          Partial deliveries are supported — receive up to {remaining} now.
        </p>
      </div>

      {isValid ? (
        <div className="flex items-center justify-between rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          <span>
            Stock {currentStock} → {nextStock}
          </span>
          <span className="text-xs">
            {completesOrder ? 'Completes this order' : 'Stays partially received'}
          </span>
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <label className={labelClasses} htmlFor="receive-reason">
          Reason
        </label>
        <input
          className={inputClasses}
          id="receive-reason"
          maxLength={300}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Defaults to a note referencing this purchase order"
          type="text"
          value={reason}
        />
      </div>

      {receiveMutation.error ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {extractErrorMessage(receiveMutation.error, 'Unable to receive stock')}
        </p>
      ) : null}

      <div className="flex justify-end gap-2">
        <Button
          disabled={receiveMutation.isPending}
          onClick={onClose}
          type="button"
          variant="outline"
        >
          Cancel
        </Button>
        <Button disabled={receiveMutation.isPending || !isValid} type="submit">
          {receiveMutation.isPending ? (
            <>
              <Loader2 className="animate-spin" />
              Receiving…
            </>
          ) : (
            'Receive stock'
          )}
        </Button>
      </div>
    </form>
  )
}
