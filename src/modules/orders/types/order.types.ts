export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered'

export type OrderItemSnapshot = {
  productId: string
  name: string
  slug: string
  sku: string
  price: number
  quantity: number
  lineTotal?: number
}

export type OrderCustomer = {
  id: string
  email: string
  role: 'admin' | 'staff' | 'customer'
}

export type Order = {
  id: string
  orderNumber: string
  customerId: string
  customer?: OrderCustomer
  couponId: string | null
  items: OrderItemSnapshot[]
  subtotalAmount: number
  discountAmount: number
  totalAmount: number
  status: OrderStatus
  createdAt: string
  updatedAt: string
}

export type Pagination = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type OrdersListResponse = {
  orders: Order[]
  pagination: Pagination
}

export type OrderSortField = 'createdAt' | 'updatedAt' | 'status' | 'totalAmount'
export type SortOrder = 'asc' | 'desc'

export type OrdersListParams = {
  page?: number
  limit?: number
  status?: OrderStatus
  customerId?: string
  sortBy?: OrderSortField
  sortOrder?: SortOrder
}

export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['paid'],
  paid: ['shipped'],
  shipped: ['delivered'],
  delivered: [],
}
