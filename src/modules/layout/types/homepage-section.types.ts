export type SectionType = 'product' | 'banner'
export type BannerAlignment = 'left' | 'center' | 'right'

export type BannerConfig = {
  image?: string
  imagePosition?: BannerAlignment
  backgroundImage?: string
  backgroundColor?: string
  textColor?: string
  height?: number
  contentAlign?: BannerAlignment
  ctaLabel?: string
  ctaHref?: string
}

export type SectionProductVariantSummary = {
  id: string
  stock: number
  unit: {
    id: string
    name: string
    shortName: string
  }
}

export type SectionProduct = {
  id: string
  name: string
  slug: string
  sku: string
  price: number
  isActive: boolean
  cardImage: string | null
  mainImage: string | null
  variants: SectionProductVariantSummary[]
}

export type HomepageSection = {
  id: string
  title: string
  description: string | null
  type: SectionType
  productIds: string[]
  bannerConfig: BannerConfig | null
  isActive: boolean
  displayOrder: number
  createdAt: string
  updatedAt: string
  products: SectionProduct[]
}

export type Pagination = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type HomepageSectionListResponse = {
  items: HomepageSection[]
  pagination: Pagination
}

export type HomepageSectionListParams = {
  page?: number
  limit?: number
  sortBy?: 'displayOrder' | 'createdAt' | 'updatedAt' | 'title'
  sortOrder?: 'asc' | 'desc'
  isActive?: boolean
  type?: SectionType
}

export type CreateHomepageSectionInput = {
  title: string
  description?: string
  type: SectionType
  productIds?: string[]
  bannerConfig?: BannerConfig
  isActive?: boolean
  displayOrder?: number
}

export type UpdateHomepageSectionInput = Partial<CreateHomepageSectionInput>
