import { apiClient, type ApiEnvelope } from '@/api/client'
import type { Order } from '@/modules/orders/types/order.types'

export async function cancelOrder(id: string, reason?: string): Promise<Order> {
  const response = await apiClient.put<ApiEnvelope<Order>>(
    `/orders/${id}/cancel`,
    reason ? { reason } : {},
  )
  return response.data.data
}
