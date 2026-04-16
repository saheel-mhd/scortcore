import type { OrdersListParams } from '@/modules/orders/types/order.types'

export const ordersKeys = {
  all: ['orders'] as const,
  list: (params: OrdersListParams) => ['orders', 'list', params] as const,
  detail: (id: string) => ['orders', 'detail', id] as const,
}
