import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { extractErrorMessage } from '@/api/client'
import { usePageTitle } from '@/hooks/use-page-title'
import { InventoryTable } from '@/modules/inventory/components/inventory-table'
import { InventoryToolbar } from '@/modules/inventory/components/inventory-toolbar'
import { StockAdjustDialog } from '@/modules/inventory/components/stock-adjust-dialog'
import { StockMovementsDialog } from '@/modules/inventory/components/stock-movements-dialog'
import { useInventory, useLowStock } from '@/modules/inventory/hooks/use-inventory'
import type { InventoryListParams, InventoryVariant,} from '@/modules/inventory/types/inventory.types'
import { PageHeader } from '@/shared/page-header'
import { PaginationControls } from '@/shared/pagination-controls'
import { PanelCard } from '@/shared/panel-card'
import { Button } from '@/ui/button'

const PAGE_SIZE = 20
const DEFAULT_THRESHOLD = 5

export default function InventoryPage() {
  usePageTitle('Inventory')

  const [searchParams, setSearchParams] = useSearchParams()
  const view = searchParams.get('view') === 'low' ? 'low' : 'all'

  const [params, setParams] = useState<InventoryListParams>({
    page: 1,
    limit: PAGE_SIZE,
    threshold: DEFAULT_THRESHOLD,
    sortBy: 'stock',
    sortOrder: 'asc',
  })

  const [adjusting, setAdjusting] = useState<InventoryVariant | null>(null)
  const [viewingMovements, setViewingMovements] = useState<InventoryVariant | null>(null)
  const allQuery = useInventory(params)
  const lowQuery = useLowStock(params)
  const query = view === 'low' ? lowQuery : allQuery
  const threshold = params.threshold ?? DEFAULT_THRESHOLD
  const lowStockCount = lowQuery.data?.pagination.total ?? null

  const handleParamsChange = (next: Partial<InventoryListParams>) => {
    setParams((current) => ({ ...current, ...next }))
  }

  const setView = (nextView: 'all' | 'low') => {
    const nextParams = new URLSearchParams(searchParams)
    if (nextView === 'low') {
      nextParams.set('view', 'low')
    } else {
      nextParams.delete('view')
    }
    setSearchParams(nextParams, { replace: true })
    handleParamsChange({ page: 1 })
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Inventory"
        description="Adjust stock counts and review every movement. Stock lives on product variants, so each row is one product and unit."
      />

      <PanelCard
        title={view === 'low' ? 'Low stock' : 'Stock levels'}
        description={
          query.data
            ? `${query.data.pagination.total} variant${query.data.pagination.total === 1 ? '' : 's'}${
                view === 'low' ? ` at or below ${threshold}` : ''
              }`
            : 'Loading…'
        }
        action={
          <div className="inline-flex h-10 items-center overflow-hidden rounded-xl border border-white/10 bg-slate-950/60 p-1">
            <Button
              onClick={() => setView('all')}
              size="sm"
              variant={view === 'all' ? 'default' : 'ghost'}
            >
              All
            </Button>
            <Button
              onClick={() => setView('low')}
              size="sm"
              variant={view === 'low' ? 'default' : 'ghost'}
            >
              Low stock
              {lowStockCount !== null && lowStockCount > 0 ? (
                <span className="ml-1 rounded bg-amber-400/20 px-1.5 text-[10px] text-amber-200">
                  {lowStockCount}
                </span>
              ) : null}
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <InventoryToolbar onChange={handleParamsChange} params={params} />

          {query.isLoading ? (
            <p className="text-sm text-slate-400">Loading stock levels…</p>
          ) : query.isError ? (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
              {extractErrorMessage(query.error, 'Failed to load inventory')}
            </p>
          ) : query.data ? (
            <>
              <InventoryTable
                emptyMessage={
                  view === 'low'
                    ? `Nothing at or below ${threshold}. Stock levels look healthy.`
                    : 'No stock records yet. Create a product with variants first.'
                }
                items={query.data.items}
                onAdjust={setAdjusting}
                onViewMovements={setViewingMovements}
                threshold={threshold}
              />

              <PaginationControls
                limit={query.data.pagination.limit}
                onChange={(page) => handleParamsChange({ page })}
                page={query.data.pagination.page}
                total={query.data.pagination.total}
                totalPages={query.data.pagination.totalPages}
              />
            </>
          ) : null}
        </div>
      </PanelCard>

      <StockAdjustDialog
        onClose={() => setAdjusting(null)}
        open={adjusting !== null}
        variant={adjusting}
      />
      <StockMovementsDialog
        onClose={() => setViewingMovements(null)}
        open={viewingMovements !== null}
        variant={viewingMovements}
      />
    </div>
  )
}
