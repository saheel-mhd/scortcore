export type Pagination = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type InventoryProductSummary = {
  id: string
  name: string
  slug: string
  sku: string
  isActive: boolean
}

export type InventoryUnitSummary = {
  id: string
  name: string
  shortName: string
  category: {
    id: string
    name: string
    shortName: string
  }
}

export type InventoryVariant = {
  id: string
  stock: number
  createdAt: string
  updatedAt: string
  product: InventoryProductSummary
  unit: InventoryUnitSummary
  isLowStock?: boolean
  threshold?: number
}

export type InventoryMovementType = 'set' | 'increase' | 'decrease' | 'order' | 'purchase_order'

export type InventoryMovement = {
  id: string
  productVariantId: string
  productVariant: {
    id: string
    stock: number
    product: { id: string; name: string; sku: string; slug: string }
    unit: { id: string; name: string; shortName: string }
  }
  type: InventoryMovementType
  quantityChange: number
  previousStock: number
  nextStock: number
  reason: string | null
  referenceType: string | null
  referenceId: string | null
  createdAt: string
}

export type InventoryListResponse = {
  items: InventoryVariant[]
  pagination: Pagination
}

export type InventoryMovementsResponse = {
  items: InventoryMovement[]
  pagination: Pagination
}

export type InventorySortField = 'stock' | 'createdAt' | 'updatedAt'
export type SortOrder = 'asc' | 'desc'

export type InventoryListParams = {
  page?: number
  limit?: number
  search?: string
  threshold?: number
  sortBy?: InventorySortField
  sortOrder?: SortOrder
}

export type InventoryMovementsParams = {
  page?: number
  limit?: number
  sortOrder?: SortOrder
}

export type StockOperation = 'set' | 'increase' | 'decrease'

export type AdjustStockInput = {
  operation: StockOperation
  quantity: number
  reason?: string
}
