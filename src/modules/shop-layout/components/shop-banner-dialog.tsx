import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Loader2, X } from 'lucide-react'

import { extractErrorMessage } from '@/api/client'
import {
  useCreateShopSection,
  useUpdateShopSection,
} from '@/modules/shop-layout/hooks/use-shop-sections'
import type { ShopRowBannerConfig, ShopSection } from '@/modules/shop-layout/types/shop-section.types'
import { Button } from '@/ui/button'

type Props = {
  open: boolean
  editing: ShopSection | null
  nextDisplayOrder: number
  onClose: () => void
}

type Alignment = 'left' | 'center' | 'right'

const inputClasses =
  'w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/50 focus:outline-none'

const defaultConfig: ShopRowBannerConfig = {
  backgroundImage: '',
  backgroundColor: '#0f172a',
  textColor: '#ffffff',
  height: 400,
  contentAlign: 'center',
  ctaLabel: '',
  ctaHref: '',
}

export function ShopBannerDialog({ open, editing, nextDisplayOrder, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [displayOrder, setDisplayOrder] = useState(0)
  const [config, setConfig] = useState<ShopRowBannerConfig>(defaultConfig)

  const createMutation = useCreateShopSection()
  const updateMutation = useUpdateShopSection()
  const isPending = createMutation.isPending || updateMutation.isPending
  const error = createMutation.error ?? updateMutation.error

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
      setTitle(editing?.title ?? '')
      setDescription(editing?.description ?? '')
      setIsActive(editing?.isActive ?? true)
      setDisplayOrder(editing?.displayOrder ?? nextDisplayOrder)
      setConfig({ ...defaultConfig, ...(editing?.bannerConfig ?? {}) })
      createMutation.reset()
      updateMutation.reset()
    }

    if (!open && dialog.open) {
      dialog.close()
    }
  }, [open, editing, nextDisplayOrder, createMutation, updateMutation])

  const updateConfig = <K extends keyof ShopRowBannerConfig>(key: K, value: ShopRowBannerConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedDescription = description.trim()
    const cleanedConfig: ShopRowBannerConfig = {
      contentAlign: config.contentAlign,
      height: config.height,
    }
    if (config.backgroundImage?.trim())
      cleanedConfig.backgroundImage = config.backgroundImage.trim()
    if (config.backgroundColor) cleanedConfig.backgroundColor = config.backgroundColor
    if (config.textColor) cleanedConfig.textColor = config.textColor
    if (config.ctaLabel?.trim()) cleanedConfig.ctaLabel = config.ctaLabel.trim()
    if (config.ctaHref?.trim()) cleanedConfig.ctaHref = config.ctaHref.trim()

    const payload = {
      title: title.trim(),
      type: 'banner' as const,
      bannerConfig: cleanedConfig,
      productIds: [],
      isActive,
      displayOrder,
      ...(trimmedDescription ? { description: trimmedDescription } : {}),
    }

    if (editing) {
      updateMutation.mutate(
        { id: editing.id, input: payload },
        { onSuccess: onClose },
      )
    } else {
      createMutation.mutate(payload, { onSuccess: onClose })
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-auto h-fit w-fit max-w-[90vw] rounded-3xl border border-white/10 bg-slate-950/95 p-0 text-white backdrop:bg-slate-950/70 backdrop:backdrop-blur-sm"
      onClose={onClose}
    >
      <form className="flex w-[min(44rem,92vw)] flex-col gap-5 p-6" onSubmit={handleSubmit}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Shop · Banner</p>
            <h2 className="mt-1 text-lg font-semibold">
              {editing ? 'Edit banner' : 'New banner'}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              A full-width promotional banner for the shop page.
            </p>
          </div>
          <Button aria-label="Close" onClick={onClose} size="icon-sm" type="button" variant="ghost">
            <X />
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
          <Field label="Title" htmlFor="shop-banner-title" required>
            <input
              autoFocus
              className={inputClasses}
              id="shop-banner-title"
              maxLength={120}
              minLength={2}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Flash sale this weekend"
              required
              type="text"
              value={title}
            />
          </Field>
          <Field label="Order" htmlFor="shop-banner-order">
            <input
              className={inputClasses}
              id="shop-banner-order"
              min={0}
              onChange={(event) => setDisplayOrder(Number(event.target.value) || 0)}
              step={1}
              type="number"
              value={displayOrder}
            />
          </Field>
        </div>

        <Field label="Description" htmlFor="shop-banner-description">
          <textarea
            className={`${inputClasses} min-h-20`}
            id="shop-banner-description"
            maxLength={500}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Short supporting line shown under the title."
            value={description}
          />
        </Field>

        <Field label="Active" htmlFor="shop-banner-active">
          <label className="inline-flex items-center gap-3 text-sm text-slate-200">
            <input
              checked={isActive}
              className="size-4 rounded border-white/20 bg-slate-950 text-sky-400 focus:ring-sky-400/50"
              id="shop-banner-active"
              onChange={(event) => setIsActive(event.target.checked)}
              type="checkbox"
            />
            {isActive ? 'Visible on the shop' : 'Hidden'}
          </label>
        </Field>

        <Field label="Background image URL" htmlFor="shop-banner-bg-image">
          <input
            className={inputClasses}
            id="shop-banner-bg-image"
            maxLength={2048}
            onChange={(event) => updateConfig('backgroundImage', event.target.value)}
            placeholder="https://…"
            type="url"
            value={config.backgroundImage ?? ''}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Background color" htmlFor="shop-banner-bg-color">
            <ColorInput
              id="shop-banner-bg-color"
              onChange={(value) => updateConfig('backgroundColor', value)}
              value={config.backgroundColor ?? '#0f172a'}
            />
          </Field>
          <Field label="Text color" htmlFor="shop-banner-text-color">
            <ColorInput
              id="shop-banner-text-color"
              onChange={(value) => updateConfig('textColor', value)}
              value={config.textColor ?? '#ffffff'}
            />
          </Field>
          <Field label="Height (px)" htmlFor="shop-banner-height">
            <input
              className={inputClasses}
              id="shop-banner-height"
              max={1200}
              min={120}
              onChange={(event) => updateConfig('height', Number(event.target.value) || 400)}
              step={10}
              type="number"
              value={config.height ?? 400}
            />
          </Field>
        </div>

        <Field label="Text alignment" htmlFor="shop-banner-content-align">
          <Segmented
            id="shop-banner-content-align"
            onChange={(value) => updateConfig('contentAlign', value)}
            options={[
              { label: 'Left', value: 'left' },
              { label: 'Center', value: 'center' },
              { label: 'Right', value: 'right' },
            ]}
            value={config.contentAlign ?? 'center'}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Button label" htmlFor="shop-banner-cta-label" hint="Leave empty to hide the button.">
            <input
              className={inputClasses}
              id="shop-banner-cta-label"
              maxLength={60}
              onChange={(event) => updateConfig('ctaLabel', event.target.value)}
              placeholder="Shop now"
              type="text"
              value={config.ctaLabel ?? ''}
            />
          </Field>
          <Field label="Button link" htmlFor="shop-banner-cta-href">
            <input
              className={inputClasses}
              id="shop-banner-cta-href"
              maxLength={500}
              onChange={(event) => updateConfig('ctaHref', event.target.value)}
              placeholder="/products"
              type="text"
              value={config.ctaHref ?? ''}
            />
          </Field>
        </div>

        {error ? (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {extractErrorMessage(error, 'Unable to save banner')}
          </p>
        ) : null}

        <div className="flex justify-end gap-2">
          <Button disabled={isPending} onClick={onClose} type="button" variant="outline">
            Cancel
          </Button>
          <Button disabled={isPending} type="submit">
            {isPending ? (
              <>
                <Loader2 className="animate-spin" />
                Saving…
              </>
            ) : editing ? 'Save changes' : 'Create banner'}
          </Button>
        </div>
      </form>
    </dialog>
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

type SegmentedProps = {
  id: string
  value: Alignment
  options: { label: string; value: Alignment }[]
  onChange: (value: Alignment) => void
}

function Segmented({ id, value, options, onChange }: SegmentedProps) {
  return (
    <div
      aria-labelledby={id}
      className="inline-flex items-center overflow-hidden rounded-xl border border-white/10 bg-slate-950/60 p-1"
      role="group"
    >
      {options.map((option) => {
        const isActive = option.value === value
        return (
          <button
            key={option.value}
            className={[
              'rounded-lg px-3 py-1.5 text-xs font-medium transition',
              isActive ? 'bg-white text-slate-950' : 'text-slate-300 hover:text-white',
            ].join(' ')}
            onClick={() => onChange(option.value)}
            type="button"
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

type ColorInputProps = {
  id: string
  value: string
  onChange: (value: string) => void
}

function ColorInput({ id, value, onChange }: ColorInputProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        aria-label="Pick a color"
        className="size-10 cursor-pointer rounded-xl border border-white/10 bg-transparent"
        id={id}
        onChange={(event) => onChange(event.target.value)}
        type="color"
        value={value}
      />
      <input
        className="h-10 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 font-mono text-sm text-white focus:border-sky-400/50 focus:outline-none"
        maxLength={9}
        onChange={(event) => onChange(event.target.value)}
        pattern="#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})"
        type="text"
        value={value}
      />
    </div>
  )
}
