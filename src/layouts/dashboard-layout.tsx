import { BarChart3, LayoutDashboard, LogOut, Menu, Package, Receipt, ShieldCheck, X } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

import { Button } from '@/ui/button'
import { routePaths } from '@/routes/paths'
import { useAuthStore } from '@/store/auth-store'
import { useUiStore } from '@/store/ui-store'

const navigationItems = [
  {
    href: routePaths.dashboard,
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  {
    href: routePaths.products,
    icon: Package,
    label: 'Products',
  },
  {
    href: routePaths.orders,
    icon: Receipt,
    label: 'Orders',
  },
] as const

export function DashboardLayout() {
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen)
  const toggleSidebar = useUiStore((state) => state.toggleSidebar)
  const closeSidebar = useUiStore((state) => state.closeSidebar)
  const user = useAuthStore((state) => state.user)
  const signOut = useAuthStore((state) => state.signOut)
  const navigate = useNavigate()

  const handleSignOut = () => {
    signOut()
    navigate(routePaths.login, { replace: true })
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl gap-6 px-4 py-4 sm:px-6 lg:px-8">
      {isSidebarOpen ? (
        <button
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-30 bg-slate-950/70 lg:hidden"
          onClick={closeSidebar}
        />
      ) : null}

      <aside
        className={[
          'fixed inset-y-4 left-4 z-40 w-72 rounded-[1.75rem] border border-white/10 bg-slate-950/85 p-5 backdrop-blur transition lg:static lg:inset-auto lg:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-[120%]',
        ].join(' ')}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sky-300">
              CRM Panel
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-white">ScortCore</h1>
            <p className="mt-1 text-sm text-slate-400">
              Admin foundation for customers, deals, and reporting.
            </p>
          </div>
          <Button className="lg:hidden" size="icon-sm" variant="ghost" onClick={closeSidebar}>
            <X />
          </Button>
        </div>

        <nav className="mt-8 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition',
                    isActive
                      ? 'border-white/15 bg-white text-slate-950'
                      : 'border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white',
                  ].join(' ')
                }
                onClick={closeSidebar}
              >
                <Icon className="size-4" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-sky-400/15 text-sky-200">
              <ShieldCheck className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {user?.email ?? 'Unknown user'}
              </p>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                {user?.role ?? 'no role'}
              </p>
            </div>
          </div>
          <Button className="mt-4 w-full" variant="outline" onClick={handleSignOut}>
            <LogOut />
            Sign out
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-slate-950/60 px-4 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <Button className="lg:hidden" size="icon-sm" variant="outline" onClick={toggleSidebar}>
              <Menu />
            </Button>
            <div>
              <p className="text-sm font-medium text-white">Admin Dashboard</p>
              <p className="text-xs text-slate-400">
                Monitor CRM activity and system health.
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 sm:flex">
            <BarChart3 className="size-4 text-sky-300" />
            Live foundation build
          </div>
        </header>

        <main className="min-w-0 flex-1 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
