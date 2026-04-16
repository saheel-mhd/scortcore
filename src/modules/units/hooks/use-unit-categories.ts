import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createUnitCategory,
  deleteUnitCategory,
  unitCategoryKeys,
  unitCategoryListQueryOptions,
  updateUnitCategory,
} from '@/modules/units/api/unit-categories'
import { unitKeys } from '@/modules/units/api/units'
import type {
  CreateUnitCategoryInput,
  UnitCategory,
  UnitCategoryListParams,
  UpdateUnitCategoryInput,
} from '@/modules/units/types/unit.types'

export function useUnitCategories(params: UnitCategoryListParams) {
  return useQuery(unitCategoryListQueryOptions(params))
}

export function useCreateUnitCategory() {
  const queryClient = useQueryClient()
  return useMutation<UnitCategory, Error, CreateUnitCategoryInput>({
    mutationFn: createUnitCategory,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: unitCategoryKeys.all })
    },
  })
}

export function useUpdateUnitCategory() {
  const queryClient = useQueryClient()
  return useMutation<UnitCategory, Error, { id: string; input: UpdateUnitCategoryInput }>({
    mutationFn: ({ id, input }) => updateUnitCategory(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: unitCategoryKeys.all })
    },
  })
}

export function useDeleteUnitCategory() {
  const queryClient = useQueryClient()
  return useMutation<UnitCategory, Error, string>({
    mutationFn: deleteUnitCategory,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: unitCategoryKeys.all })
      void queryClient.invalidateQueries({ queryKey: unitKeys.all })
    },
  })
}
