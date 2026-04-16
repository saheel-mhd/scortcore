import { apiClient, type ApiEnvelope } from '@/api/client'
import type { Order, OrderStatus } from '@/modules/orders/types/order.types'

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  const response = await apiClient.put<ApiEnvelope<Order>>(`/orders/${id}/status`, { status })
  return response.data.data
}
