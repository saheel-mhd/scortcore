import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Loader2, X } from 'lucide-react'

import { extractErrorMessage } from '@/api/client'
import { SectionProductPicker } from '@/modules/layout/components/section-product-picker'
import {
  useCreateHomepageSection,
  useUpdateHomepageSection,
} from '@/modules/layout/hooks/use-homepage-sections'
import type { HomepageSection } from '@/modules/layout/types/homepage-section.types'
import { Button } from '@/ui/button'

type Props = {
  open: boolean
  editing: HomepageSection | null
  nextDisplayOrder: number
  onClose: () => void
}

const inputClasses =
  'w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/50 focus:outline-none'

export function SectionFormDialog({ open, editing, nextDisplayOrder, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [productIds, setProductIds] = useState<string[]>([])
  const [displayOrder, setDisplayOrder] = useState(0)

  const createMutation = useCreateHomepageSection()
  const updateMutation = useUpdateHomepageSection()
  const isPending = createMutation.isPending || updateMutation.isPending
  const error = createMutation.error ?? updateMutation.error

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
      setTitle(editing?.title ?? '')
      setDescription(editing?.description ?? '')
      setIsActive(editing?.isActive ?? true)
      setProductIds(editing?.productIds ?? [])
      setDisplayOrder(editing?.displayOrder ?? nextDisplayOrder)
      createMutation.reset()
      updateMutation.reset()
    }

    if (!open && dialog.open) {
      dialog.close()
    }
  }, [open, editing, nextDisplayOrder, createMutation, updateMutation])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedDescription = description.trim()
    const payload = {
      title: title.trim(),
      type: 'product' as const,
      productIds,
      isActive,
      displayOrder,
      ...(trimmedDescription ? { description: trimmedDescription } : {}),
    }

    if (editing) {
      updateMutation.mutate(
        { id: editing.id, input: payload },
        { onSuccess: onClose }
      )
    } else {
      createMutation.mutate(payload, { onSuccess: onClose })
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-auto h-fit w-fit max-w-[90vw] rounded-3xl border border-white/10 bg-slate-950/95 p-0 text-white backdrop:bg-slate-950/70 backdrop:backdrop-blur-sm"
      onClose={onClose}
    >
      <form className="flex w-[min(40rem,92vw)] flex-col gap-5 p-6" onSubmit={handleSubmit}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Layout</p>
            <h2 className="mt-1 text-lg font-semibold">
              {editing ? 'Edit section' : 'New section'}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Curate a collection to show on the store home page.
            </p>
          </div>
          <Button aria-label="Close" onClick={onClose} size="icon-sm" type="button" variant="ghost">
            <X />
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-[0.2em] text-slate-400" htmlFor="section-title">
              Title <span className="text-sky-300">*</span>
            </label>
            <input
              autoFocus
              className={inputClasses}
              id="section-title"
              maxLength={120}
              minLength={2}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="New Arrivals"
              required
              type="text"
              value={title}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-[0.2em] text-slate-400" htmlFor="section-order">
              Order
            </label>
            <input
              className={inputClasses}
              id="section-order"
              min={0}
              onChange={(event) => setDisplayOrder(Number(event.target.value) || 0)}
              step={1}
              type="number"
              value={displayOrder}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-[0.2em] text-slate-400" htmlFor="section-description">
            Description
          </label>
          <textarea
            className={`${inputClasses} min-h-20`}
            id="section-description"
            maxLength={500}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="New classic collections"
            value={description}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-[0.2em] text-slate-400" htmlFor="section-active">
            Active
          </label>
          <label className="inline-flex items-center gap-3 text-sm text-slate-200">
            <input
              checked={isActive}
              className="size-4 rounded border-white/20 bg-slate-950 text-sky-400 focus:ring-sky-400/50"
              id="section-active"
              onChange={(event) => setIsActive(event.target.checked)}
              type="checkbox"
            />
            {isActive ? 'Visible on the store' : 'Hidden'}
          </label>
        </div>

        <SectionProductPicker onChange={setProductIds} selectedIds={productIds} />

        {error ? (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {extractErrorMessage(error, 'Unable to save section')}
          </p>
        ) : null}

        <div className="flex justify-end gap-2">
          <Button disabled={isPending} onClick={onClose} type="button" variant="outline">
            Cancel
          </Button>
          <Button disabled={isPending} type="submit">
            {isPending ? (
              <>
                <Loader2 className="animate-spin" />
                Saving…
              </>
            ) : editing ? 'Save changes' : 'Create section'}
          </Button>
        </div>
      </form>
    </dialog>
  )
}
