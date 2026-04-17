import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createUser,
  deleteUser,
  updateUser,
  userKeys,
  userListQueryOptions,
} from '@/modules/users/api/users'
import type {
  CreateUserInput,
  UpdateUserInput,
  User,
  UserListParams,
} from '@/modules/users/types/user.types'

export function useUsers(params: UserListParams) {
  return useQuery(userListQueryOptions(params))
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation<User, Error, CreateUserInput>({
    mutationFn: createUser,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation<User, Error, { id: string; input: UpdateUserInput }>({
    mutationFn: ({ id, input }) => updateUser(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation<User, Error, string>({
    mutationFn: deleteUser,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
  })
}
