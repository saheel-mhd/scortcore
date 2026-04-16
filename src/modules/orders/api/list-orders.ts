import { queryOptions } from '@tanstack/react-query'

import { apiClient, type ApiEnvelope } from '@/api/client'
import { ordersKeys } from '@/modules/orders/api/orders.keys'
import type { OrdersListParams, OrdersListResponse } from '@/modules/orders/types/order.types'

export function ordersListQueryOptions(params: OrdersListParams) {
  return queryOptions({
    queryKey: ordersKeys.list(params),
    queryFn: async (): Promise<OrdersListResponse> => {
      const response = await apiClient.get<ApiEnvelope<OrdersListResponse>>('/orders', {
        params,
      })
      return response.data.data
    },
  })
}
