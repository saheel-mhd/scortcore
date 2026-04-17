import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createShopSection,
  deleteShopSection,
  shopSectionKeys,
  shopSectionListQueryOptions,
  updateShopSection,
} from '@/modules/shop-layout/api/shop-sections'
import type {
  CreateShopSectionInput,
  ShopSection,
  ShopSectionListParams,
  UpdateShopSectionInput,
} from '@/modules/shop-layout/types/shop-section.types'

export function useShopSections(params: ShopSectionListParams) {
  return useQuery(shopSectionListQueryOptions(params))
}

export function useCreateShopSection() {
  const queryClient = useQueryClient()
  return useMutation<ShopSection, Error, CreateShopSectionInput>({
    mutationFn: createShopSection,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: shopSectionKeys.all })
    },
  })
}

export function useUpdateShopSection() {
  const queryClient = useQueryClient()
  return useMutation<
    ShopSection,
    Error,
    { id: string; input: UpdateShopSectionInput }
  >({
    mutationFn: ({ id, input }) => updateShopSection(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: shopSectionKeys.all })
    },
  })
}

export function useDeleteShopSection() {
  const queryClient = useQueryClient()
  return useMutation<ShopSection, Error, string>({
    mutationFn: deleteShopSection,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: shopSectionKeys.all })
    },
  })
}
