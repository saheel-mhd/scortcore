import { useQuery } from '@tanstack/react-query'

import { ordersListQueryOptions } from '@/modules/orders/api/list-orders'
import type { OrdersListParams } from '@/modules/orders/types/order.types'

export function useOrders(params: OrdersListParams) {
  return useQuery(ordersListQueryOptions(params))
}
