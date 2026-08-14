export type AuthStatus = 'anonymous' | 'authenticated'

export type UserRole = 'admin' | 'staff' | 'customer'

export const PERMISSION_MODULES = [
  'dashboard',
  'products',
  'orders',
  'units',
  'coupons',
  'layout',
  'settings',
] as const

export type PermissionModule = (typeof PERMISSION_MODULES)[number]

export type RolePermissions = Record<PermissionModule, boolean>

export type AuthUser = {
  id: string
  name?: string | null
  email: string
  role: UserRole
  permissions?: RolePermissions
}

export type AuthSession = {
  accessToken: string
  user: AuthUser
}
