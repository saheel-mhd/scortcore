import { Boxes, LayoutDashboard, LayoutGrid, LogOut, Menu, Package, Receipt, Ruler, Settings, ShieldCheck, Tag, Truck, X, type LucideIcon } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Button } from '@/ui/button'
import { resolvePermissions } from '@/modules/auth/permissions'
import { routePaths } from '@/routes/paths'
import { useAuthStore } from '@/store/auth-store'
import { useUiStore } from '@/store/ui-store'
import type { PermissionModule } from '@/types/auth'

// `permission` mirrors the gate on the matching route and API endpoint, so a
// link only appears when the request behind it will actually succeed.
const navigationItems: {
  href: string
  icon: LucideIcon
  label: string
  permission: PermissionModule
}[] = [
  { href: routePaths.dashboard, icon: LayoutDashboard, label: 'Dashboard', permission: 'dashboard' },
  { href: routePaths.products, icon: Package, label: 'Products', permission: 'products' },
  { href: routePaths.orders, icon: Receipt, label: 'Orders', permission: 'orders' },
  { href: routePaths.inventory, icon: Boxes, label: 'Inventory', permission: 'products' },
  { href: routePaths.purchaseOrders, icon: Truck, label: 'Purchase orders', permission: 'products' },
  { href: routePaths.units, icon: Ruler, label: 'Units', permission: 'units' },
  { href: routePaths.coupons, icon: Tag, label: 'Coupons', permission: 'coupons' },
  { href: routePaths.layout, icon: LayoutGrid, label: 'Layout', permission: 'layout' },
  { href: routePaths.settings, icon: Settings, label: 'Settings', permission: 'settings' },
]

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

  const permissions = user ? resolvePermissions(user.role, user.permissions) : null
  const visibleNavigationItems = permissions
    ? navigationItems.filter((item) => permissions[item.permission])
    : []

  return (
    <div className="mx-auto flex min-h-screen w-full gap-6 px-4 py-4 sm:px-6 lg:px-8">
      {isSidebarOpen ? (
        <button
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-30 bg-slate-950/70 lg:hidden"
          onClick={closeSidebar}
        />
      ) : null}

      <aside
        className={[
          'scrollbar-hidden fixed inset-y-4 left-4 z-40 w-72 rounded-[1.75rem] border border-white/10 bg-slate-950/85 p-5 backdrop-blur transition lg:sticky lg:top-4 lg:inset-auto lg:left-auto lg:h-[calc(100vh-2rem)] lg:translate-x-0 lg:overflow-y-auto',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-[120%]',
        ].join(' ')}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="mt-2 text-2xl font-semibold text-white">ScortCore</h1>
          </div>
          <Button className="lg:hidden" size="icon-sm" variant="ghost" onClick={closeSidebar}>
            <X />
          </Button>
        </div>

        <nav className="mt-8 space-y-2">
          {visibleNavigationItems.map((item) => {
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
        <header className="flex items-center gap-3 py-2 lg:hidden">
          <Button
            aria-expanded={isSidebarOpen}
            aria-label="Open navigation"
            onClick={toggleSidebar}
            size="icon-sm"
            variant="outline"
          >
            <Menu />
          </Button>
          <span className="text-sm font-semibold text-white">ScortCore</span>
        </header>

        <main className="min-w-0 flex-1 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
