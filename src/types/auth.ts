export type AuthStatus = 'anonymous' | 'authenticated'

export type UserRole = 'admin' | 'staff' | 'customer'

export type AuthUser = {
  id: string
  email: string
  role: UserRole
}

export type AuthSession = {
  accessToken: string
  user: AuthUser
}
