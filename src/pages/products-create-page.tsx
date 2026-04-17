import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import { usePageTitle } from '@/hooks/use-page-title'
import { ProductForm } from '@/modules/products/components/product-form'
import { useCreateProduct } from '@/modules/products/hooks/use-create-product'
import { routePaths } from '@/routes/paths'
import { PageHeader } from '@/shared/page-header'
import { PanelCard } from '@/shared/panel-card'
import { Button } from '@/ui/button'

export default function ProductsCreatePage() {
  usePageTitle('New product')

  const navigate = useNavigate()
  const mutation = useCreateProduct()

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="New product"
        description="Add a product to the catalog. Stock is tracked as an inventory movement."
        action={
          <Link to={routePaths.products}>
            <Button variant="outline">
              <ArrowLeft />
              Back
            </Button>
          </Link>
        }
      />

      <PanelCard title="Product details">
        <ProductForm
          mode="create"
          onSubmit={(input) => {
            mutation.mutate(input, {
              onSuccess: () => navigate(routePaths.products),
            })
          }}
          isSubmitting={mutation.isPending}
          error={mutation.error}
          submitLabel="Create product"
        />
      </PanelCard>
    </div>
  )
}
