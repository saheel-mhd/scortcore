import { ArrowDown, ArrowUp, Eye, EyeOff, Image as ImageIcon, LayoutGrid, Package, Pencil, Trash2 } from 'lucide-react'

import { useUpdateHomepageSection } from '@/modules/layout/hooks/use-homepage-sections'
import type { HomepageSection } from '@/modules/layout/types/homepage-section.types'
import { Button } from '@/ui/button'

type Props = {
  section: HomepageSection
  isFirst: boolean
  isLast: boolean
  onEdit: () => void
  onDelete: () => void
  onMove: (delta: -1 | 1) => void
}

export function SectionCard({ section, isFirst, isLast, onEdit, onDelete, onMove }: Props) {
  const updateMutation = useUpdateHomepageSection()

  const toggleActive = () => {
    updateMutation.mutate({
      id: section.id,
      input: { isActive: !section.isActive },
    })
  }

  const isBanner = section.type === 'banner'
  const TypeIcon = isBanner ? ImageIcon : LayoutGrid

  return (
    <article
      className={[
        'rounded-2xl border p-5 transition',
        section.isActive
          ? 'border-white/10 bg-slate-950/55'
          : 'border-white/5 bg-slate-950/30 opacity-70',
      ].join(' ')}
    >
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-slate-500">
              #{section.displayOrder}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/10 px-2 py-0.5 text-xs font-medium text-sky-300">
              <TypeIcon className="size-3" strokeWidth={1.5} />
              {isBanner ? 'Banner' : 'Products'}
            </span>
            <h3 className="text-lg font-semibold text-white">{section.title}</h3>
            <span
              className={[
                'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                section.isActive
                  ? 'bg-emerald-500/10 text-emerald-300'
                  : 'bg-slate-500/15 text-slate-300',
              ].join(' ')}
            >
              {section.isActive ? 'Active' : 'Hidden'}
            </span>
          </div>
          {section.description ? (
            <p className="mt-1 text-sm text-slate-300">{section.description}</p>
          ) : null}
          {!isBanner ? (
            <p className="mt-1 text-xs text-slate-500">
              {section.products.length} product{section.products.length === 1 ? '' : 's'}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-1">
          <Button
            aria-label="Move up"
            disabled={isFirst}
            onClick={() => onMove(-1)}
            size="icon-sm"
            variant="ghost"
          >
            <ArrowUp />
          </Button>
          <Button
            aria-label="Move down"
            disabled={isLast}
            onClick={() => onMove(1)}
            size="icon-sm"
            variant="ghost"
          >
            <ArrowDown />
          </Button>
          <Button
            aria-label={section.isActive ? 'Hide section' : 'Show section'}
            disabled={updateMutation.isPending}
            onClick={toggleActive}
            size="icon-sm"
            variant="ghost"
          >
            {section.isActive ? <EyeOff /> : <Eye />}
          </Button>
          <Button aria-label="Edit section" onClick={onEdit} size="icon-sm" variant="ghost">
            <Pencil />
          </Button>
          <Button
            aria-label="Delete section"
            onClick={onDelete}
            size="icon-sm"
            variant="destructive"
          >
            <Trash2 />
          </Button>
        </div>
      </header>

      {isBanner ? <BannerPreview section={section} /> : <ProductsPreview section={section} />}
    </article>
  )
}

function ProductsPreview({ section }: { section: HomepageSection }) {
  if (section.products.length === 0) {
    return (
      <p className="mt-4 rounded-xl border border-dashed border-white/10 bg-slate-950/30 p-4 text-center text-xs text-slate-500">
        No products yet. Edit this section to add some.
      </p>
    )
  }

  return (
    <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
      {section.products.slice(0, 6).map((product) => (
        <div
          key={product.id}
          className="flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-slate-950/40"
          title={product.name}
        >
          {product.cardImage ? (
            <img
              alt={product.name}
              className="size-full object-cover"
              loading="lazy"
              src={product.cardImage}
            />
          ) : (
            <Package className="size-6 text-slate-600" />
          )}
        </div>
      ))}
      {section.products.length > 6 ? (
        <div className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-white/10 bg-slate-950/40 text-xs text-slate-400">
          +{section.products.length - 6}
        </div>
      ) : null}
    </div>
  )
}

function BannerPreview({ section }: { section: HomepageSection }) {
  const config = section.bannerConfig
  if (!config) {
    return (
      <p className="mt-4 rounded-xl border border-dashed border-white/10 bg-slate-950/30 p-4 text-center text-xs text-slate-500">
        Banner not configured yet.
      </p>
    )
  }

  const bg = config.backgroundImage
    ? `url(${config.backgroundImage}) center/cover`
    : config.backgroundColor ?? '#0f172a'
  const textColor = config.textColor ?? '#ffffff'
  const contentAlign = config.contentAlign ?? 'center'

  return (
    <div
      className="mt-4 flex min-h-32 items-center overflow-hidden rounded-xl border border-white/10"
      style={{ background: bg }}
    >
      <div
        className={[
          'flex w-full flex-col gap-1 p-6',
          contentAlign === 'left'
            ? 'items-start text-left'
            : contentAlign === 'right'
              ? 'items-end text-right'
              : 'items-center text-center',
        ].join(' ')}
      >
        <p className="font-semibold" style={{ color: textColor }}>
          {section.title}
        </p>
        {section.description ? (
          <p className="max-w-md text-xs opacity-80" style={{ color: textColor }}>
            {section.description}
          </p>
        ) : null}
        {config.ctaLabel ? (
          <span
            className="mt-1 inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-medium"
            style={{ color: textColor }}
          >
            {config.ctaLabel}
          </span>
        ) : null}
      </div>
    </div>
  )
}
