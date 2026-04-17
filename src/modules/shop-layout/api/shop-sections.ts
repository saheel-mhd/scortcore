import { queryOptions } from '@tanstack/react-query'

import { apiClient, type ApiEnvelope } from '@/api/client'
import type {
  CreateShopSectionInput,
  ShopSection,
  ShopSectionListParams,
  ShopSectionListResponse,
  UpdateShopSectionInput,
} from '@/modules/shop-layout/types/shop-section.types'

export const shopSectionKeys = {
  all: ['shop-sections'] as const,
  list: (params: ShopSectionListParams) =>
    ['shop-sections', 'list', params] as const,
  detail: (id: string) => ['shop-sections', 'detail', id] as const,
}

export function shopSectionListQueryOptions(params: ShopSectionListParams) {
  return queryOptions({
    queryKey: shopSectionKeys.list(params),
    queryFn: async (): Promise<ShopSectionListResponse> => {
      const response = await apiClient.get<ApiEnvelope<ShopSectionListResponse>>(
        '/shop-sections',
        { params }
      )
      return response.data.data
    },
  })
}

export async function createShopSection(
  input: CreateShopSectionInput
): Promise<ShopSection> {
  const response = await apiClient.post<ApiEnvelope<ShopSection>>(
    '/shop-sections',
    input
  )
  return response.data.data
}

export async function updateShopSection(
  id: string,
  input: UpdateShopSectionInput
): Promise<ShopSection> {
  const response = await apiClient.put<ApiEnvelope<ShopSection>>(
    `/shop-sections/${id}`,
    input
  )
  return response.data.data
}

export async function deleteShopSection(id: string): Promise<ShopSection> {
  const response = await apiClient.delete<ApiEnvelope<ShopSection>>(
    `/shop-sections/${id}`
  )
  return response.data.data
}
