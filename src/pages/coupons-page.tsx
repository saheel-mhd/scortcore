import { useState } from 'react'
import { Eye, EyeOff, Pencil, Plus, Trash2 } from 'lucide-react'

import { extractErrorMessage } from '@/api/client'
import { usePageTitle } from '@/hooks/use-page-title'
import { CouponFormDialog } from '@/modules/coupons/components/coupon-form-dialog'
import {
  useCoupons,
  useDeleteCoupon,
  useUpdateCoupon,
} from '@/modules/coupons/hooks/use-coupons'
import type { Coupon } from '@/modules/coupons/types/coupon.types'
import { PageHeader } from '@/shared/page-header'
import { PanelCard } from '@/shared/panel-card'
import { Button } from '@/ui/button'

const currencyFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function formatValue(coupon: Coupon) {
  return coupon.type === 'percentage'
    ? `${coupon.value}%`
    : `$${currencyFormatter.format(coupon.value)}`
}

function isExpired(coupon: Coupon) {
  return coupon.expiresAt ? new Date(coupon.expiresAt).getTime() < Date.now() : false
}

function isUsedUp(coupon: Coupon) {
  return coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit
}

export default function CouponsPage() {
  usePageTitle('Coupons')

  const [editing, setEditing] = useState<Coupon | null | undefined>(undefined)
  const dialogOpen = editing !== undefined

  const query = useCoupons({
    page: 1,
    limit: 100,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })

  const updateMutation = useUpdateCoupon()
  const deleteMutation = useDeleteCoupon()

  const coupons = query.data?.items ?? []

  const openCreate = () => setEditing(null)
  const openEdit = (coupon: Coupon) => setEditing(coupon)
  const closeDialog = () => setEditing(undefined)

  const toggleActive = (coupon: Coupon) => {
    updateMutation.mutate({
      id: coupon.id,
      input: { isActive: !coupon.isActive },
    })
  }

  const handleDelete = (coupon: Coupon) => {
    if (!window.confirm(`Delete coupon "${coupon.code}"? This can't be undone.`)) return
    deleteMutation.mutate(coupon.id)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Coupons"
        description="Create and manage discount codes. Customers apply them at checkout."
        action={
          <Button onClick={openCreate}>
            <Plus />
            New coupon
          </Button>
        }
      />

      <PanelCard
        title="All coupons"
        description={
          query.data ? `${query.data.pagination.total} total` : 'Loading…'
        }
      >
        {query.isLoading ? (
          <p className="text-sm text-slate-400">Loading coupons…</p>
        ) : query.isError ? (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {extractErrorMessage(query.error, 'Failed to load coupons')}
          </p>
        ) : coupons.length === 0 ? (
          <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-8 text-center">
            <p className="text-sm text-slate-400">No coupons yet.</p>
            <Button onClick={openCreate}>
              <Plus />
              Create your first coupon
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {coupons.map((coupon) => (
              <CouponCard
                key={coupon.id}
                coupon={coupon}
                onEdit={() => openEdit(coupon)}
                onDelete={() => handleDelete(coupon)}
                onToggleActive={() => toggleActive(coupon)}
              />
            ))}
          </div>
        )}
      </PanelCard>

      <CouponFormDialog
        editing={editing ?? null}
        onClose={closeDialog}
        open={dialogOpen}
      />
    </div>
  )
}

type CouponCardProps = {
  coupon: Coupon
  onEdit: () => void
  onDelete: () => void
  onToggleActive: () => void
}

function CouponCard({ coupon, onEdit, onDelete, onToggleActive }: CouponCardProps) {
  const expired = isExpired(coupon)
  const usedUp = isUsedUp(coupon)

  return (
    <article
      className={[
        'rounded-2xl border p-5 transition',
        coupon.isActive && !expired && !usedUp
          ? 'border-white/10 bg-slate-950/55'
          : 'border-white/5 bg-slate-950/30 opacity-70',
      ].join(' ')}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-lg font-semibold text-white">{coupon.code}</span>
            <span className="inline-flex items-center rounded-full bg-sky-500/10 px-2 py-0.5 text-xs font-medium text-sky-300">
              {formatValue(coupon)} off
            </span>
            <span
              className={[
                'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                coupon.isActive
                  ? 'bg-emerald-500/10 text-emerald-300'
                  : 'bg-slate-500/15 text-slate-300',
              ].join(' ')}
            >
              {coupon.isActive ? 'Active' : 'Disabled'}
            </span>
            {expired ? (
              <span className="inline-flex items-center rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-300">
                Expired
              </span>
            ) : null}
            {usedUp ? (
              <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-300">
                Limit reached
              </span>
            ) : null}
          </div>

          {coupon.description ? (
            <p className="mt-1 text-sm text-slate-300">{coupon.description}</p>
          ) : null}

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
            <span>
              Used {coupon.usedCount}
              {coupon.usageLimit != null ? ` / ${coupon.usageLimit}` : ''} times
            </span>
            {coupon.minOrderAmount != null ? (
              <span>Min order ${currencyFormatter.format(coupon.minOrderAmount)}</span>
            ) : null}
            {coupon.maxDiscountAmount != null ? (
              <span>Max discount ${currencyFormatter.format(coupon.maxDiscountAmount)}</span>
            ) : null}
            {coupon.expiresAt ? (
              <span>Expires {new Date(coupon.expiresAt).toLocaleDateString()}</span>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            aria-label={coupon.isActive ? 'Disable coupon' : 'Enable coupon'}
            onClick={onToggleActive}
            size="icon-sm"
            variant="ghost"
          >
            {coupon.isActive ? <EyeOff /> : <Eye />}
          </Button>
          <Button aria-label="Edit coupon" onClick={onEdit} size="icon-sm" variant="ghost">
            <Pencil />
          </Button>
          <Button aria-label="Delete coupon" onClick={onDelete} size="icon-sm" variant="destructive">
            <Trash2 />
          </Button>
        </div>
      </div>
    </article>
  )
}
