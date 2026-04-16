import { queryOptions } from '@tanstack/react-query'

import { apiClient, type ApiEnvelope } from '@/api/client'
import type { DashboardSummary } from '@/modules/dashboard/types/dashboard.types'

export const dashboardKeys = {
  summary: ['dashboard', 'summary'] as const,
}

export const dashboardSummaryQueryOptions = queryOptions({
  queryKey: dashboardKeys.summary,
  queryFn: async (): Promise<DashboardSummary> => {
    const response = await apiClient.get<ApiEnvelope<DashboardSummary>>('/admin/dashboard')
    return response.data.data
  },
})
