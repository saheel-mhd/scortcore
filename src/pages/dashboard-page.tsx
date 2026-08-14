import { Link } from 'react-router-dom'
import { Activity, AlertTriangle, DollarSign, Package, Receipt, RefreshCw, Users,} from 'lucide-react'
import { extractErrorMessage } from '@/api/client'
import { usePageTitle } from '@/hooks/use-page-title'
import { useDashboardSummary } from '@/modules/dashboard/hooks/use-dashboard-overview'
import type { DashboardLowStock, DashboardMetrics, DashboardOrderStatus, DashboardRecentOrder,} from '@/modules/dashboard/types/dashboard.types'
import { routePaths } from '@/routes/paths'
import { PageHeader } from '@/shared/page-header'
import { PanelCard } from '@/shared/panel-card'
import { Button } from '@/ui/button'

const currencyFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
})

function DashboardPage() {
  usePageTitle('Dashboard')

  const query = useDashboardSummary()

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="Real-time snapshot of catalog, orders, customers, and revenue."
        action={
          <Button disabled={query.isFetching} onClick={() => query.refetch()} variant="outline">
            <RefreshCw className={query.isFetching ? 'animate-spin' : undefined} />
            Refresh
          </Button>
        }
      />

      {query.isError ? (
        <PanelCard title="Unable to load dashboard" description="Something went wrong.">
          <p className="text-sm text-red-200">
            {extractErrorMessage(query.error, 'Failed to load dashboard data')}
          </p>
        </PanelCard>
      ) : null}

      {query.isPending ? (
        <PanelCard title="Loading…" description="Fetching the latest data.">
          <p className="text-sm text-slate-300">Loading dashboard.</p>
        </PanelCard>
      ) : null}

      {query.data ? (
        <>
          <MetricGrid metrics={query.data.metrics} />

          <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <PanelCard
              title="Recent orders"
              description={
                query.data.recentOrders.length > 0
                  ? 'Latest orders across the store.'
                  : 'No orders yet.'
              }
              action={
                <Link to={routePaths.orders}>
                  <Button size="sm" variant="outline">
                    View all
                  </Button>
                </Link>
              }
            >
              <RecentOrders orders={query.data.recentOrders} />
            </PanelCard>

            <PanelCard
              title="Low stock"
              description={
                query.data.metrics.lowStockCount > 0
                  ? `${query.data.metrics.lowStockCount} variant${query.data.metrics.lowStockCount === 1 ? '' : 's'} at or below the threshold.`
                  : 'Everything is well stocked.'
              }
              action={
                query.data.metrics.lowStockCount > 0 ? (
                  <Link to={`${routePaths.inventory}?view=low`}>
                    <Button size="sm" variant="outline">
                      Restock
                    </Button>
                  </Link>
                ) : null
              }
            >
              <LowStockList items={query.data.lowStock} />
            </PanelCard>
          </section>
        </>
      ) : null}
    </div>
  )
}

type MetricGridProps = {
  metrics: DashboardMetrics
}

function MetricGrid({ metrics }: MetricGridProps) {
  const cards = [
    {
      key: 'revenue',
      label: 'Revenue (all time)',
      value: `$${currencyFormatter.format(metrics.revenueTotal)}`,
      hint: `Last 30 days · $${currencyFormatter.format(metrics.revenue30d)}`,
      icon: DollarSign,
    },
    {
      key: 'orders',
      label: 'Orders',
      value: String(metrics.totalOrders),
      hint:
        metrics.pendingOrders > 0
          ? `${metrics.pendingOrders} pending`
          : 'No pending orders',
      icon: Receipt,
    },
    {
      key: 'products',
      label: 'Products',
      value: String(metrics.totalProducts),
      hint: `${metrics.activeProducts} active`,
      icon: Package,
    },
    {
      key: 'customers',
      label: 'Customers',
      value: String(metrics.totalCustomers),
      hint: 'Registered accounts',
      icon: Users,
    },
  ] as const

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <article
            key={card.key}
            className="rounded-2xl border border-white/10 bg-slate-950/55 p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{card.label}</p>
                <p className="mt-2 text-3xl font-semibold text-white">{card.value}</p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-full bg-sky-400/15 text-sky-200">
                <Icon className="size-5" strokeWidth={1.5} />
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">{card.hint}</p>
          </article>
        )
      })}
    </section>
  )
}

