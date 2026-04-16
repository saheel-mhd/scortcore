import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Loader2, X } from 'lucide-react'

import { extractErrorMessage } from '@/api/client'
import { useUnitCategories } from '@/modules/units/hooks/use-unit-categories'
import { useCreateUnit, useUpdateUnit } from '@/modules/units/hooks/use-units'
import type { Unit } from '@/modules/units/types/unit.types'
import { Button } from '@/ui/button'

type Props = {
  open: boolean
  editing: Unit | null
  onClose: () => void
}

const inputClasses =
  'w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/50 focus:outline-none'

export function UnitFormDialog({ open, editing, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [name, setName] = useState('')
  const [shortName, setShortName] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')

  const categoriesQuery = useUnitCategories({ page: 1, limit: 100, sortBy: 'name', sortOrder: 'asc' })
  const createMutation = useCreateUnit()
  const updateMutation = useUpdateUnit()
  const isPending = createMutation.isPending || updateMutation.isPending
  const error = createMutation.error ?? updateMutation.error

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
      setName(editing?.name ?? '')
      setShortName(editing?.shortName ?? '')
      setDescription(editing?.description ?? '')
      setCategoryId(editing?.categoryId ?? '')
      createMutation.reset()
      updateMutation.reset()
    }

    if (!open && dialog.open) {
      dialog.close()
    }
  }, [open, editing, createMutation, updateMutation])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedDescription = description.trim()
    const payload = {
      name: name.trim(),
      shortName: shortName.trim(),
      categoryId,
      ...(trimmedDescription ? { description: trimmedDescription } : {}),
    }

    if (editing) {
      updateMutation.mutate({ id: editing.id, input: payload }, { onSuccess: onClose })
    } else {
      createMutation.mutate(payload, { onSuccess: onClose })
    }
  }

  const categories = categoriesQuery.data?.items ?? []

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-auto h-fit w-fit max-w-[90vw] rounded-3xl border border-white/10 bg-slate-950/95 p-0 text-white backdrop:bg-slate-950/70 backdrop:backdrop-blur-sm"
      onClose={onClose}
    >
      <form className="flex w-[min(28rem,90vw)] flex-col gap-5 p-6" onSubmit={handleSubmit}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Units</p>
            <h2 className="mt-1 text-lg font-semibold">
              {editing ? 'Edit unit' : 'New unit'}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              A specific size value that products can use (e.g. Medium, 32, 100ml).
            </p>
          </div>
          <Button aria-label="Close" onClick={onClose} size="icon-sm" type="button" variant="ghost">
            <X />
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-[0.2em] text-slate-400" htmlFor="unit-category">
            Category <span className="text-sky-300">*</span>
          </label>
          <select
            className={inputClasses}
            id="unit-category"
            onChange={(event) => setCategoryId(event.target.value)}
            required
            value={categoryId}
          >
            <option value="" disabled>
              {categoriesQuery.isLoading ? 'Loading…' : 'Choose a category'}
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.shortName})
              </option>
            ))}
          </select>
          {categories.length === 0 && !categoriesQuery.isLoading ? (
            <p className="text-xs text-amber-300">
              No categories yet. Create one first on the Categories tab.
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-[0.2em] text-slate-400" htmlFor="unit-name">
            Name <span className="text-sky-300">*</span>
          </label>
          <input
            className={inputClasses}
            id="unit-name"
            maxLength={60}
            onChange={(event) => setName(event.target.value)}
            placeholder="Medium"
            required
            type="text"
            value={name}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-[0.2em] text-slate-400" htmlFor="unit-short-name">
            Short name <span className="text-sky-300">*</span>
          </label>
          <input
            className={inputClasses}
            id="unit-short-name"
            maxLength={20}
            onChange={(event) => setShortName(event.target.value)}
            placeholder="M"
            required
            type="text"
            value={shortName}
          />
          <p className="text-xs text-slate-500">
            Shown in product forms and cart (e.g. M, 32, 100ml).
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-[0.2em] text-slate-400" htmlFor="unit-description">
            Description
          </label>
          <textarea
            className={`${inputClasses} min-h-24`}
            id="unit-description"
            maxLength={500}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Optional notes."
            value={description}
          />
        </div>

        {error ? (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {extractErrorMessage(error, 'Unable to save unit')}
          </p>
        ) : null}

        <div className="flex justify-end gap-2">
          <Button disabled={isPending} onClick={onClose} type="button" variant="outline">
            Cancel
          </Button>
          <Button disabled={isPending || !categoryId} type="submit">
            {isPending ? (
              <>
                <Loader2 className="animate-spin" />
                Saving…
              </>
            ) : editing ? 'Save changes' : 'Create unit'}
          </Button>
        </div>
      </form>
    </dialog>
  )
}
