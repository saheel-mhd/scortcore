import { useQuery } from '@tanstack/react-query'

import { dashboardOverviewQueryOptions } from '@/modules/dashboard/api/get-dashboard-overview'

export function useDashboardOverview() {
  return useQuery(dashboardOverviewQueryOptions)
}
