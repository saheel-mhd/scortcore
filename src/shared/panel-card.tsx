import type { PropsWithChildren, ReactNode } from 'react'

type PanelCardProps = PropsWithChildren<{
  title: string
  description?: string
  action?: ReactNode
}>

export function PanelCard({
  title,
  description,
  action,
  children,
}: PanelCardProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-950/55 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          {description ? (
            <p className="text-sm text-slate-400">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  )
}
