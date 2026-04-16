export type UnitCategory = {
  id: string
  name: string
  shortName: string
  description: string | null
  createdAt: string
  updatedAt: string
}

export type UnitCategorySummary = {
  id: string
  name: string
  shortName: string
}

export type Unit = {
  id: string
  name: string
  shortName: string
  description: string | null
  categoryId: string
  category: UnitCategorySummary
  createdAt: string
  updatedAt: string
}

export type Pagination = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type UnitCategoryListResponse = {
  items: UnitCategory[]
  pagination: Pagination
}

export type UnitListResponse = {
  items: Unit[]
  pagination: Pagination
}

export type UnitCategoryListParams = {
  page?: number
  limit?: number
  search?: string
  sortBy?: 'name' | 'shortName' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
}

export type UnitListParams = {
  page?: number
  limit?: number
  search?: string
  categoryId?: string
  sortBy?: 'name' | 'shortName' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
}

export type CreateUnitCategoryInput = {
  name: string
  shortName: string
  description?: string
}

export type UpdateUnitCategoryInput = Partial<CreateUnitCategoryInput>

export type CreateUnitInput = {
  name: string
  shortName: string
  description?: string
  categoryId: string
}

export type UpdateUnitInput = Partial<CreateUnitInput>
