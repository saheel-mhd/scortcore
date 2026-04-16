import type {
  OrderSortField,
  OrderStatus,
  OrdersListParams,
  SortOrder,
} from '@/modules/orders/types/order.types'

type Props = {
  params: OrdersListParams
  onChange: (next: Partial<OrdersListParams>) => void
}

const statusOptions: { label: string; value: 'all' | OrderStatus }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Paid', value: 'paid' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
]

const sortOptions: { label: string; value: OrderSortField }[] = [
  { label: 'Created', value: 'createdAt' },
  { label: 'Updated', value: 'updatedAt' },
  { label: 'Status', value: 'status' },
  { label: 'Total', value: 'totalAmount' },
]

export function OrdersToolbar({ params, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div
        className="inline-flex h-10 items-center overflow-hidden rounded-xl border border-white/10 bg-slate-950/60 p-1"
        role="group"
      >
        {statusOptions.map((option) => {
          const isActive =
            (option.value === 'all' && !params.status) || option.value === params.status
          return (
            <button
              key={option.value}
              className={[
                'h-full rounded-lg px-3 text-xs font-medium transition',
                isActive ? 'bg-white text-slate-950' : 'text-slate-300 hover:text-white',
              ].join(' ')}
              onClick={() =>
                onChange({
                  status: option.value === 'all' ? undefined : option.value,
                  page: 1,
                })
              }
              type="button"
            >
              {option.label}
            </button>
          )
        })}
      </div>

      <input
        aria-label="Customer ID"
        className="h-10 w-64 rounded-xl border border-white/10 bg-slate-950/60 px-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/50 focus:outline-none"
        onChange={(event) =>
          onChange({ customerId: event.target.value.trim() || undefined, page: 1 })
        }
        placeholder="Filter by customer ID…"
        type="text"
        value={params.customerId ?? ''}
      />

      <select
        aria-label="Sort by"
        className="h-10 rounded-xl border border-white/10 bg-slate-950/60 px-3 text-sm text-white focus:border-sky-400/50 focus:outline-none"
        onChange={(event) =>
          onChange({ sortBy: event.target.value as OrderSortField, page: 1 })
        }
        value={params.sortBy ?? 'createdAt'}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            Sort · {option.label}
          </option>
        ))}
      </select>

      <select
        aria-label="Sort order"
        className="h-10 rounded-xl border border-white/10 bg-slate-950/60 px-3 text-sm text-white focus:border-sky-400/50 focus:outline-none"
        onChange={(event) =>
          onChange({ sortOrder: event.target.value as SortOrder, page: 1 })
        }
        value={params.sortOrder ?? 'desc'}
      >
        <option value="desc">Newest first</option>
        <option value="asc">Oldest first</option>
      </select>
    </div>
  )
}
