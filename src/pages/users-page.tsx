import { useState } from 'react'
import { ArrowLeft, Pencil, Plus, ShieldCheck, Trash2, User as UserIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

import { extractErrorMessage } from '@/api/client'
import { usePageTitle } from '@/hooks/use-page-title'
import { useRoleConfigs } from '@/modules/roles/hooks/use-role-configs'
import { UserFormDialog } from '@/modules/users/components/user-form-dialog'
import { useDeleteUser, useUsers } from '@/modules/users/hooks/use-users'
import type { User } from '@/modules/users/types/user.types'
import { routePaths } from '@/routes/paths'
import { PageHeader } from '@/shared/page-header'
import { PanelCard } from '@/shared/panel-card'
import { Button } from '@/ui/button'
import { useAuthStore } from '@/store/auth-store'

const roleBadge: Record<string, { bg: string; text: string }> = {
  admin: { bg: 'bg-amber-500/10', text: 'text-amber-300' },
  staff: { bg: 'bg-sky-500/10', text: 'text-sky-300' },
  customer: { bg: 'bg-slate-500/10', text: 'text-slate-300' },
}

export default function UsersPage() {
  usePageTitle('Users')

  const [editing, setEditing] = useState<User | null | undefined>(undefined)
  const dialogOpen = editing !== undefined

  const currentUser = useAuthStore((state) => state.user)

  const query = useUsers({
    page: 1,
    limit: 100,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })

  const rolesQuery = useRoleConfigs()
  const roleMap = new Map(
    (rolesQuery.data?.roles ?? []).map((r) => [r.id, r.name]),
  )

  const deleteMutation = useDeleteUser()
  const users = (query.data?.users ?? []).filter((u) => u.role !== 'customer')

  const openCreate = () => setEditing(null)
  const openEdit = (user: User) => setEditing(user)
  const closeDialog = () => setEditing(undefined)

  const handleDelete = (user: User) => {
    if (!window.confirm(`Delete user "${user.email}"? This can't be undone.`)) return
    deleteMutation.mutate(user.id)
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        to={routePaths.settings}
        className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
      >
        <ArrowLeft className="size-4" />
        Settings
      </Link>

      <PageHeader
        title="Users"
        description="Manage user accounts, roles, and access."
        action={
          <Button onClick={openCreate}>
            <Plus />
            New user
          </Button>
        }
      />

      <PanelCard
        title="All users"
        description={
          query.data ? `${query.data.pagination.total} total` : 'Loading…'
        }
      >
        {query.isLoading ? (
          <p className="text-sm text-slate-400">Loading users…</p>
        ) : query.isError ? (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {extractErrorMessage(query.error, 'Failed to load users')}
          </p>
        ) : users.length === 0 ? (
          <p className="text-sm text-slate-400">No users found.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {users.map((user) => {
              const roleName = user.roleConfigId ? roleMap.get(user.roleConfigId) ?? user.role : user.role
              const badge = roleBadge[user.role] ?? roleBadge.customer
              const isSelf = user.id === currentUser?.id

              return (
                <article
                  key={user.id}
                  className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-slate-950/55 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-800 text-slate-300">
                      {user.role === 'admin' ? (
                        <ShieldCheck className="size-4" />
                      ) : (
                        <UserIcon className="size-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium text-white">{user.email}</p>
                        {isSelf ? (
                          <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-[10px] font-medium text-sky-300">
                            You
                          </span>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${badge.bg} ${badge.text}`}>
                          {roleName}
                        </span>
                        <span className="text-xs text-slate-500">
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button aria-label="Edit user" onClick={() => openEdit(user)} size="icon-sm" variant="ghost">
                      <Pencil />
                    </Button>
                    <Button
                      aria-label="Delete user"
                      disabled={isSelf}
                      onClick={() => handleDelete(user)}
                      size="icon-sm"
                      variant="destructive"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </PanelCard>

      <UserFormDialog
        editing={editing ?? null}
        onClose={closeDialog}
        open={dialogOpen}
      />
    </div>
  )
}
