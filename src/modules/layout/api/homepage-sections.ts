import { queryOptions } from '@tanstack/react-query'

import { apiClient, type ApiEnvelope } from '@/api/client'
import type {
  CreateHomepageSectionInput,
  HomepageSection,
  HomepageSectionListParams,
  HomepageSectionListResponse,
  UpdateHomepageSectionInput,
} from '@/modules/layout/types/homepage-section.types'

export const homepageSectionKeys = {
  all: ['homepage-sections'] as const,
  list: (params: HomepageSectionListParams) =>
    ['homepage-sections', 'list', params] as const,
  detail: (id: string) => ['homepage-sections', 'detail', id] as const,
}

export function homepageSectionListQueryOptions(params: HomepageSectionListParams) {
  return queryOptions({
    queryKey: homepageSectionKeys.list(params),
    queryFn: async (): Promise<HomepageSectionListResponse> => {
      const response = await apiClient.get<ApiEnvelope<HomepageSectionListResponse>>(
        '/homepage-sections',
        { params }
      )
      return response.data.data
    },
  })
}

export async function createHomepageSection(
  input: CreateHomepageSectionInput
): Promise<HomepageSection> {
  const response = await apiClient.post<ApiEnvelope<HomepageSection>>(
    '/homepage-sections',
    input
  )
  return response.data.data
}

export async function updateHomepageSection(
  id: string,
  input: UpdateHomepageSectionInput
): Promise<HomepageSection> {
  const response = await apiClient.put<ApiEnvelope<HomepageSection>>(
    `/homepage-sections/${id}`,
    input
  )
  return response.data.data
}

export async function deleteHomepageSection(id: string): Promise<HomepageSection> {
  const response = await apiClient.delete<ApiEnvelope<HomepageSection>>(
    `/homepage-sections/${id}`
  )
  return response.data.data
}
