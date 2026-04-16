import type { DashboardMetric } from '@/types/dashboard'

type MetricCardProps = {
  metric: DashboardMetric
}

export function MetricCard({ metric }: MetricCardProps) {
  const trendClassName =
    metric.trend === 'up'
      ? 'text-emerald-300'
      : metric.trend === 'down'
        ? 'text-red-300'
        : 'text-slate-300'

  return (
    <article className="rounded-2xl border border-white/10 bg-slate-950/55 p-5">
      <p className="text-sm text-slate-400">{metric.label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-3xl font-semibold text-white">{metric.value}</p>
        <p className={`text-sm font-medium ${trendClassName}`}>{metric.change}</p>
      </div>
    </article>
  )
}
