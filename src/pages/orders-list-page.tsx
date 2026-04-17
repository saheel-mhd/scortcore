import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import { extractErrorMessage } from '@/api/client'
import { OrdersTable } from '@/modules/orders/components/orders-table'
import { OrdersToolbar } from '@/modules/orders/components/orders-toolbar'
import { useOrders } from '@/modules/orders/hooks/use-orders'
import type {
  OrderSortField,
  OrderStatus,
  OrdersListParams,
  SortOrder,
} from '@/modules/orders/types/order.types'
import { PageHeader } from '@/shared/page-header'
import { PaginationControls } from '@/shared/pagination-controls'
import { PanelCard } from '@/shared/panel-card'
import { usePageTitle } from '@/hooks/use-page-title'

const DEFAULT_LIMIT = 10

function parseParams(searchParams: URLSearchParams): OrdersListParams {
  const page = Number(searchParams.get('page') ?? '1') || 1
  const limit = Number(searchParams.get('limit') ?? String(DEFAULT_LIMIT)) || DEFAULT_LIMIT
  const status = (searchParams.get('status') as OrderStatus | null) ?? undefined
  const customerId = searchParams.get('customerId') ?? undefined
  const sortBy = (searchParams.get('sortBy') as OrderSortField | null) ?? 'createdAt'
  const sortOrder = (searchParams.get('sortOrder') as SortOrder | null) ?? 'desc'

  return { page, limit, status, customerId, sortBy, sortOrder }
}

export default function OrdersListPage() {
  usePageTitle('Orders')

  const [searchParams, setSearchParams] = useSearchParams()
  const params = useMemo(() => parseParams(searchParams), [searchParams])

  const query = useOrders(params)

  const updateParams = (next: Partial<OrdersListParams>) => {
    setSearchParams(
      (prev) => {
        const merged = new URLSearchParams(prev)
        for (const [key, value] of Object.entries(next)) {
          if (value === undefined || value === null || value === '') {
            merged.delete(key)
          } else {
            merged.set(key, String(value))
          }
        }
        return merged
      },
      { replace: true }
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Orders"
        description="Review incoming orders and advance them through the fulfillment pipeline."
      />

      <PanelCard title="Filters" description="Filter by status or customer and change sort order.">
        <OrdersToolbar params={params} onChange={updateParams} />
      </PanelCard>

      <PanelCard
        title="All orders"
        description={
          query.data ? `${query.data.pagination.total} total` : 'Loading orders…'
        }
      >
        {query.isLoading ? (
          <div className="flex min-h-40 items-center justify-center text-sm text-slate-400">
            Loading orders…
          </div>
        ) : query.isError ? (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {extractErrorMessage(query.error, 'Failed to load orders')}
          </div>
        ) : query.data ? (
          <div className="flex flex-col gap-4">
            <OrdersTable orders={query.data.orders} />
            <PaginationControls
              limit={query.data.pagination.limit}
              onChange={(page) => updateParams({ page })}
              page={query.data.pagination.page}
              total={query.data.pagination.total}
              totalPages={query.data.pagination.totalPages}
            />
          </div>
        ) : null}
      </PanelCard>
    </div>
  )
}
