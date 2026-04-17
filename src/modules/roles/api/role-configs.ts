import { queryOptions } from '@tanstack/react-query'

import { apiClient, type ApiEnvelope } from '@/api/client'
import type {
  CreateRoleConfigInput,
  RoleConfig,
  RoleConfigListResponse,
  UpdateRoleConfigInput,
} from '@/modules/roles/types/role-config.types'

export const roleConfigKeys = {
  all: ['role-configs'] as const,
  list: ['role-configs', 'list'] as const,
}

export const roleConfigListQueryOptions = queryOptions({
  queryKey: roleConfigKeys.list,
  queryFn: async (): Promise<RoleConfigListResponse> => {
    const response = await apiClient.get<ApiEnvelope<RoleConfigListResponse>>(
      '/role-configs',
    )
    return response.data.data
  },
})

export async function createRoleConfig(input: CreateRoleConfigInput): Promise<RoleConfig> {
  const response = await apiClient.post<ApiEnvelope<RoleConfig>>('/role-configs', input)
  return response.data.data
}

export async function updateRoleConfig(
  id: string,
  input: UpdateRoleConfigInput
): Promise<RoleConfig> {
  const response = await apiClient.put<ApiEnvelope<RoleConfig>>(
    `/role-configs/${id}`,
    input
  )
  return response.data.data
}

export async function deleteRoleConfig(id: string): Promise<RoleConfig> {
  const response = await apiClient.delete<ApiEnvelope<RoleConfig>>(
    `/role-configs/${id}`
  )
  return response.data.data
}
