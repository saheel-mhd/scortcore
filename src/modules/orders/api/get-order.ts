import { queryOptions } from '@tanstack/react-query'

import { apiClient, type ApiEnvelope } from '@/api/client'
import { ordersKeys } from '@/modules/orders/api/orders.keys'
import type { Order } from '@/modules/orders/types/order.types'

export function orderQueryOptions(id: string) {
  return queryOptions({
    queryKey: ordersKeys.detail(id),
    queryFn: async (): Promise<Order> => {
      const response = await apiClient.get<ApiEnvelope<Order>>(`/orders/${id}`)
      return response.data.data
    },
    enabled: id.length > 0,
  })
}
