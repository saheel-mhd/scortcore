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
const InventoryPage = lazy(() => import('@/pages/inventory-page'))
const PurchaseOrdersPage = lazy(() => import('@/pages/purchase-orders-page'))
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
          <Route
            path={routePaths.dashboard}
            element={
              <RequireAuth permission="dashboard">
                <DashboardPage />
              </RequireAuth>
            }
          />
          <Route
            path={routePaths.products}
            element={
              <RequireAuth permission="products">
                <ProductsListPage />
              </RequireAuth>
            }
          />
          <Route
            path={routePaths.productsNew}
            element={
              <RequireAuth permission="products">
                <ProductsCreatePage />
              </RequireAuth>
            }
          />
          <Route
            path={routePaths.productsEdit}
            element={
              <RequireAuth permission="products">
                <ProductsEditPage />
              </RequireAuth>
            }
          />
          <Route
            path={routePaths.orders}
            element={
              <RequireAuth permission="orders">
                <OrdersListPage />
              </RequireAuth>
            }
          />
          <Route
            path={routePaths.ordersDetail}
            element={
              <RequireAuth permission="orders">
                <OrderDetailPage />
              </RequireAuth>
            }
          />
          <Route
            path={routePaths.inventory}
            element={
              <RequireAuth permission="products">
                <InventoryPage />
              </RequireAuth>
            }
          />
          <Route
            path={routePaths.purchaseOrders}
            element={
              <RequireAuth permission="products">
                <PurchaseOrdersPage />
              </RequireAuth>
            }
          />
          <Route
            path={routePaths.units}
            element={
              <RequireAuth permission="units">
                <UnitsPage />
              </RequireAuth>
            }
          />
          <Route
            path={routePaths.coupons}
            element={
              <RequireAuth permission="coupons">
                <CouponsPage />
              </RequireAuth>
            }
          />
          <Route
            path={routePaths.layout}
            element={
              <RequireAuth permission="layout">
                <LayoutHubPage />
              </RequireAuth>
            }
          />
          <Route
            path={routePaths.layoutHome}
            element={
              <RequireAuth permission="layout">
                <LayoutPage />
              </RequireAuth>
            }
          />
          <Route
            path={routePaths.layoutShop}
            element={
              <RequireAuth permission="layout">
                <ShopLayoutPage />
              </RequireAuth>
            }
          />
          <Route
            path={routePaths.settings}
            element={
              <RequireAuth permission="settings">
                <SettingsPage />
              </RequireAuth>
            }
          />
          <Route
            path={routePaths.users}
            element={
              <RequireAuth permission="settings">
                <UsersPage />
              </RequireAuth>
            }
          />
          <Route
            path={routePaths.roles}
            element={
              <RequireAuth permission="settings">
                <RolesPage />
              </RequireAuth>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
