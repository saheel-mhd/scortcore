import { useQuery } from '@tanstack/react-query'

import { productsListQueryOptions } from '@/modules/products/api/list-products'
import type { ProductListParams } from '@/modules/products/types/product.types'

export function useProducts(params: ProductListParams) {
  return useQuery(productsListQueryOptions(params))
}
