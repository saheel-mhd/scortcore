import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createRoleConfig,
  deleteRoleConfig,
  roleConfigKeys,
  roleConfigListQueryOptions,
  updateRoleConfig,
} from '@/modules/roles/api/role-configs'
import type {
  CreateRoleConfigInput,
  RoleConfig,
  UpdateRoleConfigInput,
} from '@/modules/roles/types/role-config.types'

export function useRoleConfigs() {
  return useQuery(roleConfigListQueryOptions)
}

export function useCreateRoleConfig() {
  const queryClient = useQueryClient()
  return useMutation<RoleConfig, Error, CreateRoleConfigInput>({
    mutationFn: createRoleConfig,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: roleConfigKeys.all })
    },
  })
}

export function useUpdateRoleConfig() {
  const queryClient = useQueryClient()
  return useMutation<RoleConfig, Error, { id: string; input: UpdateRoleConfigInput }>({
    mutationFn: ({ id, input }) => updateRoleConfig(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: roleConfigKeys.all })
    },
  })
}

export function useDeleteRoleConfig() {
  const queryClient = useQueryClient()
  return useMutation<RoleConfig, Error, string>({
    mutationFn: deleteRoleConfig,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: roleConfigKeys.all })
    },
  })
}
