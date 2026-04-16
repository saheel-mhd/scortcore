import { Plus, Search } from 'lucide-react'
import { Link } from 'react-router-dom'

import type {
  ProductListParams,
  ProductSortField,
  SortOrder,
} from '@/modules/products/types/product.types'
import { routePaths } from '@/routes/paths'
import { Button } from '@/ui/button'

type Props = {
  params: ProductListParams
  onChange: (next: Partial<ProductListParams>) => void
}

const sortOptions: { label: string; value: ProductSortField }[] = [
  { label: 'Created', value: 'createdAt' },
  { label: 'Updated', value: 'updatedAt' },
  { label: 'Name', value: 'name' },
  { label: 'Price', value: 'price' },
]

const activeOptions = [
  { label: 'All', value: 'all' as const },
  { label: 'Active', value: 'active' as const },
  { label: 'Inactive', value: 'inactive' as const },
]

export function ProductsToolbar({ params, onChange }: Props) {
  const activeValue =
    params.isActive === undefined ? 'all' : params.isActive ? 'active' : 'inactive'

  const handleActiveChange = (value: 'all' | 'active' | 'inactive') => {
    onChange({
      isActive: value === 'all' ? undefined : value === 'active',
      page: 1,
    })
  }

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            className="h-10 w-64 rounded-xl border border-white/10 bg-slate-950/60 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/50 focus:outline-none"
            onChange={(event) => onChange({ search: event.target.value || undefined, page: 1 })}
            placeholder="Search name, slug or SKU…"
            type="search"
            value={params.search ?? ''}
          />
        </div>

        <Segmented
          label="Status"
          options={activeOptions}
          value={activeValue}
          onChange={handleActiveChange}
        />

        <select
          aria-label="Sort by"
          className="h-10 rounded-xl border border-white/10 bg-slate-950/60 px-3 text-sm text-white focus:border-sky-400/50 focus:outline-none"
          onChange={(event) =>
            onChange({ sortBy: event.target.value as ProductSortField, page: 1 })
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

      <Link to={routePaths.productsNew}>
        <Button>
          <Plus />
          New product
        </Button>
      </Link>
    </div>
  )
}

type SegmentedProps<T extends string> = {
  label: string
  options: { label: string; value: T }[]
  value: T
  onChange: (value: T) => void
}

function Segmented<T extends string>({ label, options, value, onChange }: SegmentedProps<T>) {
  return (
    <div
      aria-label={label}
      className="inline-flex h-10 items-center overflow-hidden rounded-xl border border-white/10 bg-slate-950/60 p-1"
      role="group"
    >
      {options.map((option) => {
        const isActive = option.value === value
        return (
          <button
            key={option.value}
            className={[
              'h-full rounded-lg px-3 text-xs font-medium transition',
              isActive
                ? 'bg-white text-slate-950'
                : 'text-slate-300 hover:text-white',
            ].join(' ')}
            onClick={() => onChange(option.value)}
            type="button"
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
