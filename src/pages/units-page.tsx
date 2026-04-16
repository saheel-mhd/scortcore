import { useState } from 'react'
import { Plus } from 'lucide-react'

import { extractErrorMessage } from '@/api/client'
import { usePageTitle } from '@/hooks/use-page-title'
import { UnitCategoriesTable } from '@/modules/units/components/unit-categories-table'
import { UnitCategoryFormDialog } from '@/modules/units/components/unit-category-form-dialog'
import { UnitFormDialog } from '@/modules/units/components/unit-form-dialog'
import { UnitsTable } from '@/modules/units/components/units-table'
import {
  useDeleteUnitCategory,
  useUnitCategories,
} from '@/modules/units/hooks/use-unit-categories'
import { useDeleteUnit, useUnits } from '@/modules/units/hooks/use-units'
import type { Unit, UnitCategory } from '@/modules/units/types/unit.types'
import { PageHeader } from '@/shared/page-header'
import { PanelCard } from '@/shared/panel-card'
import { Button } from '@/ui/button'

export default function UnitsPage() {
  usePageTitle('Units')

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<UnitCategory | null>(null)

  const [unitDialogOpen, setUnitDialogOpen] = useState(false)
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null)

  const categoriesQuery = useUnitCategories({
    page: 1,
    limit: 100,
    sortBy: 'name',
    sortOrder: 'asc',
  })
  const unitsQuery = useUnits({
    page: 1,
    limit: 200,
    sortBy: 'name',
    sortOrder: 'asc',
  })

  const deleteCategoryMutation = useDeleteUnitCategory()
  const deleteUnitMutation = useDeleteUnit()

  const openCategoryDialog = (category: UnitCategory | null) => {
    setEditingCategory(category)
    setCategoryDialogOpen(true)
  }
  const closeCategoryDialog = () => {
    setCategoryDialogOpen(false)
    setEditingCategory(null)
  }

  const openUnitDialog = (unit: Unit | null) => {
    setEditingUnit(unit)
    setUnitDialogOpen(true)
  }
  const closeUnitDialog = () => {
    setUnitDialogOpen(false)
    setEditingUnit(null)
  }

  const handleDeleteCategory = (category: UnitCategory) => {
    if (!window.confirm(`Delete category "${category.name}"? Units in it will also be removed.`)) return
    deleteCategoryMutation.mutate(category.id)
  }

  const handleDeleteUnit = (unit: Unit) => {
    if (!window.confirm(`Delete unit "${unit.name}"?`)) return
    deleteUnitMutation.mutate(unit.id)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        badge="Catalog"
        title="Units"
        description="Define measurement systems (Alpha, Inches, Milliliters) and the units inside them."
      />

      <PanelCard
        title="Categories"
        description={
          categoriesQuery.data ? `${categoriesQuery.data.pagination.total} total` : 'Loading…'
        }
        action={
          <Button onClick={() => openCategoryDialog(null)}>
            <Plus />
            New category
          </Button>
        }
      >
        {categoriesQuery.isLoading ? (
          <p className="text-sm text-slate-400">Loading categories…</p>
        ) : categoriesQuery.isError ? (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {extractErrorMessage(categoriesQuery.error, 'Failed to load categories')}
          </p>
        ) : categoriesQuery.data ? (
          <UnitCategoriesTable
            deletingId={
              deleteCategoryMutation.isPending ? deleteCategoryMutation.variables ?? null : null
            }
            items={categoriesQuery.data.items}
            onDelete={handleDeleteCategory}
            onEdit={openCategoryDialog}
          />
        ) : null}
      </PanelCard>

      <PanelCard
        title="Units"
        description={unitsQuery.data ? `${unitsQuery.data.pagination.total} total` : 'Loading…'}
        action={
          <Button onClick={() => openUnitDialog(null)}>
            <Plus />
            New unit
          </Button>
        }
      >
        {unitsQuery.isLoading ? (
          <p className="text-sm text-slate-400">Loading units…</p>
        ) : unitsQuery.isError ? (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {extractErrorMessage(unitsQuery.error, 'Failed to load units')}
          </p>
        ) : unitsQuery.data ? (
          <UnitsTable
            deletingId={
              deleteUnitMutation.isPending ? deleteUnitMutation.variables ?? null : null
            }
            items={unitsQuery.data.items}
            onDelete={handleDeleteUnit}
            onEdit={openUnitDialog}
          />
        ) : null}
      </PanelCard>

      <UnitCategoryFormDialog
        editing={editingCategory}
        onClose={closeCategoryDialog}
        open={categoryDialogOpen}
      />
      <UnitFormDialog editing={editingUnit} onClose={closeUnitDialog} open={unitDialogOpen} />
    </div>
  )
}
