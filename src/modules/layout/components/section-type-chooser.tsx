import { useEffect, useRef } from 'react'
import { Image, LayoutGrid, X } from 'lucide-react'

import type { SectionType } from '@/modules/layout/types/homepage-section.types'
import { Button } from '@/ui/button'

type Props = {
  open: boolean
  onClose: () => void
  onChoose: (type: SectionType) => void
}

export function SectionTypeChooser({ open, onClose, onChoose }: Props) {
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

  const handleChoose = (type: SectionType) => {
    programmaticClose.current = true
    onChoose(type)
  }

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-auto h-fit w-fit max-w-[90vw] rounded-3xl border border-white/10 bg-slate-950/95 p-0 text-white backdrop:bg-slate-950/70 backdrop:backdrop-blur-sm"
      onClose={handleDialogClose}
    >
      <div className="flex w-[min(32rem,92vw)] flex-col gap-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Layout</p>
            <h2 className="mt-1 text-lg font-semibold">What kind of section?</h2>
            <p className="mt-1 text-sm text-slate-400">
              Pick how this section should look on the store.
            </p>
          </div>
          <Button aria-label="Close" onClick={onClose} size="icon-sm" type="button" variant="ghost">
            <X />
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-slate-950/60 p-5 text-left transition hover:border-sky-400/50 hover:bg-slate-950/80"
            onClick={() => handleChoose('product')}
            type="button"
          >
            <LayoutGrid className="size-6 text-sky-300" strokeWidth={1.5} />
            <p className="font-medium text-white">Product collection</p>
            <p className="text-xs text-slate-400">
              Pick products to feature — shown as a grid on the home page.
            </p>
          </button>

          <button
            className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-slate-950/60 p-5 text-left transition hover:border-sky-400/50 hover:bg-slate-950/80"
            onClick={() => handleChoose('banner')}
            type="button"
          >
            <Image className="size-6 text-sky-300" strokeWidth={1.5} />
            <p className="font-medium text-white">Banner</p>
            <p className="text-xs text-slate-400">
              A promotional hero with image, heading, description and call to action.
            </p>
          </button>
        </div>
      </div>
    </dialog>
  )
}
