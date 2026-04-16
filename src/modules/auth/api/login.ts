import { apiClient, type ApiEnvelope } from '@/api/client'
import type { LoginInput, LoginResponse } from '@/modules/auth/types/auth.types'

export async function login(input: LoginInput): Promise<LoginResponse> {
  const response = await apiClient.post<ApiEnvelope<LoginResponse>>('/auth/login', input)
  return response.data.data
}
