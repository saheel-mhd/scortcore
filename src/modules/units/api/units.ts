import { queryOptions } from '@tanstack/react-query'

import { apiClient, type ApiEnvelope } from '@/api/client'
import type {
  CreateUnitInput,
  Unit,
  UnitListParams,
  UnitListResponse,
  UpdateUnitInput,
} from '@/modules/units/types/unit.types'

export const unitKeys = {
  all: ['units'] as const,
  list: (params: UnitListParams) => ['units', 'list', params] as const,
  detail: (id: string) => ['units', 'detail', id] as const,
}

export function unitListQueryOptions(params: UnitListParams) {
  return queryOptions({
    queryKey: unitKeys.list(params),
    queryFn: async (): Promise<UnitListResponse> => {
      const response = await apiClient.get<ApiEnvelope<UnitListResponse>>('/units', { params })
      return response.data.data
    },
  })
}

export async function createUnit(input: CreateUnitInput): Promise<Unit> {
  const response = await apiClient.post<ApiEnvelope<Unit>>('/units', input)
  return response.data.data
}

export async function updateUnit(id: string, input: UpdateUnitInput): Promise<Unit> {
  const response = await apiClient.put<ApiEnvelope<Unit>>(`/units/${id}`, input)
  return response.data.data
}

export async function deleteUnit(id: string): Promise<Unit> {
  const response = await apiClient.delete<ApiEnvelope<Unit>>(`/units/${id}`)
  return response.data.data
}
