import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createHomepageSection,
  deleteHomepageSection,
  homepageSectionKeys,
  homepageSectionListQueryOptions,
  updateHomepageSection,
} from '@/modules/layout/api/homepage-sections'
import type {
  CreateHomepageSectionInput,
  HomepageSection,
  HomepageSectionListParams,
  UpdateHomepageSectionInput,
} from '@/modules/layout/types/homepage-section.types'

export function useHomepageSections(params: HomepageSectionListParams) {
  return useQuery(homepageSectionListQueryOptions(params))
}

export function useCreateHomepageSection() {
  const queryClient = useQueryClient()
  return useMutation<HomepageSection, Error, CreateHomepageSectionInput>({
    mutationFn: createHomepageSection,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: homepageSectionKeys.all })
    },
  })
}

export function useUpdateHomepageSection() {
  const queryClient = useQueryClient()
  return useMutation<
    HomepageSection,
    Error,
    { id: string; input: UpdateHomepageSectionInput }
  >({
    mutationFn: ({ id, input }) => updateHomepageSection(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: homepageSectionKeys.all })
    },
  })
}

export function useDeleteHomepageSection() {
  const queryClient = useQueryClient()
  return useMutation<HomepageSection, Error, string>({
    mutationFn: deleteHomepageSection,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: homepageSectionKeys.all })
    },
  })
}
