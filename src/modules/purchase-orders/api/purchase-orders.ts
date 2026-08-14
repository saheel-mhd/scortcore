import { queryOptions } from '@tanstack/react-query'
import { apiClient, type ApiEnvelope } from '@/api/client'
import type { CreatePurchaseOrderInput, PurchaseOrder, PurchaseOrderListParams, PurchaseOrdersListResponse, ReceivePurchaseOrderInput, } from '@/modules/purchase-orders/types/purchase-order.types'

export const purchaseOrderKeys = {
  all: ['purchase-orders'] as const,
  list: (params: PurchaseOrderListParams) => ['purchase-orders', 'list', params] as const,
  detail: (id: string) => ['purchase-orders', 'detail', id] as const,
}

export function purchaseOrdersListQueryOptions(params: PurchaseOrderListParams) {
  return queryOptions({
    queryKey: purchaseOrderKeys.list(params),
    queryFn: async (): Promise<PurchaseOrdersListResponse> => {
      const response = await apiClient.get<ApiEnvelope<PurchaseOrdersListResponse>>(
        '/purchase-orders',
        { params },
      )
      return response.data.data
    },
  })
}

export function purchaseOrderQueryOptions(id: string) {
  return queryOptions({
    queryKey: purchaseOrderKeys.detail(id),
    queryFn: async (): Promise<PurchaseOrder> => {
      const response = await apiClient.get<ApiEnvelope<PurchaseOrder>>(`/purchase-orders/${id}`)
      return response.data.data
    },
    enabled: id.length > 0,
  })
}

export async function createPurchaseOrder(
  input: CreatePurchaseOrderInput,
): Promise<PurchaseOrder> {
  const response = await apiClient.post<ApiEnvelope<PurchaseOrder>>('/purchase-orders', input)
  return response.data.data
}

export async function receivePurchaseOrder(
  id: string,
  input: ReceivePurchaseOrderInput,
): Promise<PurchaseOrder> {
  const response = await apiClient.put<ApiEnvelope<PurchaseOrder>>(
    `/purchase-orders/${id}/receive`,
    input,
  )
  return response.data.data
}
