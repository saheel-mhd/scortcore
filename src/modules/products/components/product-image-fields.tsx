import { ImageOff, Plus, Trash2 } from 'lucide-react'

import { Button } from '@/ui/button'

const inputClasses =
  'w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/50 focus:outline-none'

type Props = {
  cardImage: string
  onCardImageChange: (value: string) => void
  mainImage: string
  onMainImageChange: (value: string) => void
  galleryImages: string[]
  onGalleryImagesChange: (next: string[]) => void
}

export function ProductImageFields({
  cardImage,
  onCardImageChange,
  mainImage,
  onMainImageChange,
  galleryImages,
  onGalleryImagesChange,
}: Props) {
  const handleGalleryChange = (index: number, value: string) => {
    const next = [...galleryImages]
    next[index] = value
    onGalleryImagesChange(next)
  }

  const handleGalleryRemove = (index: number) => {
    onGalleryImagesChange(galleryImages.filter((_, i) => i !== index))
  }

  const handleGalleryAdd = () => {
    if (galleryImages.length >= 20) return
    onGalleryImagesChange([...galleryImages, ''])
  }

  return (
    <div className="flex flex-col gap-5 lg:col-span-2">
      <div className="grid gap-5 lg:grid-cols-2">
        <ImageField
          hint="Shown on the shop grid. Required."
          id="product-card-image"
          label="Card image"
          onChange={onCardImageChange}
          required
          value={cardImage}
        />
        <ImageField
          hint="Hero image on the product page. Required."
          id="product-main-image"
          label="Main image"
          onChange={onMainImageChange}
          required
          value={mainImage}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Gallery images</p>
            <p className="text-xs text-slate-500">
              Extra images shown on the product page. Up to 20.
            </p>
          </div>
          <Button
            disabled={galleryImages.length >= 20}
            onClick={handleGalleryAdd}
            size="sm"
            type="button"
            variant="outline"
          >
            <Plus />
            Add image
          </Button>
        </div>

        {galleryImages.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/10 bg-slate-950/40 px-4 py-6 text-center text-xs text-slate-500">
            No gallery images yet. Click “Add image” to include additional product photos.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {galleryImages.map((url, index) => (
              <li key={index} className="flex items-center gap-3">
                <ImagePreview size="sm" url={url} />
                <input
                  aria-label={`Gallery image ${index + 1}`}
                  className={inputClasses}
                  maxLength={2048}
                  onChange={(event) => handleGalleryChange(index, event.target.value)}
                  placeholder="https://…"
                  type="url"
                  value={url}
                />
                <Button
                  aria-label={`Remove gallery image ${index + 1}`}
                  onClick={() => handleGalleryRemove(index)}
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                >
                  <Trash2 />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

type ImageFieldProps = {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  hint: string
  required?: boolean
}

function ImageField({ id, label, value, onChange, hint, required }: ImageFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs uppercase tracking-[0.2em] text-slate-400" htmlFor={id}>
        {label}
        {required ? <span className="ml-1 text-sky-300">*</span> : null}
      </label>
      <div className="flex items-center gap-3">
        <ImagePreview url={value} />
        <input
          className={inputClasses}
          id={id}
          maxLength={2048}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://…"
          required={required}
          type="url"
          value={value}
        />
      </div>
      <p className="text-xs text-slate-500">{hint}</p>
    </div>
  )
}

type ImagePreviewProps = {
  url: string
  size?: 'sm' | 'md'
}

function ImagePreview({ url, size = 'md' }: ImagePreviewProps) {
  const box = size === 'sm' ? 'size-10' : 'size-14'

  if (!url) {
    return (
      <div
        className={`${box} flex shrink-0 items-center justify-center rounded-xl border border-dashed border-white/10 bg-slate-950/40 text-slate-600`}
      >
        <ImageOff className="size-4" />
      </div>
    )
  }

  return (
    <img
      alt=""
      className={`${box} shrink-0 rounded-xl border border-white/10 object-cover`}
      onError={(event) => {
        event.currentTarget.style.visibility = 'hidden'
      }}
      onLoad={(event) => {
        event.currentTarget.style.visibility = 'visible'
      }}
      src={url}
    />
  )
}
