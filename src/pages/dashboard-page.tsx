import { ArrowRight, RefreshCw } from 'lucide-react'

import { PageHeader } from '@/shared/page-header'
import { MetricCard } from '@/shared/metric-card'
import { PanelCard } from '@/shared/panel-card'
import { Button } from '@/ui/button'
import { usePageTitle } from '@/hooks/use-page-title'
import { useDashboardOverview } from '@/modules/dashboard/hooks/use-dashboard-overview'

function DashboardPage() {
  const dashboardOverview = useDashboardOverview()

  usePageTitle('Dashboard')

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Step 1 foundation"
        title="CRM dashboard"
        description="This base dashboard is wired with lazy routes, React Query, Zustand, Axios, and reusable UI blocks."
        action={
          <Button variant="outline" onClick={() => dashboardOverview.refetch()}>
            <RefreshCw />
            Refresh data
          </Button>
        }
      />

      {dashboardOverview.isError ? (
        <PanelCard
          description="The dashboard overview request failed."
          title="Unable to load data"
        >
          <p className="text-sm text-red-200">
            Check the mock endpoint or query configuration and try again.
          </p>
        </PanelCard>
      ) : null}

      {dashboardOverview.isPending ? (
        <PanelCard
          description="The dashboard is fetching its initial dataset."
          title="Loading overview"
        >
          <p className="text-sm text-slate-300">Loading CRM metrics...</p>
        </PanelCard>
      ) : null}

      {dashboardOverview.data ? (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {dashboardOverview.data.metrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
            <PanelCard
              description="Recent actions across leads, accounts, and deals."
              title="Recent activity"
            >
              <div className="space-y-4">
                {dashboardOverview.data.activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start justify-between gap-4 border-b border-white/10 pb-4 last:border-b-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium text-white">{activity.title}</p>
                      <p className="mt-1 text-sm text-slate-400">
                        {activity.description}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs uppercase tracking-[0.2em] text-slate-500">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </PanelCard>

            <PanelCard
              description="Immediate targets for the admin team."
              title="Team focus"
            >
              <div className="space-y-4">
                {dashboardOverview.data.focusItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <p className="font-medium text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {item.description}
                    </p>
                  </div>
                ))}
                <Button className="w-full" variant="outline">
                  Open module roadmap
                  <ArrowRight />
                </Button>
              </div>
            </PanelCard>
          </section>
        </>
      ) : null}
    </div>
  )
}

export default DashboardPage
