import { useEffect, useRef } from 'react'
import { GalleryHorizontalEnd, Image, LayoutGrid, Star, X } from 'lucide-react'

import type { ShopRowType } from '@/modules/shop-layout/types/shop-section.types'
import { Button } from '@/ui/button'

type Props = {
  open: boolean
  onClose: () => void
  onChoose: (type: ShopRowType) => void
}

const rowTypes: { type: ShopRowType; icon: typeof Star; label: string; description: string }[] = [
  {
    type: 'featured',
    icon: Star,
    label: 'Featured spotlight',
    description: 'Large hero card(s) for new arrivals or spotlight products — maximum visual impact.',
  },
  {
    type: 'grid',
    icon: LayoutGrid,
    label: 'Product grid',
    description: 'Standard multi-column grid. Pick 2, 3, or 4 columns.',
  },
  {
    type: 'carousel',
    icon: GalleryHorizontalEnd,
    label: 'Carousel strip',
    description: 'Horizontal scrolling product row — great for collections or related items.',
  },
  {
    type: 'banner',
    icon: Image,
    label: 'Promotional banner',
    description: 'Full-width hero with background image, text, and call-to-action button.',
  },
]

export function ShopRowTypeChooser({ open, onClose, onChoose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const programmaticClose = useRef(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
    }
    if (!open && dialog.open) {
      programmaticClose.current = true
      dialog.close()
    }
  }, [open])

  const handleDialogClose = () => {
    if (programmaticClose.current) {
      programmaticClose.current = false
      return
    }
    onClose()
  }

  const handleChoose = (type: ShopRowType) => {
    programmaticClose.current = true
    onChoose(type)
  }

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-auto h-fit w-fit max-w-[90vw] rounded-3xl border border-white/10 bg-slate-950/95 p-0 text-white backdrop:bg-slate-950/70 backdrop:backdrop-blur-sm"
      onClose={handleDialogClose}
    >
      <div className="flex w-[min(40rem,92vw)] flex-col gap-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Shop layout</p>
            <h2 className="mt-1 text-lg font-semibold">Add a new row</h2>
            <p className="mt-1 text-sm text-slate-400">
              Choose the layout style for this row on the shop page.
            </p>
          </div>
          <Button aria-label="Close" onClick={onClose} size="icon-sm" type="button" variant="ghost">
            <X />
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {rowTypes.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.type}
                className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-slate-950/60 p-5 text-left transition hover:border-sky-400/50 hover:bg-slate-950/80"
                onClick={() => handleChoose(item.type)}
                type="button"
              >
                <Icon className="size-6 text-sky-300" strokeWidth={1.5} />
                <p className="font-medium text-white">{item.label}</p>
                <p className="text-xs text-slate-400">{item.description}</p>
              </button>
            )
          })}
        </div>
      </div>
    </dialog>
  )
}
