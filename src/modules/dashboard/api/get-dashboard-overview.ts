import { queryOptions } from '@tanstack/react-query'

import type { DashboardOverview } from '@/types/dashboard'

export const dashboardOverviewQueryOptions = queryOptions({
  queryKey: ['dashboard-overview'],
  queryFn: async (): Promise<DashboardOverview> => {
    const response = await fetch('/dashboard-overview.json')

    if (!response.ok) {
      throw new Error(`Failed to load dashboard overview: ${response.status}`)
    }

    return (await response.json()) as DashboardOverview
  },
})
