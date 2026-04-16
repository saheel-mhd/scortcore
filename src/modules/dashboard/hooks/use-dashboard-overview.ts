import { useQuery } from '@tanstack/react-query'

import { dashboardSummaryQueryOptions } from '@/modules/dashboard/api/get-dashboard-overview'

export function useDashboardSummary() {
  return useQuery(dashboardSummaryQueryOptions)
}
