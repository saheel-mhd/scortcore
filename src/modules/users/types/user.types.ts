export type UserRole = 'admin' | 'staff' | 'customer'

export type User = {
  id: string
  email: string
  role: UserRole
  roleConfigId: string | null
  createdAt: string
  updatedAt: string
}

export type UserListResponse = {
  users: User[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type UserListParams = {
  page?: number
  limit?: number
  search?: string
  role?: UserRole
  sortBy?: 'email' | 'role' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
}

export type CreateUserInput = {
  email: string
  password: string
  roleConfigId: string
}

export type UpdateUserInput = {
  email?: string
  password?: string
  roleConfigId?: string
}
