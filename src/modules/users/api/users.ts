import { queryOptions } from '@tanstack/react-query'

import { apiClient, type ApiEnvelope } from '@/api/client'
import type {
  CreateUserInput,
  UpdateUserInput,
  User,
  UserListParams,
  UserListResponse,
} from '@/modules/users/types/user.types'

export const userKeys = {
  all: ['users'] as const,
  list: (params: UserListParams) => ['users', 'list', params] as const,
  detail: (id: string) => ['users', 'detail', id] as const,
}

export function userListQueryOptions(params: UserListParams) {
  return queryOptions({
    queryKey: userKeys.list(params),
    queryFn: async (): Promise<UserListResponse> => {
      const response = await apiClient.get<ApiEnvelope<UserListResponse>>(
        '/users',
        { params }
      )
      return response.data.data
    },
  })
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const response = await apiClient.post<ApiEnvelope<User>>('/users', input)
  return response.data.data
}

export async function updateUser(
  id: string,
  input: UpdateUserInput
): Promise<User> {
  const response = await apiClient.put<ApiEnvelope<User>>(
    `/users/${id}`,
    input
  )
  return response.data.data
}

export async function deleteUser(id: string): Promise<User> {
  const response = await apiClient.delete<ApiEnvelope<User>>(
    `/users/${id}`
  )
  return response.data.data
}
