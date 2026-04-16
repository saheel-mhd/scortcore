import { useQuery } from '@tanstack/react-query'

import { orderQueryOptions } from '@/modules/orders/api/get-order'

export function useOrder(id: string) {
  return useQuery(orderQueryOptions(id))
}
