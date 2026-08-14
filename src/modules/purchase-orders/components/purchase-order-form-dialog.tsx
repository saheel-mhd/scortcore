import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Loader2, X } from 'lucide-react'
import { extractErrorMessage } from '@/api/client'
import { useInventory } from '@/modules/inventory/hooks/use-inventory'
import { useCreatePurchaseOrder } from '@/modules/purchase-orders/hooks/use-purchase-orders'
import { Button } from '@/ui/button'

type Props = {
  open: boolean
  presetVariantId?: string
  onClose: () => void
}

const inputClasses = 'w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/50 focus:outline-none'
const labelClasses = 'text-xs uppercase tracking-[0.2em] text-slate-400'

const currencyFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function PurchaseOrderFormDialog({ open, presetVariantId, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [supplierName, setSupplierName] = useState('')
  const [supplierEmail, setSupplierEmail] = useState('')
  const [supplierPhone, setSupplierPhone] = useState('')
  const [productVariantId, setProductVariantId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unitCost, setUnitCost] = useState('')
  const [notes, setNotes] = useState('')

  const variantsQuery = useInventory({
    page: 1,
    limit: 100,
    sortBy: 'stock',
    sortOrder: 'asc',
  })
  const createMutation = useCreatePurchaseOrder()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
      setSupplierName('')
      setSupplierEmail('')
      setSupplierPhone('')
      setProductVariantId(presetVariantId ?? '')
      setQuantity('')
      setUnitCost('')
      setNotes('')
      createMutation.reset()
    }

    if (!open && dialog.open) {
      dialog.close()
    }
  }, [open, presetVariantId, createMutation])

  const parsedQuantity = Number(quantity)
  const parsedUnitCost = Number(unitCost)
  const hasValidQuantity = quantity !== '' && Number.isInteger(parsedQuantity) && parsedQuantity >= 1
  const hasValidUnitCost = unitCost !== '' && Number.isFinite(parsedUnitCost) && parsedUnitCost >= 0
  const totalCost = hasValidQuantity && hasValidUnitCost ? parsedQuantity * parsedUnitCost : 0
  const canSubmit = supplierName.trim().length >= 2 && productVariantId.length > 0 && hasValidQuantity && hasValidUnitCost

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) return

    const trimmedEmail = supplierEmail.trim()
    const trimmedPhone = supplierPhone.trim()
    const trimmedNotes = notes.trim()

    createMutation.mutate(
      {
        supplierName: supplierName.trim(),
        productVariantId,
        quantity: parsedQuantity,
        unitCost: parsedUnitCost,
        ...(trimmedEmail ? { supplierEmail: trimmedEmail } : {}),
        ...(trimmedPhone ? { supplierPhone: trimmedPhone } : {}),
        ...(trimmedNotes ? { notes: trimmedNotes } : {}),
      },
      { onSuccess: onClose },
    )
  }

  const variants = variantsQuery.data?.items ?? []

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-auto h-fit w-fit max-w-[95vw] rounded-3xl border border-white/10 bg-slate-950/95 p-0 text-white backdrop:bg-slate-950/70 backdrop:backdrop-blur-sm"
      onClose={onClose}
    >
      <form
        className="flex max-h-[85vh] w-[min(32rem,95vw)] flex-col gap-5 overflow-y-auto p-6"
        onSubmit={handleSubmit}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Purchase orders</p>
            <h2 className="mt-1 text-lg font-semibold">New purchase order</h2>
            <p className="mt-1 text-sm text-slate-400">
              Order stock from a supplier. Stock only rises when you receive it.
            </p>
          </div>
          <Button aria-label="Close" onClick={onClose} size="icon-sm" type="button" variant="ghost">
            <X />
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClasses} htmlFor="po-variant">
            Product variant <span className="text-sky-300">*</span>
          </label>
          <select
            className={inputClasses}
            id="po-variant"
            onChange={(event) => setProductVariantId(event.target.value)}
            required
            value={productVariantId}
          >
            <option disabled value="">
              {variantsQuery.isLoading ? 'Loading…' : 'Choose a product variant'}
            </option>
            {variants.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.product.name} · {variant.unit.name} (stock {variant.stock})
              </option>
            ))}
          </select>
          {variants.length === 0 && !variantsQuery.isLoading ? (
            <p className="text-xs text-amber-300">
              No product variants exist yet. Create a product with variants first.
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClasses} htmlFor="po-supplier">
            Supplier name <span className="text-sky-300">*</span>
          </label>
          <input
            className={inputClasses}
            id="po-supplier"
            maxLength={150}
            minLength={2}
            onChange={(event) => setSupplierName(event.target.value)}
            placeholder="Acme Wholesale"
            required
            type="text"
            value={supplierName}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className={labelClasses} htmlFor="po-email">
              Supplier email
            </label>
            <input
              className={inputClasses}
              id="po-email"
              onChange={(event) => setSupplierEmail(event.target.value)}
              placeholder="orders@acme.com"
              type="email"
              value={supplierEmail}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className={labelClasses} htmlFor="po-phone">
              Supplier phone
            </label>
            <input
              className={inputClasses}
              id="po-phone"
              maxLength={50}
              onChange={(event) => setSupplierPhone(event.target.value)}
              placeholder="+1 555 0100"
              type="tel"
              value={supplierPhone}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className={labelClasses} htmlFor="po-quantity">
              Quantity <span className="text-sky-300">*</span>
            </label>
            <input
              className={inputClasses}
              id="po-quantity"
              min={1}
              onChange={(event) => setQuantity(event.target.value)}
              placeholder="100"
              required
              step={1}
              type="number"
              value={quantity}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className={labelClasses} htmlFor="po-unit-cost">
              Unit cost <span className="text-sky-300">*</span>
            </label>
            <input
              className={inputClasses}
              id="po-unit-cost"
              min={0}
              onChange={(event) => setUnitCost(event.target.value)}
              placeholder="12.50"
              required
              step="0.01"
              type="number"
              value={unitCost}
            />
          </div>
        </div>

        {totalCost > 0 ? (
          <div className="flex items-center justify-between rounded-xl border border-sky-400/30 bg-sky-400/10 px-4 py-3 text-sm text-sky-100">
            <span>Total cost</span>
            <span className="font-semibold tabular-nums">
              ${currencyFormatter.format(totalCost)}
            </span>
          </div>
        ) : null}

        <div className="flex flex-col gap-2">
          <label className={labelClasses} htmlFor="po-notes">
            Notes
          </label>
          <textarea
            className={`${inputClasses} min-h-20`}
            id="po-notes"
            maxLength={500}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Optional notes for this order."
            value={notes}
          />
        </div>

        {createMutation.error ? (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {extractErrorMessage(createMutation.error, 'Unable to create purchase order')}
          </p>
        ) : null}

        <div className="flex justify-end gap-2">
          <Button
            disabled={createMutation.isPending}
            onClick={onClose}
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          <Button disabled={createMutation.isPending || !canSubmit} type="submit">
            {createMutation.isPending ? (
              <>
                <Loader2 className="animate-spin" />
                Creating…
              </>
            ) : (
              'Create purchase order'
            )}
          </Button>
        </div>
      </form>
    </dialog>
  )
}
