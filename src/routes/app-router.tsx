import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { AppLoader } from '@/components/app-loader'
import { DashboardLayout } from '@/layouts/dashboard-layout'
import { RequireAuth } from '@/routes/require-auth'
import { routePaths } from '@/routes/paths'

const DashboardPage = lazy(() => import('@/pages/dashboard-page'))
const LoginPage = lazy(() => import('@/pages/login-page'))
const NotFoundPage = lazy(() => import('@/pages/not-found-page'))
const SettingsPage = lazy(() => import('@/pages/settings-page'))
const UsersPage = lazy(() => import('@/pages/users-page'))
const RolesPage = lazy(() => import('@/pages/roles-page'))
const ProductsListPage = lazy(() => import('@/pages/products-list-page'))
const ProductsCreatePage = lazy(() => import('@/pages/products-create-page'))
const ProductsEditPage = lazy(() => import('@/pages/products-edit-page'))
const OrdersListPage = lazy(() => import('@/pages/orders-list-page'))
const OrderDetailPage = lazy(() => import('@/pages/order-detail-page'))
const UnitsPage = lazy(() => import('@/pages/units-page'))
const CouponsPage = lazy(() => import('@/pages/coupons-page'))
const LayoutHubPage = lazy(() => import('@/pages/layout-hub-page'))
const LayoutPage = lazy(() => import('@/pages/layout-page'))
const ShopLayoutPage = lazy(() => import('@/pages/shop-layout-page'))

export function AppRouter() {
  return (
    <Suspense fallback={<AppLoader />}>
      <Routes>
        <Route path={routePaths.login} element={<LoginPage />} />

        <Route
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate replace to={routePaths.dashboard} />} />
          <Route path={routePaths.dashboard} element={<DashboardPage />} />
          <Route path={routePaths.products} element={<ProductsListPage />} />
          <Route path={routePaths.productsNew} element={<ProductsCreatePage />} />
          <Route path={routePaths.productsEdit} element={<ProductsEditPage />} />
          <Route path={routePaths.orders} element={<OrdersListPage />} />
          <Route path={routePaths.ordersDetail} element={<OrderDetailPage />} />
          <Route path={routePaths.units} element={<UnitsPage />} />
          <Route path={routePaths.coupons} element={<CouponsPage />} />
          <Route path={routePaths.layout} element={<LayoutHubPage />} />
          <Route path={routePaths.layoutHome} element={<LayoutPage />} />
          <Route path={routePaths.layoutShop} element={<ShopLayoutPage />} />
          <Route path={routePaths.settings} element={<SettingsPage />} />
          <Route path={routePaths.users} element={<UsersPage />} />
          <Route path={routePaths.roles} element={<RolesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
