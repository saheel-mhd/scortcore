import { useState } from 'react'
import { ArrowLeft, Loader2, Package } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { extractErrorMessage } from '@/api/client'
import { usePageTitle } from '@/hooks/use-page-title'
import { OrderStatusBadge } from '@/modules/orders/components/order-status-badge'
import { useCancelOrder } from '@/modules/orders/hooks/use-cancel-order'
import { useOrder } from '@/modules/orders/hooks/use-order'
import { useUpdateOrderStatus } from '@/modules/orders/hooks/use-update-order-status'
import { ORDER_STATUS_TRANSITIONS, type OrderStatus,} from '@/modules/orders/types/order.types'
import { routePaths } from '@/routes/paths'
import { PageHeader } from '@/shared/page-header'
import { PanelCard } from '@/shared/panel-card'
import { Button } from '@/ui/button'

const currencyFormatter = new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2, })
const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'long', timeStyle: 'short', })

export default function AdminOrderDetailPage() {
  const { id = '' } = useParams<{ id: string }>()
  const query = useOrder(id)
  const mutation = useUpdateOrderStatus()
  const cancelMutation = useCancelOrder()
  const [nextStatus, setNextStatus] = useState<OrderStatus | ''>('')

  usePageTitle(query.data ? `Order ${query.data.orderNumber}` : 'Order')

  if (!id) {
    return <Navigate replace to={routePaths.orders} />
  }

  const allowedTransitions = query.data ? ORDER_STATUS_TRANSITIONS[query.data.status] : []

  const handleAdvance = () => {
    if (!nextStatus || !query.data) return
    mutation.mutate({ id: query.data.id, status: nextStatus }, { onSuccess: () => setNextStatus('') })
  }

  const canCancel =
    query.data?.status === 'pending' || query.data?.status === 'paid'

  const handleCancel = () => {
    if (!query.data) return
    if (
      !window.confirm(
        `Cancel order ${query.data.orderNumber}? Stock will be returned and any coupon use released.`,
      )
    ) {
      return
    }

    cancelMutation.mutate({ id: query.data.id })
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        badge="Operations"
        title={query.data ? `Order ${query.data.orderNumber}` : 'Order'}
        description="Review the order contents and move it through fulfillment."
        action={
          <Link to={routePaths.orders}>
            <Button variant="outline">
              <ArrowLeft />
              Back
            </Button>
          </Link>
        }
      />

      {query.isLoading ? (
        <PanelCard title="Loading…">
          <p className="text-sm text-slate-400">Fetching order details.</p>
        </PanelCard>
      ) : query.isError ? (
        <PanelCard title="Failed to load">
          <p className="text-sm text-red-200">
            {extractErrorMessage(query.error, 'Unable to load order')}
          </p>
        </PanelCard>
      ) : query.data ? (
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="flex flex-col gap-6">
            <PanelCard
              title="Items"
              description={`${query.data.items.length} line${query.data.items.length === 1 ? '' : 's'}`}
            >
              <ul className="flex flex-col divide-y divide-white/5 text-sm">
                {query.data.items.map((item, index) => {
                  const price = item.unitPrice ?? item.price ?? 0
                  return (
                    <li
                      key={`${item.productVariantId ?? item.productId}-${index}`}
                      className="flex items-start justify-between gap-4 py-3"
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <Package className="mt-0.5 size-4 text-slate-500" />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-white">
                            {item.name}
                            {item.unitShortName ? (
                              <span className="ml-2 rounded bg-white/5 px-1.5 py-0.5 text-xs text-slate-300">
                                {item.unitShortName}
                              </span>
                            ) : null}
                          </p>
                          <p className="text-xs text-slate-500">
                            SKU {item.sku} · {item.quantity} × ${currencyFormatter.format(price)}
                          </p>
                        </div>
                      </div>
                      <span className="tabular-nums text-white">
                        ${currencyFormatter.format(price * item.quantity)}
                      </span>
                    </li>
                  )
                })}
              </ul>

              <div className="mt-4 flex flex-col gap-2 border-t border-white/5 pt-4 text-sm">
                <Row label="Subtotal" value={query.data.subtotalAmount} />
                {query.data.discountAmount > 0 ? (
                  <Row label="Discount" value={-query.data.discountAmount} />
                ) : null}
                <Row label="Total" value={query.data.totalAmount} bold />
              </div>
            </PanelCard>
          </div>

          <div className="flex flex-col gap-6">
            <PanelCard title="Status">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Current
                  </span>
                  <OrderStatusBadge status={query.data.status} />
                </div>

                {allowedTransitions.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    <label
                      className="text-xs uppercase tracking-[0.2em] text-slate-400"
                      htmlFor="next-status"
                    >
                      Advance to
                    </label>
                    <select
                      className="h-10 rounded-xl border border-white/10 bg-slate-950/60 px-3 text-sm text-white focus:border-sky-400/50 focus:outline-none"
                      id="next-status"
                      onChange={(event) => setNextStatus(event.target.value as OrderStatus)}
                      value={nextStatus}
                    >
                      <option value="">Choose…</option>
                      {allowedTransitions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>

                    {mutation.error ? (
                      <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                        {extractErrorMessage(mutation.error, 'Unable to advance order')}
                      </p>
                    ) : null}

                    <Button
                      disabled={!nextStatus || mutation.isPending}
                      onClick={handleAdvance}
                    >
                      {mutation.isPending ? (
                        <>
                          <Loader2 className="animate-spin" />
                          Saving…
                        </>
                      ) : (
                        'Advance status'
                      )}
                    </Button>
                  </div>
                ) : (
                  <p className="rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-xs text-slate-300">
                    {query.data.status === 'cancelled'
                      ? 'This order was cancelled and its stock has been returned.'
                      : 'This order is in a terminal state and cannot advance further.'}
                  </p>
                )}

                {canCancel ? (
                  <div className="flex flex-col gap-2 border-t border-white/5 pt-3">
                    {cancelMutation.error ? (
                      <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                        {extractErrorMessage(cancelMutation.error, 'Unable to cancel order')}
                      </p>
                    ) : null}

                    <Button
                      disabled={cancelMutation.isPending}
                      onClick={handleCancel}
                      variant="destructive"
                    >
                      {cancelMutation.isPending ? (
                        <>
                          <Loader2 className="animate-spin" />
                          Cancelling…
                        </>
                      ) : (
                        'Cancel order'
                      )}
                    </Button>
                    <p className="text-xs text-slate-500">
                      Returns stock to inventory and releases any coupon use.
                    </p>
                  </div>
                ) : null}
              </div>
            </PanelCard>

            <PanelCard title="Customer">
              <div className="flex flex-col gap-1 text-sm">
                <p className="text-white">{query.data.customer?.email ?? '—'}</p>
                <p className="text-xs text-slate-500">{query.data.customerId}</p>
              </div>
            </PanelCard>

            <PanelCard title="Delivery address">
              {query.data.shippingAddress ? (
                <div className="flex flex-col gap-1 text-sm">
                  <p className="text-white">
                    {query.data.shippingAddress.fullName}
                    {query.data.shippingAddress.label ? (
                      <span className="ml-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                        {query.data.shippingAddress.label}
                      </span>
                    ) : null}
                  </p>
                  <p className="text-slate-300">
                    {[
                      query.data.shippingAddress.line1,
                      query.data.shippingAddress.line2,
                      query.data.shippingAddress.city,
                      query.data.shippingAddress.state,
                      query.data.shippingAddress.postalCode,
                      query.data.shippingAddress.country,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                  {query.data.shippingAddress.phone ? (
                    <p className="text-xs text-slate-500">
                      {query.data.shippingAddress.phone}
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  No address recorded — placed before delivery addresses were captured.
                </p>
              )}
            </PanelCard>

            <PanelCard title="Timeline">
              <div className="flex flex-col gap-1 text-sm text-slate-300">
                <p>
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Placed
                  </span>
                  <br />
                  {dateFormatter.format(new Date(query.data.createdAt))}
                </p>
                <p className="mt-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Updated
                  </span>
                  <br />
                  {dateFormatter.format(new Date(query.data.updatedAt))}
                </p>
              </div>
            </PanelCard>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function Row({ label, value, bold }: { label: string; value: number; bold?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between ${
        bold ? 'text-base font-semibold text-white' : 'text-slate-300'
      }`}
    >
      <span>{label}</span>
      <span className="tabular-nums">
        {value < 0 ? '-' : ''}${currencyFormatter.format(Math.abs(value))}
      </span>
    </div>
  )
}
