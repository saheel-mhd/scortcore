export type RolePermissions = {
  dashboard: boolean
  products: boolean
  orders: boolean
  units: boolean
  coupons: boolean
  layout: boolean
  settings: boolean
}

export type RoleConfig = {
  id: string
  name: string
  description: string | null
  permissions: RolePermissions
  isSystem: boolean
  createdAt: string
  updatedAt: string
}

export type RoleConfigListResponse = {
  roles: RoleConfig[]
}

export type CreateRoleConfigInput = {
  name: string
  description?: string
  permissions: RolePermissions
}

export type UpdateRoleConfigInput = {
  name?: string
  description?: string | null
  permissions?: RolePermissions
}

export const permissionLabels: Record<keyof RolePermissions, string> = {
  dashboard: 'Dashboard',
  products: 'Products',
  orders: 'Orders',
  units: 'Units',
  coupons: 'Coupons',
  layout: 'Layout',
  settings: 'Settings',
}

export const defaultPermissions: RolePermissions = {
  dashboard: false,
  products: false,
  orders: false,
  units: false,
  coupons: false,
  layout: false,
  settings: false,
}
