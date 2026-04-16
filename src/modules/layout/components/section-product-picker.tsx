import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, Plus, Search, X } from 'lucide-react'

import { useProducts } from '@/modules/products/hooks/use-products'
import type { Product } from '@/modules/products/types/product.types'
import { Button } from '@/ui/button'

type Props = {
  selectedIds: string[]
  onChange: (next: string[]) => void
}

const inputClasses =
  'h-10 w-full rounded-xl border border-white/10 bg-slate-950/60 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/50 focus:outline-none'

export function SectionProductPicker({ selectedIds, onChange }: Props) {
  const [search, setSearch] = useState('')
  const productsQuery = useProducts({
    page: 1,
    limit: 50,
    search: search.trim() || undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })
  const selectedQuery = useProducts({
    page: 1,
    limit: 100,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })

  const productIndex = useMemo(() => {
    const map = new Map<string, Product>()
    for (const product of selectedQuery.data?.products ?? []) {
      map.set(product.id, product)
    }
    for (const product of productsQuery.data?.products ?? []) {
      map.set(product.id, product)
    }
    return map
  }, [selectedQuery.data, productsQuery.data])

  const selectedSet = new Set(selectedIds)
  const searchResults = (productsQuery.data?.products ?? []).filter(
    (product) => !selectedSet.has(product.id),
  )

  const handleAdd = (productId: string) => {
    if (selectedSet.has(productId)) return
    onChange([...selectedIds, productId])
  }

  const handleRemove = (productId: string) => {
    onChange(selectedIds.filter((id) => id !== productId))
  }

  const handleMove = (index: number, delta: -1 | 1) => {
    const nextIndex = index + delta
    if (nextIndex < 0 || nextIndex >= selectedIds.length) return
    const next = [...selectedIds]
    const [item] = next.splice(index, 1)
    next.splice(nextIndex, 0, item)
    onChange(next)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
          Selected products ({selectedIds.length})
        </p>
        {selectedIds.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/10 bg-slate-950/40 p-4 text-center text-xs text-slate-500">
            No products yet. Search below and click to add.
          </p>
        ) : (
          <ul className="flex flex-col gap-1">
            {selectedIds.map((id, index) => {
              const product = productIndex.get(id)
              const isLast = index === selectedIds.length - 1
              return (
                <li
                  key={id}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/50 p-2"
                >
                  <span className="w-6 shrink-0 text-center text-xs text-slate-500">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1 text-sm">
                    <p className="truncate font-medium text-white">
                      {product?.name ?? <em className="text-slate-500">Missing product</em>}
                    </p>
                    {product ? (
                      <p className="text-xs text-slate-500">SKU {product.sku}</p>
                    ) : null}
                  </div>
                  <Button
                    aria-label="Move up"
                    disabled={index === 0}
                    onClick={() => handleMove(index, -1)}
                    size="icon-sm"
                    type="button"
                    variant="ghost"
                  >
                    <ArrowUp />
                  </Button>
                  <Button
                    aria-label="Move down"
                    disabled={isLast}
                    onClick={() => handleMove(index, 1)}
                    size="icon-sm"
                    type="button"
                    variant="ghost"
                  >
                    <ArrowDown />
                  </Button>
                  <Button
                    aria-label="Remove"
                    onClick={() => handleRemove(id)}
                    size="icon-sm"
                    type="button"
                    variant="ghost"
                  >
                    <X />
                  </Button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Add products</p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            className={inputClasses}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, slug or SKU…"
            type="search"
            value={search}
          />
        </div>

        {productsQuery.isLoading ? (
          <p className="text-xs text-slate-500">Searching…</p>
        ) : searchResults.length === 0 ? (
          <p className="text-xs text-slate-500">No more products match that search.</p>
        ) : (
          <ul className="max-h-64 overflow-y-auto rounded-xl border border-white/10">
            {searchResults.map((product) => (
              <li
                key={product.id}
                className="flex items-center justify-between gap-3 border-b border-white/5 p-2 last:border-none"
              >
                <div className="min-w-0 text-sm">
                  <p className="truncate font-medium text-white">{product.name}</p>
                  <p className="text-xs text-slate-500">
                    SKU {product.sku}
                    {product.isActive ? '' : ' · inactive'}
                  </p>
                </div>
                <Button
                  onClick={() => handleAdd(product.id)}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  <Plus />
                  Add
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
