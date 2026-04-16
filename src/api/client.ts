import axios, { AxiosError } from 'axios'

import { useAuthStore } from '@/store/auth-store'

export type ApiEnvelope<T> = {
  success: true
  data: T
  message?: string
}

type ApiErrorBody = {
  success: false
  message: string
}

const rawBase = import.meta.env.VITE_API_BASE ?? 'http://localhost:3000'
const normalizedBase = rawBase.replace(/\/+$/, '')

export const apiClient = axios.create({
  baseURL: `${normalizedBase}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().signOut()
    }

    return Promise.reject(error)
  }
)

export function extractErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (error instanceof AxiosError) {
    const body = error.response?.data as ApiErrorBody | undefined
    if (body?.message) return body.message
    if (error.message) return error.message
  }

  if (error instanceof Error) return error.message

  return fallback
}
