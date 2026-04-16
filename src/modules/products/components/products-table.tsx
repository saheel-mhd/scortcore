import { Boxes, Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { Product } from '@/modules/products/types/product.types'
import { routePaths } from '@/routes/paths'
import { Button } from '@/ui/button'

type Props = {
  products: Product[]
  onAdjustStock: (product: Product) => void
  onDelete: (product: Product) => void
  deletingId: string | null
}

const currencyFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function ProductsTable({ products, onAdjustStock, onDelete, deletingId }: Props) {
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
            <Th className="text-right">Stock</Th>
            <Th>Status</Th>
            <Th className="text-right">Actions</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 bg-slate-950/40">
          {products.map((product) => {
            const isDeleting = deletingId === product.id

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
                <Td className="text-right tabular-nums">{currencyFormatter.format(product.price)}</Td>
                <Td className="text-right tabular-nums">
                  <span
                    className={product.stock === 0 ? 'text-red-300' : undefined}
                  >
                    {product.stock}
                  </span>
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
                    <Button
                      aria-label={`Adjust stock for ${product.name}`}
                      onClick={() => onAdjustStock(product)}
                      size="icon-sm"
                      variant="ghost"
                    >
                      <Boxes />
                    </Button>
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
