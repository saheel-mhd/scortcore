import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
  BarChart3,
  LayoutGrid,
  Loader2,
  Package,
  Receipt,
  Ruler,
  Settings,
  Tag,
  X,
} from 'lucide-react'

import { extractErrorMessage } from '@/api/client'
import {
  useCreateRoleConfig,
  useUpdateRoleConfig,
} from '@/modules/roles/hooks/use-role-configs'
import type { RoleConfig, RolePermissions } from '@/modules/roles/types/role-config.types'
import { defaultPermissions, permissionLabels } from '@/modules/roles/types/role-config.types'
import { Button } from '@/ui/button'

type Props = {
  open: boolean
  editing: RoleConfig | null
  onClose: () => void
}

const inputClasses =
  'w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/50 focus:outline-none'

const permissionIcons: Record<keyof RolePermissions, typeof Package> = {
  dashboard: BarChart3,
  products: Package,
  orders: Receipt,
  units: Ruler,
  coupons: Tag,
  layout: LayoutGrid,
  settings: Settings,
}

export function RoleFormDialog({ open, editing, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [permissions, setPermissions] = useState<RolePermissions>(defaultPermissions)

  const createMutation = useCreateRoleConfig()
  const updateMutation = useUpdateRoleConfig()
  const isPending = createMutation.isPending || updateMutation.isPending
  const error = createMutation.error ?? updateMutation.error

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
      setName(editing?.name ?? '')
      setDescription(editing?.description ?? '')
      setPermissions(editing?.permissions ?? { ...defaultPermissions })
      createMutation.reset()
      updateMutation.reset()
    }

    if (!open && dialog.open) {
      dialog.close()
    }
  }, [open, editing, createMutation, updateMutation])

  const togglePermission = (key: keyof RolePermissions) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (editing) {
      updateMutation.mutate(
        {
          id: editing.id,
          input: {
            name: name.trim() || undefined,
            description: description.trim() || undefined,
            permissions,
          },
        },
        { onSuccess: onClose }
      )
    } else {
      createMutation.mutate(
        {
          name: name.trim(),
          description: description.trim() || undefined,
          permissions,
        },
        { onSuccess: onClose }
      )
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-auto h-fit w-fit max-w-[90vw] rounded-3xl border border-white/10 bg-slate-950/95 p-0 text-white backdrop:bg-slate-950/70 backdrop:backdrop-blur-sm"
      onClose={onClose}
    >
      <form className="flex w-[min(36rem,92vw)] flex-col gap-5 p-6" onSubmit={handleSubmit}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Roles</p>
            <h2 className="mt-1 text-lg font-semibold">
              {editing ? 'Edit role' : 'New role'}
            </h2>
          </div>
          <Button aria-label="Close" onClick={onClose} size="icon-sm" type="button" variant="ghost">
            <X />
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-[0.2em] text-slate-400" htmlFor="role-name">
            Role name <span className="text-sky-300">*</span>
          </label>
          <input
            autoFocus
            className={inputClasses}
            id="role-name"
            maxLength={40}
            minLength={2}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Manager"
            required
            type="text"
            value={name}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-[0.2em] text-slate-400" htmlFor="role-desc">
            Description
          </label>
          <input
            className={inputClasses}
            id="role-desc"
            maxLength={300}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What this role is for"
            type="text"
            value={description}
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Page access
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {(Object.keys(permissionLabels) as (keyof RolePermissions)[]).map((key) => {
              const Icon = permissionIcons[key]
              const enabled = permissions[key]
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => togglePermission(key)}
                  className={[
                    'flex items-center gap-3 rounded-xl border p-3 text-left transition',
                    enabled
                      ? 'border-sky-400/40 bg-sky-400/10'
                      : 'border-white/10 bg-slate-950/40 hover:border-white/20',
                  ].join(' ')}
                >
                  <div
                    className={[
                      'flex size-8 shrink-0 items-center justify-center rounded-lg',
                      enabled ? 'bg-sky-400/20' : 'bg-slate-800',
                    ].join(' ')}
                  >
                    <Icon
                      className={`size-4 ${enabled ? 'text-sky-300' : 'text-slate-500'}`}
                      strokeWidth={1.5}
                    />
                  </div>
                  <span className={`text-sm font-medium ${enabled ? 'text-white' : 'text-slate-400'}`}>
                    {permissionLabels[key]}
                  </span>
                  <div
                    className={[
                      'ml-auto flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition',
                      enabled ? 'bg-sky-400' : 'bg-slate-700',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        'size-4 rounded-full bg-white transition-transform',
                        enabled ? 'translate-x-4' : 'translate-x-0',
                      ].join(' ')}
                    />
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {error ? (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {extractErrorMessage(error, 'Unable to save role')}
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
            ) : editing ? 'Save changes' : 'Create role'}
          </Button>
        </div>
      </form>
    </dialog>
  )
}
