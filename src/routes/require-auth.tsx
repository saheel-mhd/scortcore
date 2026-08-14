import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { AppLoader } from '@/components/app-loader'
import { resolvePermissions } from '@/modules/auth/permissions'
import { routePaths } from '@/routes/paths'
import { useAuthStore } from '@/store/auth-store'
import type { PermissionModule } from '@/types/auth'

type Props = {
  children: ReactNode
  permission?: PermissionModule
}

export function RequireAuth({ children, permission }: Props) {
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const status = useAuthStore((state) => state.status)
  const user = useAuthStore((state) => state.user)
  const location = useLocation()

  if (!hasHydrated) {
    return <AppLoader />
  }

  if (status !== 'authenticated' || !user) {
    return <Navigate replace state={{ from: location.pathname }} to={routePaths.login} />
  }

  const permissions = resolvePermissions(user.role, user.permissions)

  if (!Object.values(permissions).some(Boolean)) {
    return <Navigate replace to={routePaths.login} />
  }

  if (permission && !permissions[permission]) {
    return <Navigate replace to={findLandingPath(permissions)} />
  }

  return <>{children}</>
}

function findLandingPath(permissions: Record<PermissionModule, boolean>): string {
  if (permissions.dashboard) return routePaths.dashboard
  if (permissions.products) return routePaths.products
  if (permissions.orders) return routePaths.orders
  if (permissions.units) return routePaths.units
  if (permissions.coupons) return routePaths.coupons
  if (permissions.layout) return routePaths.layout
  if (permissions.settings) return routePaths.settings
  return routePaths.login
}
