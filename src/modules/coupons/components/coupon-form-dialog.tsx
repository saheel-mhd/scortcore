import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Loader2, X } from 'lucide-react'

import { extractErrorMessage } from '@/api/client'
import {
  useCreateCoupon,
  useUpdateCoupon,
} from '@/modules/coupons/hooks/use-coupons'
import type { Coupon, CouponType } from '@/modules/coupons/types/coupon.types'
import { Button } from '@/ui/button'

type Props = {
  open: boolean
  editing: Coupon | null
  onClose: () => void
}

const inputClasses =
  'w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/50 focus:outline-none'

export function CouponFormDialog({ open, editing, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<CouponType>('percentage')
  const [value, setValue] = useState(0)
  const [minOrderAmount, setMinOrderAmount] = useState('')
  const [maxDiscountAmount, setMaxDiscountAmount] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [expiresAt, setExpiresAt] = useState('')
  const [usageLimit, setUsageLimit] = useState('')

  const createMutation = useCreateCoupon()
  const updateMutation = useUpdateCoupon()
  const isPending = createMutation.isPending || updateMutation.isPending
  const error = createMutation.error ?? updateMutation.error

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
      setCode(editing?.code ?? '')
      setDescription(editing?.description ?? '')
      setType(editing?.type ?? 'percentage')
      setValue(editing?.value ?? 0)
      setMinOrderAmount(editing?.minOrderAmount != null ? String(editing.minOrderAmount) : '')
      setMaxDiscountAmount(editing?.maxDiscountAmount != null ? String(editing.maxDiscountAmount) : '')
      setIsActive(editing?.isActive ?? true)
      setExpiresAt(editing?.expiresAt ? editing.expiresAt.slice(0, 16) : '')
      setUsageLimit(editing?.usageLimit != null ? String(editing.usageLimit) : '')
      createMutation.reset()
      updateMutation.reset()
    }

    if (!open && dialog.open) {
      dialog.close()
    }
  }, [open, editing, createMutation, updateMutation])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (editing) {
      const input: Record<string, unknown> = {}
      if (description.trim() !== (editing.description ?? ''))
        input.description = description.trim() || undefined
      if (type !== editing.type) input.type = type
      if (value !== editing.value) input.value = value
      input.isActive = isActive
      input.minOrderAmount = minOrderAmount ? Number(minOrderAmount) : undefined
      input.maxDiscountAmount = maxDiscountAmount ? Number(maxDiscountAmount) : undefined
      input.expiresAt = expiresAt ? new Date(expiresAt).toISOString() : undefined
      input.usageLimit = usageLimit ? Number(usageLimit) : undefined

      updateMutation.mutate(
        { id: editing.id, input },
        { onSuccess: onClose }
      )
    } else {
      createMutation.mutate(
        {
          code: code.trim().toUpperCase(),
          description: description.trim() || undefined,
          type,
          value,
          minOrderAmount: minOrderAmount ? Number(minOrderAmount) : undefined,
          maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : undefined,
          isActive,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
          usageLimit: usageLimit ? Number(usageLimit) : undefined,
        },
        { onSuccess: onClose }
      )
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-auto h-fit w-fit max-w-[90vw] rounded-3xl border border-white/10 bg-slate-950/95 p-0 text-white backdrop:bg-slate-950/70 backdrop:backdrop-blur-sm"
      onClose={onClose}
    >
      <form className="flex w-[min(40rem,92vw)] flex-col gap-5 p-6" onSubmit={handleSubmit}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Coupons</p>
            <h2 className="mt-1 text-lg font-semibold">
              {editing ? 'Edit coupon' : 'New coupon'}
            </h2>
          </div>
          <Button aria-label="Close" onClick={onClose} size="icon-sm" type="button" variant="ghost">
            <X />
          </Button>
        </div>

        {!editing ? (
          <Field label="Code" htmlFor="coupon-code" required hint="3-40 characters. Letters, numbers, hyphens, underscores.">
            <input
              autoFocus
              className={`${inputClasses} font-mono uppercase`}
              id="coupon-code"
              maxLength={40}
              minLength={3}
              onChange={(event) => setCode(event.target.value)}
              pattern="[A-Za-z0-9_-]+"
              placeholder="SUMMER25"
              required
              type="text"
              value={code}
            />
          </Field>
        ) : (
          <div className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Code</p>
            <p className="mt-1 font-mono text-lg font-semibold text-white">{editing.code}</p>
          </div>
        )}

        <Field label="Description" htmlFor="coupon-desc">
          <input
            className={inputClasses}
            id="coupon-desc"
            maxLength={300}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="25% off summer collection"
            type="text"
            value={description}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Type" htmlFor="coupon-type" required>
            <select
              className={inputClasses}
              id="coupon-type"
              onChange={(event) => setType(event.target.value as CouponType)}
              value={type}
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed amount ($)</option>
            </select>
          </Field>

          <Field
            label={type === 'percentage' ? 'Value (%)' : 'Value ($)'}
            htmlFor="coupon-value"
            required
          >
            <input
              className={inputClasses}
              id="coupon-value"
              max={type === 'percentage' ? 100 : undefined}
              min={0}
              onChange={(event) => setValue(Number(event.target.value) || 0)}
              required
              step={0.01}
              type="number"
              value={value}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Min order amount ($)" htmlFor="coupon-min" hint="Leave empty for no minimum">
            <input
              className={inputClasses}
              id="coupon-min"
              min={0}
              onChange={(event) => setMinOrderAmount(event.target.value)}
              placeholder="0.00"
              step={0.01}
              type="number"
              value={minOrderAmount}
            />
          </Field>

          <Field label="Max discount ($)" htmlFor="coupon-max" hint="Cap the discount amount">
            <input
              className={inputClasses}
              id="coupon-max"
              min={0}
              onChange={(event) => setMaxDiscountAmount(event.target.value)}
              placeholder="No cap"
              step={0.01}
              type="number"
              value={maxDiscountAmount}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Expires at" htmlFor="coupon-expires" hint="Leave empty for no expiry">
            <input
              className={inputClasses}
              id="coupon-expires"
              onChange={(event) => setExpiresAt(event.target.value)}
              type="datetime-local"
              value={expiresAt}
            />
          </Field>

          <Field label="Usage limit" htmlFor="coupon-usage" hint="Leave empty for unlimited">
            <input
              className={inputClasses}
              id="coupon-usage"
              min={1}
              onChange={(event) => setUsageLimit(event.target.value)}
              placeholder="Unlimited"
              step={1}
              type="number"
              value={usageLimit}
            />
          </Field>
        </div>

        <Field label="Active" htmlFor="coupon-active">
          <label className="inline-flex items-center gap-3 text-sm text-slate-200">
            <input
              checked={isActive}
              className="size-4 rounded border-white/20 bg-slate-950 text-sky-400 focus:ring-sky-400/50"
              id="coupon-active"
              onChange={(event) => setIsActive(event.target.checked)}
              type="checkbox"
            />
            {isActive ? 'Coupon is active' : 'Coupon is disabled'}
          </label>
        </Field>

        {error ? (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {extractErrorMessage(error, 'Unable to save coupon')}
          </p>
        ) : null}

        <div className="flex justify-end gap-2">
          <Button disabled={isPending} onClick={onClose} type="button" variant="outline">
            Cancel
          </Button>
          <Button disabled={isPending} type="submit">
            {isPending ? (
              <>
                <Loader2 className="animate-spin" />
                Saving…
              </>
            ) : editing ? 'Save changes' : 'Create coupon'}
          </Button>
        </div>
      </form>
    </dialog>
  )
}

type FieldProps = {
  label: string
  htmlFor: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}

function Field({ label, htmlFor, hint, required, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs uppercase tracking-[0.2em] text-slate-400" htmlFor={htmlFor}>
        {label}
        {required ? <span className="ml-1 text-sky-300">*</span> : null}
      </label>
      {children}
      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
    </div>
  )
}
