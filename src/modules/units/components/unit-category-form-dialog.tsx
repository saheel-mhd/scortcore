import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Loader2, X } from 'lucide-react'

import { extractErrorMessage } from '@/api/client'
import {
  useCreateUnitCategory,
  useUpdateUnitCategory,
} from '@/modules/units/hooks/use-unit-categories'
import type { UnitCategory } from '@/modules/units/types/unit.types'
import { Button } from '@/ui/button'

type Props = {
  open: boolean
  editing: UnitCategory | null
  onClose: () => void
}

const inputClasses =
  'w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/50 focus:outline-none'

export function UnitCategoryFormDialog({ open, editing, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [name, setName] = useState('')
  const [shortName, setShortName] = useState('')
  const [description, setDescription] = useState('')

  const createMutation = useCreateUnitCategory()
  const updateMutation = useUpdateUnitCategory()
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
      shortName: shortName.trim().toLowerCase(),
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
      <form className="flex w-[min(28rem,90vw)] flex-col gap-5 p-6" onSubmit={handleSubmit}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Units</p>
            <h2 className="mt-1 text-lg font-semibold">
              {editing ? 'Edit category' : 'New category'}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Define a measurement system like Alpha, Inches or Milliliters.
            </p>
          </div>
          <Button aria-label="Close" onClick={onClose} size="icon-sm" type="button" variant="ghost">
            <X />
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-[0.2em] text-slate-400" htmlFor="uc-name">
            Name <span className="text-sky-300">*</span>
          </label>
          <input
            className={inputClasses}
            id="uc-name"
            maxLength={60}
            minLength={2}
            onChange={(event) => setName(event.target.value)}
            placeholder="Alpha size"
            required
            type="text"
            value={name}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-[0.2em] text-slate-400" htmlFor="uc-short-name">
            Short name <span className="text-sky-300">*</span>
          </label>
          <input
            className={inputClasses}
            id="uc-short-name"
            maxLength={20}
            onChange={(event) => setShortName(event.target.value.toLowerCase())}
            pattern="[a-z0-9][a-z0-9_-]*"
            placeholder="alpha"
            required
            type="text"
            value={shortName}
          />
          <p className="text-xs text-slate-500">Lowercase letters, numbers, underscore, hyphen.</p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-[0.2em] text-slate-400" htmlFor="uc-description">
            Description
          </label>
          <textarea
            className={`${inputClasses} min-h-24`}
            id="uc-description"
            maxLength={500}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Optional notes."
            value={description}
          />
        </div>

        {error ? (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {extractErrorMessage(error, 'Unable to save category')}
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
            ) : editing ? 'Save changes' : 'Create category'}
          </Button>
        </div>
      </form>
    </dialog>
  )
}
