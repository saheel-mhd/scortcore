import { Search } from 'lucide-react'
import type { InventoryListParams, InventorySortField, SortOrder, } from '@/modules/inventory/types/inventory.types'

type Props = {
  params: InventoryListParams
  onChange: (next: Partial<InventoryListParams>) => void
}

const sortOptions: { label: string; value: InventorySortField }[] = [
  { label: 'Stock', value: 'stock' },
  { label: 'Updated', value: 'updatedAt' },
  { label: 'Created', value: 'createdAt' },
]

const controlClasses = 'h-10 rounded-xl border border-white/10 bg-slate-950/60 px-3 text-sm text-white focus:border-sky-400/50 focus:outline-none'

export function InventoryToolbar({ params, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input
          className="h-10 w-64 rounded-xl border border-white/10 bg-slate-950/60 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/50 focus:outline-none"
          onChange={(event) => onChange({ search: event.target.value || undefined, page: 1 })}
          placeholder="Search product or SKU…"
          type="search"
          value={params.search ?? ''}
        />
      </div>

      <label className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-slate-950/60 px-3 text-xs text-slate-400">
        Low-stock at
        <input
          aria-label="Low stock threshold"
          className="w-14 bg-transparent text-sm text-white tabular-nums focus:outline-none"
          min={0}
          onChange={(event) => {
            const next = Number(event.target.value)
            onChange({
              threshold: Number.isInteger(next) && next >= 0 ? next : undefined,
              page: 1,
            })
          }}
          step={1}
          type="number"
          value={params.threshold ?? 5}
        />
      </label>

      <select
        aria-label="Sort by"
        className={controlClasses}
        onChange={(event) =>
          onChange({ sortBy: event.target.value as InventorySortField, page: 1 })
        }
        value={params.sortBy ?? 'stock'}
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
        value={params.sortOrder ?? 'asc'}
      >
        <option value="asc">Lowest first</option>
        <option value="desc">Highest first</option>
      </select>
    </div>
  )
}
