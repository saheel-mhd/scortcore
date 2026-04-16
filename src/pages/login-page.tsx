import { useEffect } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { LoginForm } from '@/modules/auth/components/login-form'
import { routePaths } from '@/routes/paths'
import { useAuthStore } from '@/store/auth-store'

type LocationState = { from?: string } | null

export default function LoginPage() {
  const status = useAuthStore((state) => state.status)
  const role = useAuthStore((state) => state.user?.role)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const location = useLocation()
  const navigate = useNavigate()

  const redirectTo = (location.state as LocationState)?.from ?? routePaths.dashboard

  useEffect(() => {
    document.title = 'Sign in · ScortCore Admin'
  }, [])

  if (hasHydrated && status === 'authenticated' && (role === 'admin' || role === 'staff')) {
    return <Navigate replace to={redirectTo} />
  }

  const handleSuccess = () => {
    navigate(redirectTo, { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/80 p-8 backdrop-blur">
        <div className="mb-8 flex flex-col gap-2 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-sky-300">CRM Panel</p>
          <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
          <p className="text-sm text-slate-400">
            Sign in with your admin or staff account to continue.
          </p>
        </div>
        <LoginForm onSuccess={handleSuccess} />
      </div>
    </div>
  )
}
