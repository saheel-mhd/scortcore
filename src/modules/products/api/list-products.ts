import { queryOptions } from '@tanstack/react-query'

import { apiClient, type ApiEnvelope } from '@/api/client'
import type { ProductListParams, ProductListResponse } from '@/modules/products/types/product.types'

export const productsKeys = {
  all: ['products'] as const,
  list: (params: ProductListParams) => ['products', 'list', params] as const,
  detail: (id: string) => ['products', 'detail', id] as const,
  movements: (id: string) => ['products', 'movements', id] as const,
}

export function productsListQueryOptions(params: ProductListParams) {
  return queryOptions({
    queryKey: productsKeys.list(params),
    queryFn: async (): Promise<ProductListResponse> => {
      const response = await apiClient.get<ApiEnvelope<ProductListResponse>>('/products', {
        params,
      })
      return response.data.data
    },
  })
}
