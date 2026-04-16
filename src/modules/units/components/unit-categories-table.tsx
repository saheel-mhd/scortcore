import { Pencil, Trash2 } from 'lucide-react'

import type { UnitCategory } from '@/modules/units/types/unit.types'
import { Button } from '@/ui/button'

type Props = {
  items: UnitCategory[]
  onEdit: (category: UnitCategory) => void
  onDelete: (category: UnitCategory) => void
  deletingId: string | null
}

export function UnitCategoriesTable({ items, onEdit, onDelete, deletingId }: Props) {
  if (items.length === 0) {
    return (
      <div className="flex min-h-32 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-6 text-center">
        <p className="text-sm text-slate-400">
          No categories yet. Create one to group units like Alpha, Inches or Milliliters.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <table className="min-w-full divide-y divide-white/5 text-sm">
        <thead className="bg-slate-950/70 text-left text-xs uppercase tracking-[0.2em] text-slate-400">
          <tr>
            <Th>Name</Th>
            <Th>Short name</Th>
            <Th>Description</Th>
            <Th className="text-right">Actions</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 bg-slate-950/40">
          {items.map((item) => (
            <tr key={item.id} className="text-slate-200">
              <Td>
                <span className="font-medium text-white">{item.name}</span>
              </Td>
              <Td>
                <code className="rounded bg-white/5 px-2 py-0.5 text-xs text-slate-300">
                  {item.shortName}
                </code>
              </Td>
              <Td className="max-w-sm truncate text-slate-400">{item.description ?? '—'}</Td>
              <Td className="text-right">
                <div className="inline-flex items-center gap-1">
                  <Button
                    aria-label={`Edit ${item.name}`}
                    onClick={() => onEdit(item)}
                    size="icon-sm"
                    variant="ghost"
                  >
                    <Pencil />
                  </Button>
                  <Button
                    aria-label={`Delete ${item.name}`}
                    disabled={deletingId === item.id}
                    onClick={() => onDelete(item)}
                    size="icon-sm"
                    variant="destructive"
                  >
                    <Trash2 />
                  </Button>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-4 py-3 font-medium ${className ?? ''}`}>{children}</th>
}

function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 ${className ?? ''}`}>{children}</td>
}
