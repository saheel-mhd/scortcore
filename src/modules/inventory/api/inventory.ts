import { queryOptions } from '@tanstack/react-query'
import { apiClient, type ApiEnvelope } from '@/api/client'
import type { AdjustStockInput, InventoryListParams, InventoryListResponse, InventoryMovementsParams, InventoryMovementsResponse, InventoryVariant, } from '@/modules/inventory/types/inventory.types'

export const inventoryKeys = {
  all: ['inventory'] as const,
  list: (params: InventoryListParams) => ['inventory', 'list', params] as const,
  lowStock: (params: InventoryListParams) => ['inventory', 'low-stock', params] as const,
  movements: (variantId: string, params: InventoryMovementsParams) =>
    ['inventory', 'movements', variantId, params] as const,
}

export function inventoryListQueryOptions(params: InventoryListParams) {
  return queryOptions({
    queryKey: inventoryKeys.list(params),
    queryFn: async (): Promise<InventoryListResponse> => {
      const response = await apiClient.get<ApiEnvelope<InventoryListResponse>>('/inventory', {
        params,
      })
      return response.data.data
    },
  })
}

export function lowStockQueryOptions(params: InventoryListParams) {
  return queryOptions({
    queryKey: inventoryKeys.lowStock(params),
    queryFn: async (): Promise<InventoryListResponse> => {
      const response = await apiClient.get<ApiEnvelope<InventoryListResponse>>(
        '/inventory/low-stock',
        { params },
      )
      return response.data.data
    },
  })
}

export function inventoryMovementsQueryOptions(
  variantId: string,
  params: InventoryMovementsParams,
) {
  return queryOptions({
    queryKey: inventoryKeys.movements(variantId, params),
    queryFn: async (): Promise<InventoryMovementsResponse> => {
      const response = await apiClient.get<ApiEnvelope<InventoryMovementsResponse>>(
        `/inventory/${variantId}/movements`,
        { params },
      )
      return response.data.data
    },
    enabled: variantId.length > 0,
  })
}

export async function adjustStock(
  variantId: string,
  input: AdjustStockInput,
): Promise<InventoryVariant> {
  const response = await apiClient.put<ApiEnvelope<InventoryVariant>>(
    `/inventory/${variantId}/stock`,
    input,
  )
  return response.data.data
}
