import { useState, type FormEvent } from 'react'
import { Loader2, Save } from 'lucide-react'

import { extractErrorMessage } from '@/api/client'
import type {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from '@/modules/products/types/product.types'
import { Button } from '@/ui/button'

type CreateSubmit = (input: CreateProductInput) => void
type UpdateSubmit = (input: UpdateProductInput) => void

type Props =
  | {
      mode: 'create'
      onSubmit: CreateSubmit
      isSubmitting: boolean
      error?: unknown
      submitLabel?: string
    }
  | {
      mode: 'edit'
      product: Product
      onSubmit: UpdateSubmit
      isSubmitting: boolean
      error?: unknown
      submitLabel?: string
    }

const inputClasses =
  'w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60'

export function ProductForm(props: Props) {
  const initial = props.mode === 'edit' ? props.product : undefined

  const [name, setName] = useState(initial?.name ?? '')
  const [slug, setSlug] = useState(initial?.slug ?? '')
  const [sku, setSku] = useState(initial?.sku ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [price, setPrice] = useState(
    initial ? String(initial.price) : ''
  )
  const [stock, setStock] = useState(initial ? String(initial.stock) : '0')
  const [isActive, setIsActive] = useState(initial?.isActive ?? true)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedSlug = slug.trim()
    const trimmedDescription = description.trim()
    const priceNumber = Number(price)
    const stockNumber = Number(stock)

    const common = {
      name: name.trim(),
      sku: sku.trim(),
      price: priceNumber,
      isActive,
      ...(trimmedSlug ? { slug: trimmedSlug } : {}),
      ...(trimmedDescription ? { description: trimmedDescription } : {}),
    }

    if (props.mode === 'create') {
      props.onSubmit({
        ...common,
        stock: stockNumber,
      })
      return
    }

    props.onSubmit(common)
  }

  return (
    <form className="grid gap-5 lg:grid-cols-2" onSubmit={handleSubmit}>
      <Field label="Name" htmlFor="product-name" required>
        <input
          autoFocus
          className={inputClasses}
          id="product-name"
          maxLength={150}
          minLength={3}
          onChange={(event) => setName(event.target.value)}
          placeholder="Wireless headphones"
          required
          type="text"
          value={name}
        />
      </Field>

      <Field
        label="SKU"
        htmlFor="product-sku"
        required
        hint="Uppercase letters, digits, or _ -"
      >
        <input
          className={inputClasses}
          id="product-sku"
          maxLength={50}
          minLength={3}
          onChange={(event) => setSku(event.target.value.toUpperCase())}
          pattern="[A-Z0-9_-]+"
          placeholder="SKU-001"
          required
          type="text"
          value={sku}
        />
      </Field>

      <Field
        label="Slug"
        htmlFor="product-slug"
        hint="Auto-generated from name if left blank."
      >
        <input
          className={inputClasses}
          id="product-slug"
          maxLength={120}
          onChange={(event) => setSlug(event.target.value.toLowerCase())}
          pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
          placeholder="wireless-headphones"
          type="text"
          value={slug}
        />
      </Field>

      <Field label="Price" htmlFor="product-price" required>
        <input
          className={inputClasses}
          id="product-price"
          min={0}
          onChange={(event) => setPrice(event.target.value)}
          placeholder="0.00"
          required
          step={0.01}
          type="number"
          value={price}
        />
      </Field>

      <Field
        label="Stock"
        htmlFor="product-stock"
        hint={
          props.mode === 'edit'
            ? 'Use "Adjust stock" to change inventory (it logs a movement).'
            : 'Starting quantity for this product.'
        }
      >
        <input
          className={inputClasses}
          disabled={props.mode === 'edit'}
          id="product-stock"
          min={0}
          onChange={(event) => setStock(event.target.value)}
          placeholder="0"
          step={1}
          type="number"
          value={stock}
        />
      </Field>

      <Field
        label="Active"
        htmlFor="product-is-active"
        hint="Inactive products are hidden from the store."
      >
        <label className="inline-flex items-center gap-3 text-sm text-slate-200">
          <input
            checked={isActive}
            className="size-4 rounded border-white/20 bg-slate-950 text-sky-400 focus:ring-sky-400/50"
            id="product-is-active"
            onChange={(event) => setIsActive(event.target.checked)}
            type="checkbox"
          />
          {isActive ? 'Active' : 'Inactive'}
        </label>
      </Field>

      <div className="lg:col-span-2">
        <Field label="Description" htmlFor="product-description">
          <textarea
            className={`${inputClasses} min-h-32`}
            id="product-description"
            maxLength={2000}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Optional details shown to customers."
            value={description}
          />
        </Field>
      </div>

      {props.error ? (
        <p className="lg:col-span-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {extractErrorMessage(props.error, 'Unable to save product')}
        </p>
      ) : null}

      <div className="flex justify-end lg:col-span-2">
        <Button disabled={props.isSubmitting} size="lg" type="submit">
          {props.isSubmitting ? (
            <>
              <Loader2 className="animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save />
              {props.submitLabel ?? (props.mode === 'create' ? 'Create product' : 'Save changes')}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

type FieldProps = {
  label: string
  htmlFor: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}

function Field({ label, htmlFor, hint, required, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs uppercase tracking-[0.2em] text-slate-400" htmlFor={htmlFor}>
        {label}
        {required ? <span className="ml-1 text-sky-300">*</span> : null}
      </label>
      {children}
      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
    </div>
  )
}
