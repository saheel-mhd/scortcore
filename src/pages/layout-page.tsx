import { useState } from 'react'
import { Plus } from 'lucide-react'

import { extractErrorMessage } from '@/api/client'
import { usePageTitle } from '@/hooks/use-page-title'
import { BannerSectionDialog } from '@/modules/layout/components/banner-section-dialog'
import { SectionCard } from '@/modules/layout/components/section-card'
import { SectionFormDialog } from '@/modules/layout/components/section-form-dialog'
import { SectionTypeChooser } from '@/modules/layout/components/section-type-chooser'
import {
  useDeleteHomepageSection,
  useHomepageSections,
  useUpdateHomepageSection,
} from '@/modules/layout/hooks/use-homepage-sections'
import type { HomepageSection, SectionType } from '@/modules/layout/types/homepage-section.types'
import { PageHeader } from '@/shared/page-header'
import { PanelCard } from '@/shared/panel-card'
import { Button } from '@/ui/button'

type DialogState =
  | { kind: 'closed' }
  | { kind: 'chooser' }
  | { kind: 'product'; editing: HomepageSection | null }
  | { kind: 'banner'; editing: HomepageSection | null }

export default function LayoutPage() {
  usePageTitle('Layout')

  const [dialog, setDialog] = useState<DialogState>({ kind: 'closed' })

  const query = useHomepageSections({
    page: 1,
    limit: 100,
    sortBy: 'displayOrder',
    sortOrder: 'asc',
  })

  const updateMutation = useUpdateHomepageSection()
  const deleteMutation = useDeleteHomepageSection()

  const sections = query.data?.items ?? []
  const nextDisplayOrder =
    sections.length > 0
      ? Math.max(...sections.map((section) => section.displayOrder)) + 1
      : 0

  const openChooser = () => setDialog({ kind: 'chooser' })
  const closeDialog = () => setDialog({ kind: 'closed' })

  const openEditDialog = (section: HomepageSection) => {
    if (section.type === 'banner') {
      setDialog({ kind: 'banner', editing: section })
    } else {
      setDialog({ kind: 'product', editing: section })
    }
  }

  const handleChooseType = (type: SectionType) => {
    if (type === 'banner') {
      setDialog({ kind: 'banner', editing: null })
    } else {
      setDialog({ kind: 'product', editing: null })
    }
  }

  const handleMove = (section: HomepageSection, delta: -1 | 1) => {
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

  const handleDelete = (section: HomepageSection) => {
    if (!window.confirm(`Delete section "${section.title}"? This can't be undone.`)) return
    deleteMutation.mutate(section.id)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        badge="Store"
        title="Layout"
        description="Curate the store home page with product collections and banners. Add as many sections as you need."
        action={
          <Button onClick={openChooser}>
            <Plus />
            New section
          </Button>
        }
      />

      <PanelCard
        title="Home page sections"
        description={
          query.data ? `${query.data.pagination.total} total` : 'Loading sections…'
        }
      >
        {query.isLoading ? (
          <p className="text-sm text-slate-400">Loading sections…</p>
        ) : query.isError ? (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {extractErrorMessage(query.error, 'Failed to load sections')}
          </p>
        ) : sections.length === 0 ? (
          <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-8 text-center">
            <p className="text-sm text-slate-400">No sections yet.</p>
            <Button onClick={openChooser}>
              <Plus />
              Create your first section
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {sections.map((section, index) => (
              <SectionCard
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

      <SectionTypeChooser
        onChoose={handleChooseType}
        onClose={closeDialog}
        open={dialog.kind === 'chooser'}
      />

      <SectionFormDialog
        editing={dialog.kind === 'product' ? dialog.editing : null}
        nextDisplayOrder={nextDisplayOrder}
        onClose={closeDialog}
        open={dialog.kind === 'product'}
      />

      <BannerSectionDialog
        editing={dialog.kind === 'banner' ? dialog.editing : null}
        nextDisplayOrder={nextDisplayOrder}
        onClose={closeDialog}
        open={dialog.kind === 'banner'}
      />
    </div>
  )
}
