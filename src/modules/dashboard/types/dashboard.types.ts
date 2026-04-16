export type DashboardMetrics = {
  totalProducts: number
  activeProducts: number
  totalOrders: number
  pendingOrders: number
  totalCustomers: number
  revenueTotal: number
  revenue30d: number
  lowStockCount: number
}

export type DashboardOrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered'

export type DashboardRecentOrder = {
  id: string
  orderNumber: string
  customerEmail: string | null
  totalAmount: number
  status: DashboardOrderStatus
  itemCount: number
  createdAt: string
}

export type DashboardLowStock = {
  variantId: string
  productId: string
  productName: string
  productSlug: string
  sku: string
  stock: number
  sizeName: string
  sizeShortName: string
}

export type DashboardSummary = {
  metrics: DashboardMetrics
  recentOrders: DashboardRecentOrder[]
  lowStock: DashboardLowStock[]
}
