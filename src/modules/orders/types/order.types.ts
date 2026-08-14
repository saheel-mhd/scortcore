export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'

export type OrderItemSnapshot = {
  productVariantId?: string
  productId: string
  name: string
  slug: string
  sku: string
  unitId?: string
  unitName?: string
  unitShortName?: string
  unitCategoryId?: string
  unitCategoryName?: string
  unitPrice?: number
  price?: number
  quantity: number
  lineTotal?: number
}

export type OrderCustomer = {
  id: string
  email: string
  role: 'admin' | 'staff' | 'customer'
}

export type ShippingAddressSnapshot = {
  addressId: string
  label: string | null
  fullName: string
  phone: string | null
  line1: string
  line2: string | null
  city: string
  state: string | null
  postalCode: string
  country: string
}

export type Order = {
  id: string
  orderNumber: string
  customerId: string
  customer?: OrderCustomer
  couponId: string | null
  addressId: string | null
  shippingAddress: ShippingAddressSnapshot | null
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
  cancelled: [],
}
