import { PERMISSION_MODULES, type PermissionModule, type RolePermissions, type UserRole, } from '@/types/auth'

const buildMap = (value: boolean): RolePermissions =>
  PERMISSION_MODULES.reduce((map, module) => {
    map[module] = value
    return map
  }, {} as RolePermissions)

const defaultsByRole: Record<UserRole, RolePermissions> = {
  admin: buildMap(true),
  staff: {
    dashboard: true,
    products: true,
    orders: true,
    units: true,
    coupons: true,
    layout: true,
    settings: false,
  },
  customer: buildMap(false),
}

export function resolvePermissions(
  role: UserRole,
  permissions?: RolePermissions,
): RolePermissions {
  if (role === 'admin') return defaultsByRole.admin
  if (permissions) return { ...defaultsByRole[role], ...permissions }
  return defaultsByRole[role]
}

export type { PermissionModule, RolePermissions }
