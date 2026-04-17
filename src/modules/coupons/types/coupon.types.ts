export type CouponType = 'percentage' | 'fixed'

export type Coupon = {
  id: string
  code: string
  description: string | null
  type: CouponType
  value: number
  minOrderAmount: number | null
  maxDiscountAmount: number | null
  isActive: boolean
  expiresAt: string | null
  usageLimit: number | null
  usedCount: number
  createdAt: string
  updatedAt: string
}

export type CouponListResponse = {
  items: Coupon[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type CouponListParams = {
  page?: number
  limit?: number
  sortBy?: 'createdAt' | 'updatedAt' | 'code' | 'value' | 'usedCount'
  sortOrder?: 'asc' | 'desc'
  isActive?: boolean
  type?: CouponType
  search?: string
}

export type CreateCouponInput = {
  code: string
  description?: string
  type: CouponType
  value: number
  minOrderAmount?: number
  maxDiscountAmount?: number
  isActive?: boolean
  expiresAt?: string
  usageLimit?: number
}

export type UpdateCouponInput = Partial<Omit<CreateCouponInput, 'code'>>
