import { useState } from 'react'
import { Info, Plus, Search } from 'lucide-react'

import { extractErrorMessage } from '@/api/client'
import { usePageTitle } from '@/hooks/use-page-title'
import { ShopBannerDialog } from '@/modules/shop-layout/components/shop-banner-dialog'
import { ShopRowCard } from '@/modules/shop-layout/components/shop-row-card'
import { ShopRowFormDialog } from '@/modules/shop-layout/components/shop-row-form-dialog'
import { ShopRowTypeChooser } from '@/modules/shop-layout/components/shop-row-type-chooser'
import {
  useDeleteShopSection,
  useShopSections,
  useUpdateShopSection,
} from '@/modules/shop-layout/hooks/use-shop-sections'
import type { ShopRowType, ShopSection } from '@/modules/shop-layout/types/shop-section.types'
import { PageHeader } from '@/shared/page-header'
import { PanelCard } from '@/shared/panel-card'
import { Button } from '@/ui/button'

type DialogState =
  | { kind: 'closed' }
  | { kind: 'chooser' }
  | { kind: 'product'; rowType: ShopRowType; editing: ShopSection | null }
  | { kind: 'banner'; editing: ShopSection | null }

export default function ShopLayoutPage() {
  usePageTitle('Shop Layout')

  const [dialog, setDialog] = useState<DialogState>({ kind: 'closed' })

  const query = useShopSections({
    page: 1,
    limit: 100,
    sortBy: 'displayOrder',
    sortOrder: 'asc',
  })

  const updateMutation = useUpdateShopSection()
  const deleteMutation = useDeleteShopSection()

  const sections = query.data?.items ?? []
  const nextDisplayOrder =
    sections.length > 0
      ? Math.max(...sections.map((section) => section.displayOrder)) + 1
      : 0

  const openChooser = () => setDialog({ kind: 'chooser' })
  const closeDialog = () => setDialog({ kind: 'closed' })

  const openEditDialog = (section: ShopSection) => {
    if (section.type === 'banner') {
      setDialog({ kind: 'banner', editing: section })
    } else {
      setDialog({ kind: 'product', rowType: section.type, editing: section })
    }
  }

  const handleChooseType = (type: ShopRowType) => {
    if (type === 'banner') {
      setDialog({ kind: 'banner', editing: null })
    } else {
      setDialog({ kind: 'product', rowType: type, editing: null })
    }
  }

  const handleMove = (section: ShopSection, delta: -1 | 1) => {
    const sortedIndex = sections.findIndex((item) => item.id === section.id)
    const neighbor = sections[sortedIndex + delta]
    if (!neighbor) return

    const currentOrder = section.displayOrder
    const neighborOrder = neighbor.displayOrder
    void updateMutation.mutateAsync({
      id: section.id,
      input: { displayOrder: neighborOrder },
    })
    void updateMutation.mutateAsync({
      id: neighbor.id,
      input: { displayOrder: currentOrder },
    })
  }

  const handleDelete = (section: ShopSection) => {
    if (!window.confirm(`Delete row "${section.title}"? This can't be undone.`)) return
    deleteMutation.mutate(section.id)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        badge="Shop"
        title="Shop Layout"
        description="Build the shop page layout row by row. Reorder, show/hide, or swap rows when new products arrive."
        action={
          <Button onClick={openChooser}>
            <Plus />
            New row
          </Button>
        }
      />

      <div className="flex items-start gap-3 rounded-2xl border border-sky-400/20 bg-sky-400/5 p-4">
        <Search className="mt-0.5 size-5 shrink-0 text-sky-300" />
        <div className="space-y-1 text-sm">
          <p className="font-medium text-sky-200">Search &amp; filter behavior</p>
          <p className="text-slate-300">
            This custom layout only applies to the default shop view. When a customer uses the
            search bar or applies filters, the shop automatically switches to a{' '}
            <strong className="text-white">4-column grid</strong> layout showing all matching
            products in a simple, scrollable list. No custom rows are shown during search.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4">
        <Info className="mt-0.5 size-5 shrink-0 text-amber-300" />
        <div className="space-y-1 text-sm">
          <p className="font-medium text-amber-200">Tips for frequent layout changes</p>
          <ul className="list-inside list-disc space-y-0.5 text-slate-300">
            <li>Use the <strong className="text-white">eye toggle</strong> to hide rows temporarily instead of deleting them — bring them back any time.</li>
            <li>Use <strong className="text-white">Featured spotlight</strong> rows for new product drops — place them at the top with order #0.</li>
            <li>Swap row order with the <strong className="text-white">arrow buttons</strong> — no drag needed.</li>
            <li><strong className="text-white">Carousel strips</strong> work great for seasonal or related collections without taking too much vertical space.</li>
          </ul>
        </div>
      </div>

      <PanelCard
        title="Shop page rows"
        description={
          query.data ? `${query.data.pagination.total} total` : 'Loading rows…'
        }
      >
        {query.isLoading ? (
          <p className="text-sm text-slate-400">Loading rows…</p>
        ) : query.isError ? (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {extractErrorMessage(query.error, 'Failed to load shop rows')}
          </p>
        ) : sections.length === 0 ? (
          <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-8 text-center">
            <p className="text-sm text-slate-400">No rows yet. Start building your shop layout.</p>
            <Button onClick={openChooser}>
              <Plus />
              Create your first row
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {sections.map((section, index) => (
              <ShopRowCard
                key={section.id}
                isFirst={index === 0}
                isLast={index === sections.length - 1}
                onDelete={() => handleDelete(section)}
                onEdit={() => openEditDialog(section)}
                onMove={(delta) => handleMove(section, delta)}
                section={section}
              />
            ))}
          </div>
        )}
      </PanelCard>

      <ShopRowTypeChooser
        onChoose={handleChooseType}
        onClose={closeDialog}
        open={dialog.kind === 'chooser'}
      />

      <ShopRowFormDialog
        editing={dialog.kind === 'product' ? dialog.editing : null}
        nextDisplayOrder={nextDisplayOrder}
        onClose={closeDialog}
        open={dialog.kind === 'product'}
        rowType={dialog.kind === 'product' ? dialog.rowType : 'grid'}
      />

      <ShopBannerDialog
        editing={dialog.kind === 'banner' ? dialog.editing : null}
        nextDisplayOrder={nextDisplayOrder}
        onClose={closeDialog}
        open={dialog.kind === 'banner'}
      />
    </div>
  )
}
