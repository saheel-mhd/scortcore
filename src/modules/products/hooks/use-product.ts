import { useQuery } from '@tanstack/react-query'

import { productQueryOptions } from '@/modules/products/api/get-product'

export function useProduct(id: string) {
  return useQuery(productQueryOptions(id))
}
