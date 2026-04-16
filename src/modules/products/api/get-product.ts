import { queryOptions } from '@tanstack/react-query'

import { apiClient, type ApiEnvelope } from '@/api/client'
import { productsKeys } from '@/modules/products/api/list-products'
import type { Product } from '@/modules/products/types/product.types'

export function productQueryOptions(id: string) {
  return queryOptions({
    queryKey: productsKeys.detail(id),
    queryFn: async (): Promise<Product> => {
      const response = await apiClient.get<ApiEnvelope<Product>>(`/products/${id}`)
      return response.data.data
    },
    enabled: id.length > 0,
  })
}
