import { Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { Product } from '@/modules/products/types/product.types'
import { routePaths } from '@/routes/paths'
import { Button } from '@/ui/button'

type Props = {
  products: Product[]
  onDelete: (product: Product) => void
  deletingId: string | null
}

const currencyFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function totalStock(product: Product): number {
  return product.variants.reduce((sum, variant) => sum + variant.stock, 0)
}

export function ProductsTable({ products, onDelete, deletingId }: Props) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-8 text-center">
        <p className="text-sm text-slate-400">
          No products match your filters. Adjust the search or create a new product.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <table className="min-w-full divide-y divide-white/5 text-sm">
        <thead className="bg-slate-950/70 text-left text-xs uppercase tracking-[0.2em] text-slate-400">
          <tr>
            <Th>Name</Th>
            <Th>SKU</Th>
            <Th className="text-right">Price</Th>
            <Th className="text-right">Total stock</Th>
            <Th>Sizes</Th>
            <Th>Status</Th>
            <Th className="text-right">Actions</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 bg-slate-950/40">
          {products.map((product) => {
            const isDeleting = deletingId === product.id
            const total = totalStock(product)

            return (
              <tr key={product.id} className="text-slate-200">
                <Td>
                  <Link
                    className="font-medium text-white hover:text-sky-300"
                    to={routePaths.productsEdit.replace(':id', product.id)}
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-slate-500">/{product.slug}</p>
                </Td>
                <Td>
                  <code className="rounded bg-white/5 px-2 py-0.5 text-xs text-slate-300">
                    {product.sku}
                  </code>
                </Td>
                <Td className="text-right tabular-nums">
                  {currencyFormatter.format(product.price)}
                </Td>
                <Td className="text-right tabular-nums">
                  <span className={total === 0 ? 'text-red-300' : undefined}>{total}</span>
                </Td>
                <Td>
                  <div className="flex flex-wrap gap-1">
                    {product.variants.length === 0 ? (
                      <span className="text-xs text-slate-500">—</span>
                    ) : (
                      product.variants.map((variant) => (
                        <code
                          key={variant.id}
                          className={[
                            'rounded px-1.5 py-0.5 text-xs',
                            variant.stock === 0
                              ? 'bg-red-500/10 text-red-300'
                              : 'bg-white/5 text-slate-300',
                          ].join(' ')}
                          title={`${variant.unit.name} · stock ${variant.stock}`}
                        >
                          {variant.unit.shortName}
                        </code>
                      ))
                    )}
                  </div>
                </Td>
                <Td>
                  <span
                    className={[
                      'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                      product.isActive
                        ? 'bg-emerald-500/10 text-emerald-300'
                        : 'bg-slate-500/15 text-slate-300',
                    ].join(' ')}
                  >
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </Td>
                <Td className="text-right">
                  <div className="inline-flex items-center gap-1">
                    <Link
                      aria-label={`Edit ${product.name}`}
                      to={routePaths.productsEdit.replace(':id', product.id)}
                    >
                      <Button size="icon-sm" variant="ghost">
                        <Pencil />
                      </Button>
                    </Link>
                    <Button
                      aria-label={`Delete ${product.name}`}
                      disabled={isDeleting}
                      onClick={() => onDelete(product)}
                      size="icon-sm"
                      variant="destructive"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </Td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-4 py-3 font-medium ${className ?? ''}`}>{children}</th>
}

function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 ${className ?? ''}`}>{children}</td>
}
