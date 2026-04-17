import { useState } from 'react'
import {
  ArrowLeft,
  BarChart3,
  LayoutGrid,
  Lock,
  Package,
  Pencil,
  Plus,
  Receipt,
  Ruler,
  Settings,
  ShieldCheck,
  Tag,
  Trash2,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { extractErrorMessage } from '@/api/client'
import { usePageTitle } from '@/hooks/use-page-title'
import { RoleFormDialog } from '@/modules/roles/components/role-form-dialog'
import {
  useDeleteRoleConfig,
  useRoleConfigs,
} from '@/modules/roles/hooks/use-role-configs'
import type { RoleConfig, RolePermissions } from '@/modules/roles/types/role-config.types'
import { permissionLabels } from '@/modules/roles/types/role-config.types'
import { routePaths } from '@/routes/paths'
import { PageHeader } from '@/shared/page-header'
import { PanelCard } from '@/shared/panel-card'
import { Button } from '@/ui/button'

const permissionIcons: Record<keyof RolePermissions, typeof Package> = {
  dashboard: BarChart3,
  products: Package,
  orders: Receipt,
  units: Ruler,
  coupons: Tag,
  layout: LayoutGrid,
  settings: Settings,
}

export default function RolesPage() {
  usePageTitle('Roles & Permissions')

  const [editing, setEditing] = useState<RoleConfig | null | undefined>(undefined)
  const dialogOpen = editing !== undefined

  const query = useRoleConfigs()
  const deleteMutation = useDeleteRoleConfig()

  const roles = query.data?.roles ?? []

  const openCreate = () => setEditing(null)
  const openEdit = (role: RoleConfig) => setEditing(role)
  const closeDialog = () => setEditing(undefined)

  const handleDelete = (role: RoleConfig) => {
    if (!window.confirm(`Delete role "${role.name}"? This can't be undone.`)) return
    deleteMutation.mutate(role.id)
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
        title="Roles & Permissions"
        description="Create roles and control which pages each role can access."
        action={
          <Button onClick={openCreate}>
            <Plus />
            Create role
          </Button>
        }
      />

      <PanelCard
        title="All roles"
        description={query.data ? `${roles.length} total` : 'Loading…'}
      >
        {query.isLoading ? (
          <p className="text-sm text-slate-400">Loading roles…</p>
        ) : query.isError ? (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {extractErrorMessage(query.error, 'Failed to load roles')}
          </p>
        ) : roles.length === 0 ? (
          <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-8 text-center">
            <p className="text-sm text-slate-400">No roles yet.</p>
            <Button onClick={openCreate}>
              <Plus />
              Create your first role
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {roles.map((role) => (
              <RoleCard
                key={role.id}
                role={role}
                onEdit={() => openEdit(role)}
                onDelete={() => handleDelete(role)}
              />
            ))}
          </div>
        )}
      </PanelCard>

      <RoleFormDialog
        editing={editing ?? null}
        onClose={closeDialog}
        open={dialogOpen}
      />
    </div>
  )
}

type RoleCardProps = {
  role: RoleConfig
  onEdit: () => void
  onDelete: () => void
}

function RoleCard({ role, onEdit, onDelete }: RoleCardProps) {
  const enabledPermissions = (Object.keys(permissionLabels) as (keyof RolePermissions)[]).filter(
    (key) => role.permissions[key],
  )

  return (
    <article className="rounded-2xl border border-white/10 bg-slate-950/55 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-800">
            <ShieldCheck className="size-5 text-sky-300" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold capitalize text-white">{role.name}</h3>
              {role.isSystem ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-300">
                  <Lock className="size-2.5" />
                  System
                </span>
              ) : null}
            </div>
            {role.description ? (
              <p className="mt-0.5 text-sm text-slate-400">{role.description}</p>
            ) : null}
          </div>
        </div>

        {!role.isSystem ? (
          <div className="flex items-center gap-1">
            <Button aria-label="Edit role" onClick={onEdit} size="icon-sm" variant="ghost">
              <Pencil />
            </Button>
            <Button aria-label="Delete role" onClick={onDelete} size="icon-sm" variant="destructive">
              <Trash2 />
            </Button>
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {enabledPermissions.length === 0 ? (
          <p className="text-xs text-slate-500">No page access configured</p>
        ) : (
          enabledPermissions.map((key) => {
            const Icon = permissionIcons[key]
            return (
              <span
                key={key}
                className="inline-flex items-center gap-1.5 rounded-lg bg-sky-400/10 px-2.5 py-1.5 text-xs font-medium text-sky-300"
              >
                <Icon className="size-3.5" strokeWidth={1.5} />
                {permissionLabels[key]}
              </span>
            )
          })
        )}
      </div>
    </article>
  )
}
