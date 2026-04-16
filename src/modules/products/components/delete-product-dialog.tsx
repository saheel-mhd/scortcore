import { useEffect, useRef } from 'react'
import { Loader2, Trash2, X } from 'lucide-react'

import { extractErrorMessage } from '@/api/client'
import { useDeleteProduct } from '@/modules/products/hooks/use-delete-product'
import type { Product } from '@/modules/products/types/product.types'
import { Button } from '@/ui/button'

type Props = {
  product: Product | null
  onClose: () => void
}

export function DeleteProductDialog({ product, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const { mutate, isPending, error, reset } = useDeleteProduct()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (product && !dialog.open) {
      dialog.showModal()
      reset()
    }

    if (!product && dialog.open) {
      dialog.close()
    }
  }, [product, reset])

  const handleConfirm = () => {
    if (!product) return

    mutate(product.id, {
      onSuccess: onClose,
    })
  }

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-auto h-fit w-fit max-w-[90vw] rounded-3xl border border-white/10 bg-slate-950/95 p-0 text-white backdrop:bg-slate-950/70 backdrop:backdrop-blur-sm"
      onClose={onClose}
    >
      {product ? (
        <div className="flex w-[min(26rem,90vw)] flex-col gap-5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-red-300">Delete</p>
              <h2 className="mt-1 text-lg font-semibold">Delete product</h2>
              <p className="mt-2 text-sm text-slate-300">
                This permanently removes <span className="font-semibold text-white">{product.name}</span>{' '}
                and its inventory history. This cannot be undone.
              </p>
            </div>
            <Button
              aria-label="Close"
              onClick={onClose}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <X />
            </Button>
          </div>

          {error ? (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {extractErrorMessage(error, 'Unable to delete product')}
            </p>
          ) : null}

          <div className="flex justify-end gap-2">
            <Button disabled={isPending} onClick={onClose} type="button" variant="outline">
              Cancel
            </Button>
            <Button
              disabled={isPending}
              onClick={handleConfirm}
              type="button"
              variant="destructive"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" />
                  Deleting…
                </>
              ) : (
                <>
                  <Trash2 />
                  Delete
                </>
              )}
            </Button>
          </div>
        </div>
      ) : null}
    </dialog>
  )
}
