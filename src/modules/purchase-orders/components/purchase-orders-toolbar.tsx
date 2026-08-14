import { Search } from 'lucide-react'
import type { PurchaseOrderListParams, PurchaseOrderSortField, PurchaseOrderStatus, SortOrder,} from '@/modules/purchase-orders/types/purchase-order.types'

type Props = {
  params: PurchaseOrderListParams
  onChange: (next: Partial<PurchaseOrderListParams>) => void
}

const statusOptions: { label: string; value: PurchaseOrderStatus | 'all' }[] = [
  { label: 'All statuses', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Ordered', value: 'ordered' },
  { label: 'Partially received', value: 'partially_received' },
  { label: 'Received', value: 'received' },
  { label: 'Cancelled', value: 'cancelled' },
]

const sortOptions: { label: string; value: PurchaseOrderSortField }[] = [
  { label: 'Ordered', value: 'orderedAt' },
  { label: 'Updated', value: 'updatedAt' },
  { label: 'Status', value: 'status' },
  { label: 'Supplier', value: 'supplierName' },
]

const controlClasses = 'h-10 rounded-xl border border-white/10 bg-slate-950/60 px-3 text-sm text-white focus:border-sky-400/50 focus:outline-none'

export function PurchaseOrdersToolbar({ params, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input
          className="h-10 w-64 rounded-xl border border-white/10 bg-slate-950/60 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/50 focus:outline-none"
          onChange={(event) => onChange({ search: event.target.value || undefined, page: 1 })}
          placeholder="Search number or supplier…"
          type="search"
          value={params.search ?? ''}
        />
      </div>

      <select
        aria-label="Filter by status"
        className={controlClasses}
        onChange={(event) => {
          const value = event.target.value as PurchaseOrderStatus | 'all'
          onChange({ status: value === 'all' ? undefined : value, page: 1 })
        }}
        value={params.status ?? 'all'}
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        aria-label="Sort by"
        className={controlClasses}
        onChange={(event) =>
          onChange({ sortBy: event.target.value as PurchaseOrderSortField, page: 1 })
        }
        value={params.sortBy ?? 'orderedAt'}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            Sort · {option.label}
          </option>
        ))}
      </select>

      <select
        aria-label="Sort order"
        className={controlClasses}
        onChange={(event) => onChange({ sortOrder: event.target.value as SortOrder, page: 1 })}
        value={params.sortOrder ?? 'desc'}
      >
        <option value="desc">Newest first</option>
        <option value="asc">Oldest first</option>
      </select>
    </div>
  )
}
