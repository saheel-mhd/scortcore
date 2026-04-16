export type DashboardMetric = {
  id: string
  label: string
  value: string
  change: string
  trend: 'up' | 'down' | 'neutral'
}

export type DashboardActivity = {
  id: string
  title: string
  description: string
  time: string
}

export type DashboardFocusItem = {
  id: string
  title: string
  description: string
}

export type DashboardOverview = {
  metrics: DashboardMetric[]
  activities: DashboardActivity[]
  focusItems: DashboardFocusItem[]
}
