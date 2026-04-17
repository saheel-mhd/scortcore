export type ShopRowType = 'featured' | 'grid' | 'carousel' | 'banner'

export type ShopRowBannerConfig = {
  backgroundImage?: string
  backgroundColor?: string
  textColor?: string
  height?: number
  contentAlign?: 'left' | 'center' | 'right'
  ctaLabel?: string
  ctaHref?: string
}

export type ShopSectionProduct = {
  id: string
  name: string
  slug: string
  sku: string
  price: number
  isActive: boolean
  cardImage: string | null
  mainImage: string | null
}

export type ShopSection = {
  id: string
  title: string
  description: string | null
  type: ShopRowType
  columns: number
  productIds: string[]
  bannerConfig: ShopRowBannerConfig | null
  isActive: boolean
  displayOrder: number
  createdAt: string
  updatedAt: string
  products: ShopSectionProduct[]
}

export type ShopSectionListResponse = {
  items: ShopSection[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type ShopSectionListParams = {
  page?: number
  limit?: number
  sortBy?: 'displayOrder' | 'createdAt' | 'updatedAt' | 'title'
  sortOrder?: 'asc' | 'desc'
  isActive?: boolean
  type?: ShopRowType
}

export type CreateShopSectionInput = {
  title: string
  description?: string
  type: ShopRowType
  columns?: number
  productIds?: string[]
  bannerConfig?: ShopRowBannerConfig
  isActive?: boolean
  displayOrder?: number
}

export type UpdateShopSectionInput = Partial<CreateShopSectionInput>
