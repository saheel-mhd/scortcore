import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createUnit,
  deleteUnit,
  unitKeys,
  unitListQueryOptions,
  updateUnit,
} from '@/modules/units/api/units'
import type {
  CreateUnitInput,
  Unit,
  UnitListParams,
  UpdateUnitInput,
} from '@/modules/units/types/unit.types'

export function useUnits(params: UnitListParams) {
  return useQuery(unitListQueryOptions(params))
}

export function useCreateUnit() {
  const queryClient = useQueryClient()
  return useMutation<Unit, Error, CreateUnitInput>({
    mutationFn: createUnit,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: unitKeys.all })
    },
  })
}

export function useUpdateUnit() {
  const queryClient = useQueryClient()
  return useMutation<Unit, Error, { id: string; input: UpdateUnitInput }>({
    mutationFn: ({ id, input }) => updateUnit(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: unitKeys.all })
    },
  })
}

export function useDeleteUnit() {
  const queryClient = useQueryClient()
  return useMutation<Unit, Error, string>({
    mutationFn: deleteUnit,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: unitKeys.all })
    },
  })
}
