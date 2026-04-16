import { useMemo } from 'react'
import { Plus, Trash2 } from 'lucide-react'

import { useUnits } from '@/modules/units/hooks/use-units'
import type { VariantInput } from '@/modules/products/types/product.types'
import { Button } from '@/ui/button'

type Props = {
  variants: VariantInput[]
  onChange: (next: VariantInput[]) => void
}

const inputClasses =
  'rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-sky-400/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60'

export function ProductVariantsField({ variants, onChange }: Props) {
  const unitsQuery = useUnits({ page: 1, limit: 200, sortBy: 'name', sortOrder: 'asc' })
  const units = useMemo(() => unitsQuery.data?.items ?? [], [unitsQuery.data])

  const usedUnitIds = new Set(variants.map((v) => v.unitId))

  const handleAdd = () => {
    onChange([...variants, { unitId: '', stock: 0 }])
  }

  const handleUpdate = (index: number, partial: Partial<VariantInput>) => {
    onChange(variants.map((v, i) => (i === index ? { ...v, ...partial } : v)))
  }

  const handleRemove = (index: number) => {
    onChange(variants.filter((_, i) => i !== index))
  }

  return (
    <div className="lg:col-span-2 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Size variants <span className="text-sky-300">*</span>
          </p>
          <p className="text-xs text-slate-500">
            Pick one or more sizes from the Units library. Each size has its own stock.
          </p>
        </div>
        <Button
          disabled={units.length === 0}
          onClick={handleAdd}
          size="sm"
          type="button"
          variant="outline"
        >
          <Plus />
          Add size
        </Button>
      </div>

      {units.length === 0 && !unitsQuery.isLoading ? (
        <p className="rounded-xl border border-dashed border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
          No units defined yet. Go to Units in the sidebar to create categories (e.g. Alpha, Inches) and the individual units inside them first.
        </p>
      ) : null}

      {variants.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/10 bg-slate-950/40 p-4 text-center text-xs text-slate-500">
          No sizes yet. Click “Add size” to register a variant.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {variants.map((variant, index) => {
            const availableUnits = units.filter(
              (u) => u.id === variant.unitId || !usedUnitIds.has(u.id),
            )
            return (
              <li
                key={index}
                className="grid grid-cols-[1fr_7rem_auto] items-center gap-2 rounded-xl border border-white/10 bg-slate-950/40 p-3"
              >
                <select
                  aria-label={`Size for variant ${index + 1}`}
                  className={inputClasses}
                  onChange={(event) =>
                    handleUpdate(index, { unitId: event.target.value })
                  }
                  required
                  value={variant.unitId}
                >
                  <option value="" disabled>
                    Choose size…
                  </option>
                  {availableUnits.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name} ({unit.shortName}) — {unit.category.name}
                    </option>
                  ))}
                </select>

                <input
                  aria-label={`Stock for variant ${index + 1}`}
                  className={inputClasses}
                  min={0}
                  onChange={(event) =>
                    handleUpdate(index, { stock: Number(event.target.value) || 0 })
                  }
                  placeholder="Stock"
                  required
                  step={1}
                  type="number"
                  value={variant.stock}
                />

                <Button
                  aria-label={`Remove variant ${index + 1}`}
                  onClick={() => handleRemove(index)}
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                >
                  <Trash2 />
                </Button>
              </li>
            )
          })}
        </ul>
      )}

      <p className="text-xs text-slate-500">
        Stock changes here log an inventory movement per size.
      </p>
    </div>
  )
}
