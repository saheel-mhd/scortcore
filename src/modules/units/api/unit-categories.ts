import { queryOptions } from '@tanstack/react-query'

import { apiClient, type ApiEnvelope } from '@/api/client'
import type {
  CreateUnitCategoryInput,
  UnitCategory,
  UnitCategoryListParams,
  UnitCategoryListResponse,
  UpdateUnitCategoryInput,
} from '@/modules/units/types/unit.types'

export const unitCategoryKeys = {
  all: ['unit-categories'] as const,
  list: (params: UnitCategoryListParams) => ['unit-categories', 'list', params] as const,
  detail: (id: string) => ['unit-categories', 'detail', id] as const,
}

export function unitCategoryListQueryOptions(params: UnitCategoryListParams) {
  return queryOptions({
    queryKey: unitCategoryKeys.list(params),
    queryFn: async (): Promise<UnitCategoryListResponse> => {
      const response = await apiClient.get<ApiEnvelope<UnitCategoryListResponse>>(
        '/unit-categories',
        { params }
      )
      return response.data.data
    },
  })
}

export async function createUnitCategory(input: CreateUnitCategoryInput): Promise<UnitCategory> {
  const response = await apiClient.post<ApiEnvelope<UnitCategory>>('/unit-categories', input)
  return response.data.data
}

export async function updateUnitCategory(
  id: string,
  input: UpdateUnitCategoryInput
): Promise<UnitCategory> {
  const response = await apiClient.put<ApiEnvelope<UnitCategory>>(`/unit-categories/${id}`, input)
  return response.data.data
}

export async function deleteUnitCategory(id: string): Promise<UnitCategory> {
  const response = await apiClient.delete<ApiEnvelope<UnitCategory>>(`/unit-categories/${id}`)
  return response.data.data
}
