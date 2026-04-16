export type Product = {
  id: string
  name: string
  slug: string
  sku: string
  description: string | null
  price: number
  stock: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type Pagination = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type ProductListResponse = {
  products: Product[]
  pagination: Pagination
}

export type ProductSortField = 'name' | 'price' | 'stock' | 'createdAt' | 'updatedAt'
export type SortOrder = 'asc' | 'desc'

export type ProductListParams = {
  page?: number
  limit?: number
  search?: string
  isActive?: boolean
  minPrice?: number
  maxPrice?: number
  sortBy?: ProductSortField
  sortOrder?: SortOrder
}

export type CreateProductInput = {
  name: string
  slug?: string
  sku: string
  description?: string
  price: number
  stock?: number
  isActive?: boolean
}

export type UpdateProductInput = Partial<CreateProductInput>

export type StockOperation = 'set' | 'increase' | 'decrease'

export type UpdateProductStockInput = {
  operation: StockOperation
  quantity: number
}
