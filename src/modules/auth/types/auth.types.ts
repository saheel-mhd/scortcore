import type { AuthUser } from '@/types/auth'

export type LoginInput = {
  email: string
  password: string
}

export type LoginResponse = {
  user: AuthUser
  token: string
}
