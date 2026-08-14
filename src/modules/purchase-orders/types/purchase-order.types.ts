export type Pagination = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type PurchaseOrderStatus = | 'pending' | 'ordered' | 'partially_received' | 'received' | 'cancelled'

export type PurchaseOrderVariant = {
  id: string
  stock: number
  product: { id: string; name: string; slug: string; sku: string }
  unit: { id: string; name: string; shortName: string }
}

export type PurchaseOrder = {
  id: string
  purchaseNumber: string
  supplierName: string
  supplierEmail: string | null
  supplierPhone: string | null
  productVariantId: string
  productVariant: PurchaseOrderVariant
  quantity: number
  receivedQuantity: number
  unitCost: number
  totalCost: number
  status: PurchaseOrderStatus
  notes: string | null
  orderedAt: string
  receivedAt: string | null
  createdAt: string
  updatedAt: string
}

export type PurchaseOrdersListResponse = {
  purchaseOrders: PurchaseOrder[]
  pagination: Pagination
}

export type PurchaseOrderSortField = | 'orderedAt' | 'createdAt' | 'updatedAt' | 'status' | 'supplierName'
export type SortOrder = 'asc' | 'desc'

export type PurchaseOrderListParams = {
  page?: number
  limit?: number
  search?: string
  status?: PurchaseOrderStatus
  productVariantId?: string
  sortBy?: PurchaseOrderSortField
  sortOrder?: SortOrder
}

export type CreatePurchaseOrderInput = {
  supplierName: string
  supplierEmail?: string
  supplierPhone?: string
  productVariantId: string
  quantity: number
  unitCost: number
  notes?: string
}

export type ReceivePurchaseOrderInput = {
  receivedQuantity: number
  reason?: string
}
