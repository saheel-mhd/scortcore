import type { Unit } from '@/modules/units/types/unit.types'

export type ProductVariant = {
  id: string
  unitId: string
  stock: number
  createdAt: string
  updatedAt: string
  unit: Pick<Unit, 'id' | 'name' | 'shortName'> & {
    category: {
      id: string
      name: string
      shortName: string
    }
  }
}

export type Product = {
  id: string
  name: string
  slug: string
  sku: string
  description: string | null
  price: number
  isActive: boolean
  cardImage: string | null
  mainImage: string | null
  galleryImages: string[]
  variants: ProductVariant[]
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

export type ProductSortField = 'name' | 'price' | 'createdAt' | 'updatedAt'
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

export type VariantInput = {
  id?: string
  unitId: string
  stock: number
}

export type CreateProductInput = {
  name: string
  slug?: string
  sku: string
  description?: string
  price: number
  isActive?: boolean
  cardImage: string
  mainImage: string
  galleryImages?: string[]
  variants: VariantInput[]
}

export type UpdateProductInput = {
  name?: string
  slug?: string
  sku?: string
  description?: string
  price?: number
  isActive?: boolean
  cardImage?: string
  mainImage?: string
  galleryImages?: string[]
  variants?: VariantInput[]
}