type RecentOrdersProps = {
  orders: DashboardRecentOrder[]
}

function RecentOrders({ orders }: RecentOrdersProps) {
  if (orders.length === 0) {
    return (
      <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-white/10 bg-slate-950/40 p-6 text-center">
        <p className="text-sm text-slate-400">
          <Activity className="mx-auto mb-2 size-5 text-slate-600" />
          No orders yet. Once customers check out they’ll appear here.
        </p>
      </div>
    )
  }

  return (
    <ul className="scrollbar-hidden flex max-h-[22rem] flex-col divide-y divide-white/5 overflow-y-auto">
      {orders.map((order) => (
        <li key={order.id} className="flex items-center justify-between gap-4 py-3">
          <div className="min-w-0">
            <Link
              className="font-medium text-white hover:text-sky-300"
              to={routePaths.ordersDetail.replace(':id', order.id)}
            >
              {order.orderNumber}
            </Link>
            <p className="truncate text-xs text-slate-500">
              {order.customerEmail ?? 'Unknown customer'} · {order.itemCount} item
              {order.itemCount === 1 ? '' : 's'}
            </p>
            <p className="text-xs text-slate-500">
              {dateFormatter.format(new Date(order.createdAt))}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-sm font-semibold text-white tabular-nums">
              ${currencyFormatter.format(order.totalAmount)}
            </span>
            <OrderStatusBadge status={order.status} />
          </div>
        </li>
      ))}
    </ul>
  )
}

type LowStockListProps = {
  items: DashboardLowStock[]
}

function LowStockList({ items }: LowStockListProps) {
  if (items.length === 0) {
    return (
      <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-white/10 bg-slate-950/40 p-6 text-center">
        <p className="text-sm text-slate-400">Nothing below the low-stock threshold.</p>
      </div>
    )
  }

  return (
    <ul className="scrollbar-hidden flex max-h-[22rem] flex-col divide-y divide-white/5 overflow-y-auto">
      {items.map((item) => (
        <li key={item.variantId} className="flex items-center justify-between gap-4 py-3">
          <div className="min-w-0">
            <Link
              className="font-medium text-white hover:text-sky-300"
              to={routePaths.productsEdit.replace(':id', item.productId)}
            >
              {item.productName}
            </Link>
            <p className="text-xs text-slate-500">
              Size <span className="text-slate-300">{item.sizeShortName}</span> · SKU {item.sku}
            </p>
          </div>
          <div className="inline-flex items-center gap-2">
            <AlertTriangle
              className={item.stock === 0 ? 'size-4 text-red-400' : 'size-4 text-amber-300'}
              strokeWidth={1.5}
            />
            <span
              className={[
                'rounded-full px-2 py-0.5 text-xs font-medium',
                item.stock === 0
                  ? 'bg-red-500/10 text-red-300'
                  : 'bg-amber-500/10 text-amber-200',
              ].join(' ')}
            >
              {item.stock} left
            </span>
          </div>
        </li>
      ))}
    </ul>
  )
}

const statusStyles: Record<DashboardOrderStatus, string> = {
  pending: 'bg-amber-500/10 text-amber-300',
  paid: 'bg-sky-500/10 text-sky-300',
  shipped: 'bg-indigo-500/10 text-indigo-300',
  delivered: 'bg-emerald-500/10 text-emerald-300',
}

function OrderStatusBadge({ status }: { status: DashboardOrderStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.15em] ${statusStyles[status]}`}
    >
      {status}
    </span>
  )
}

export default DashboardPage
