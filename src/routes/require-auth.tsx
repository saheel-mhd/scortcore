import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { AppLoader } from '@/components/app-loader'
import { routePaths } from '@/routes/paths'
import { useAuthStore } from '@/store/auth-store'
import type { UserRole } from '@/types/auth'

type Props = {
  children: ReactNode
  allowedRoles?: UserRole[]
}

const defaultAllowedRoles: UserRole[] = ['admin', 'staff']

export function RequireAuth({ children, allowedRoles = defaultAllowedRoles }: Props) {
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

  if (!allowedRoles.includes(user.role)) {
    return <Navigate replace to={routePaths.login} />
  }

  return <>{children}</>
}
