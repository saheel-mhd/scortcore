import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/ui/button'

type Props = {
  page: number
  totalPages: number
  total: number
  limit: number
  onChange: (page: number) => void
}

export function PaginationControls({ page, totalPages, total, limit, onChange }: Props) {
  if (total === 0) return null

  const start = (page - 1) * limit + 1
  const end = Math.min(page * limit, total)

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-slate-400">
        Showing <span className="text-slate-200">{start}</span>–
        <span className="text-slate-200">{end}</span> of{' '}
        <span className="text-slate-200">{total}</span>
      </p>
      <div className="flex items-center gap-2">
        <Button
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          size="sm"
          variant="outline"
        >
          <ChevronLeft />
          Previous
        </Button>
        <span className="text-xs text-slate-400">
          Page {page} / {Math.max(totalPages, 1)}
        </span>
        <Button
          aria-label="Next page"
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
          size="sm"
          variant="outline"
        >
          Next
          <ChevronRight />
        </Button>
      </div>
    </div>
  )
}
