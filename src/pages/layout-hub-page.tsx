import { LayoutGrid, Store } from 'lucide-react'
import { Link } from 'react-router-dom'

import { usePageTitle } from '@/hooks/use-page-title'
import { routePaths } from '@/routes/paths'
import { PageHeader } from '@/shared/page-header'

const tiles = [
  {
    href: routePaths.layoutHome,
    icon: LayoutGrid,
    label: 'Homepage Layout',
    description: 'Curate the store home page with product collections and banners.',
    color: 'text-sky-300',
    bg: 'bg-sky-400/10',
  },
  {
    href: routePaths.layoutShop,
    icon: Store,
    label: 'Shop Layout',
    description: 'Build the shop page layout row by row. Reorder when new products arrive.',
    color: 'text-emerald-300',
    bg: 'bg-emerald-400/10',
  },
]

export default function LayoutHubPage() {
  usePageTitle('Layout')

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Layout"
        description="Choose which page layout to edit."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((tile) => {
          const Icon = tile.icon
          return (
            <Link
              key={tile.href}
              to={tile.href}
              className="group flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/55 p-6 transition hover:border-sky-400/30 hover:bg-slate-950/70"
            >
              <div className={`flex size-12 items-center justify-center rounded-2xl ${tile.bg}`}>
                <Icon className={`size-6 ${tile.color}`} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white group-hover:text-sky-200">
                  {tile.label}
                </h3>
                <p className="mt-1 text-sm text-slate-400">{tile.description}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
