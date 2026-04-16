import { ArrowLeft } from 'lucide-react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'

import { extractErrorMessage } from '@/api/client'
import { usePageTitle } from '@/hooks/use-page-title'
import { ProductForm } from '@/modules/products/components/product-form'
import { useProduct } from '@/modules/products/hooks/use-product'
import { useUpdateProduct } from '@/modules/products/hooks/use-update-product'
import { routePaths } from '@/routes/paths'
import { PageHeader } from '@/shared/page-header'
import { PanelCard } from '@/shared/panel-card'
import { Button } from '@/ui/button'

export default function ProductsEditPage() {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const query = useProduct(id)
  const updateMutation = useUpdateProduct()

  usePageTitle(query.data ? `Edit · ${query.data.name}` : 'Edit product')

  if (!id) {
    return <Navigate replace to={routePaths.products} />
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        badge="Catalog"
        title="Edit product"
        description="Update catalog details and per-size stock."
        action={
          <Link to={routePaths.products}>
            <Button variant="outline">
              <ArrowLeft />
              Back
            </Button>
          </Link>
        }
      />

      {query.isLoading ? (
        <PanelCard title="Loading…">
          <p className="text-sm text-slate-400">Fetching product details.</p>
        </PanelCard>
      ) : query.isError ? (
        <PanelCard title="Failed to load">
          <p className="text-sm text-red-200">
            {extractErrorMessage(query.error, 'Unable to load product')}
          </p>
        </PanelCard>
      ) : query.data ? (
        <PanelCard
          title={query.data.name}
          description={`SKU ${query.data.sku} · ${query.data.isActive ? 'Active' : 'Inactive'}`}
        >
          <ProductForm
            error={updateMutation.error}
            isSubmitting={updateMutation.isPending}
            mode="edit"
            onSubmit={(input) => {
              updateMutation.mutate(
                { id, input },
                {
                  onSuccess: () => navigate(routePaths.products),
                }
              )
            }}
            product={query.data}
            submitLabel="Save changes"
          />
        </PanelCard>
      ) : null}
    </div>
  )
}
