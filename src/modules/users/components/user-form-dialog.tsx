import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Loader2, X } from 'lucide-react'

import { extractErrorMessage } from '@/api/client'
import { useRoleConfigs } from '@/modules/roles/hooks/use-role-configs'
import {
  useCreateUser,
  useUpdateUser,
} from '@/modules/users/hooks/use-users'
import type { User } from '@/modules/users/types/user.types'
import { Button } from '@/ui/button'

type Props = {
  open: boolean
  editing: User | null
  onClose: () => void
}

const inputClasses =
  'w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/50 focus:outline-none'

export function UserFormDialog({ open, editing, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [roleConfigId, setRoleConfigId] = useState('')

  const rolesQuery = useRoleConfigs()
  const roles = (rolesQuery.data?.roles ?? []).filter((r) => r.name !== 'customer')

  const createMutation = useCreateUser()
  const updateMutation = useUpdateUser()
  const isPending = createMutation.isPending || updateMutation.isPending
  const error = createMutation.error ?? updateMutation.error

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
      setEmail(editing?.email ?? '')
      setPassword('')
      setRoleConfigId(editing?.roleConfigId ?? '')
      createMutation.reset()
      updateMutation.reset()
    }

    if (!open && dialog.open) {
      dialog.close()
    }
  }, [open, editing, createMutation, updateMutation])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (editing) {
      const input: Record<string, string> = {}
      if (email.trim() !== editing.email) input.email = email.trim().toLowerCase()
      if (password) input.password = password
      if (roleConfigId && roleConfigId !== editing.roleConfigId) input.roleConfigId = roleConfigId

      if (Object.keys(input).length === 0) {
        onClose()
        return
      }

      updateMutation.mutate(
        { id: editing.id, input },
        { onSuccess: onClose }
      )
    } else {
      createMutation.mutate(
        {
          email: email.trim().toLowerCase(),
          password,
          roleConfigId,
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
      <form className="flex w-[min(32rem,92vw)] flex-col gap-5 p-6" onSubmit={handleSubmit}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Settings</p>
            <h2 className="mt-1 text-lg font-semibold">
              {editing ? 'Edit user' : 'New user'}
            </h2>
          </div>
          <Button aria-label="Close" onClick={onClose} size="icon-sm" type="button" variant="ghost">
            <X />
          </Button>
        </div>

        <Field label="Email" htmlFor="user-email" required>
          <input
            autoFocus
            className={inputClasses}
            id="user-email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="user@example.com"
            required
            type="email"
            value={email}
          />
        </Field>

        <Field
          label="Password"
          htmlFor="user-password"
          required={!editing}
          hint={editing ? 'Leave empty to keep current password' : 'Min 8 chars, uppercase, lowercase, number, special char'}
        >
          <input
            className={inputClasses}
            id="user-password"
            minLength={editing ? undefined : 8}
            maxLength={72}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={editing ? '••••••••' : 'Enter password'}
            required={!editing}
            type="password"
            value={password}
          />
        </Field>

        <Field label="Role" htmlFor="user-role" required>
          {rolesQuery.isLoading ? (
            <p className="text-xs text-slate-500">Loading roles…</p>
          ) : (
            <select
              className={inputClasses}
              id="user-role"
              onChange={(event) => setRoleConfigId(event.target.value)}
              required
              value={roleConfigId}
            >
              <option value="" disabled>Select a role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          )}
        </Field>

        {error ? (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {extractErrorMessage(error, 'Unable to save user')}
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
            ) : editing ? 'Save changes' : 'Create user'}
          </Button>
        </div>
      </form>
    </dialog>
  )
}

type FieldProps = {
  label: string
  htmlFor: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}

function Field({ label, htmlFor, hint, required, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs uppercase tracking-[0.2em] text-slate-400" htmlFor={htmlFor}>
        {label}
        {required ? <span className="ml-1 text-sky-300">*</span> : null}
      </label>
      {children}
      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
    </div>
  )
}
