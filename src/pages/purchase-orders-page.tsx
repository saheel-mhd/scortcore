import { useState } from 'react'
import { Plus } from 'lucide-react'
import { extractErrorMessage } from '@/api/client'
import { usePageTitle } from '@/hooks/use-page-title'
import { PurchaseOrderFormDialog } from '@/modules/purchase-orders/components/purchase-order-form-dialog'
import { PurchaseOrdersTable } from '@/modules/purchase-orders/components/purchase-orders-table'
import { PurchaseOrdersToolbar } from '@/modules/purchase-orders/components/purchase-orders-toolbar'
import { ReceiveStockDialog } from '@/modules/purchase-orders/components/receive-stock-dialog'
import { usePurchaseOrders } from '@/modules/purchase-orders/hooks/use-purchase-orders'
import type { PurchaseOrder, PurchaseOrderListParams,} from '@/modules/purchase-orders/types/purchase-order.types'
import { PageHeader } from '@/shared/page-header'
import { PaginationControls } from '@/shared/pagination-controls'
import { PanelCard } from '@/shared/panel-card'
import { Button } from '@/ui/button'

const PAGE_SIZE = 20

export default function PurchaseOrdersPage() {
  usePageTitle('Purchase orders')

  const [params, setParams] = useState<PurchaseOrderListParams>({
    page: 1,
    limit: PAGE_SIZE,
    sortBy: 'orderedAt',
    sortOrder: 'desc',
  })

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [receiving, setReceiving] = useState<PurchaseOrder | null>(null)
  const query = usePurchaseOrders(params)
  const handleParamsChange = (next: Partial<PurchaseOrderListParams>) => {
    setParams((current) => ({ ...current, ...next }))
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Purchase orders"
        description="Order stock from suppliers and receive it in full or in parts. Receiving is the only action that increases stock."
      />

      <PanelCard
        title="Orders"
        description={
          query.data
            ? `${query.data.pagination.total} purchase order${
                query.data.pagination.total === 1 ? '' : 's'
              }`
            : 'Loading…'
        }
        action={
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus />
            New purchase order
          </Button>
        }
      >
        <div className="flex flex-col gap-4">
          <PurchaseOrdersToolbar onChange={handleParamsChange} params={params} />

          {query.isLoading ? (
            <p className="text-sm text-slate-400">Loading purchase orders…</p>
          ) : query.isError ? (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
              {extractErrorMessage(query.error, 'Failed to load purchase orders')}
            </p>
          ) : query.data ? (
            <>
              <PurchaseOrdersTable items={query.data.purchaseOrders} onReceive={setReceiving} />

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

      <PurchaseOrderFormDialog onClose={() => setIsCreateOpen(false)} open={isCreateOpen} />
      <ReceiveStockDialog
        onClose={() => setReceiving(null)}
        open={receiving !== null}
        purchaseOrder={receiving}
      />
    </div>
  )
}
