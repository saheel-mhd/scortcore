import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { extractErrorMessage } from '@/api/client'
import { DeleteProductDialog } from '@/modules/products/components/delete-product-dialog'
import { useProducts } from '@/modules/products/hooks/use-products'
import { ProductsTable } from '@/modules/products/components/products-table'
import { ProductsToolbar } from '@/modules/products/components/products-toolbar'
import { StockAdjustDialog } from '@/modules/products/components/stock-adjust-dialog'
import type {
  Product,
  ProductListParams,
  ProductSortField,
  SortOrder,
} from '@/modules/products/types/product.types'
import { PageHeader } from '@/shared/page-header'
import { PaginationControls } from '@/shared/pagination-controls'
import { PanelCard } from '@/shared/panel-card'
import { usePageTitle } from '@/hooks/use-page-title'

const DEFAULT_LIMIT = 10

function parseParams(searchParams: URLSearchParams): ProductListParams {
  const page = Number(searchParams.get('page') ?? '1') || 1
  const limit = Number(searchParams.get('limit') ?? String(DEFAULT_LIMIT)) || DEFAULT_LIMIT
  const search = searchParams.get('search') ?? undefined
  const isActiveRaw = searchParams.get('isActive')
  const isActive =
    isActiveRaw === 'true' ? true : isActiveRaw === 'false' ? false : undefined
  const sortBy = (searchParams.get('sortBy') as ProductSortField | null) ?? 'createdAt'
  const sortOrder = (searchParams.get('sortOrder') as SortOrder | null) ?? 'desc'

  return { page, limit, search, isActive, sortBy, sortOrder }
}

export default function ProductsListPage() {
  usePageTitle('Products')

  const [searchParams, setSearchParams] = useSearchParams()
  const params = useMemo(() => parseParams(searchParams), [searchParams])

  const [stockProduct, setStockProduct] = useState<Product | null>(null)
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)

  const query = useProducts(params)

  const updateParams = (next: Partial<ProductListParams>) => {
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
        badge="Catalog"
        title="Products"
        description="Manage the products powering the store and inventory."
      />

      <PanelCard title="Filters" description="Refine the catalog by name, SKU, status, or sort.">
        <ProductsToolbar params={params} onChange={updateParams} />
      </PanelCard>

      <PanelCard
        title="All products"
        description={
          query.data
            ? `${query.data.pagination.total} total`
            : 'Loading products…'
        }
      >
        {query.isLoading ? (
          <div className="flex min-h-40 items-center justify-center text-sm text-slate-400">
            Loading products…
          </div>
        ) : query.isError ? (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {extractErrorMessage(query.error, 'Failed to load products')}
          </div>
        ) : query.data ? (
          <div className="flex flex-col gap-4">
            <ProductsTable
              deletingId={deleteProduct?.id ?? null}
              onAdjustStock={setStockProduct}
              onDelete={setDeleteProduct}
              products={query.data.products}
            />
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

      <StockAdjustDialog product={stockProduct} onClose={() => setStockProduct(null)} />
      <DeleteProductDialog product={deleteProduct} onClose={() => setDeleteProduct(null)} />
    </div>
  )
}
