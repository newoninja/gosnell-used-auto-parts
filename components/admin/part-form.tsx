'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { partSchema, type PartSchemaInput, type PartSchemaOutput } from '@/lib/schemas/part'
import { uploadPartImage, deletePartImage } from '@/lib/firebase/parts'
import { PART_CATEGORIES, PART_CATEGORY_LABELS, PART_CONDITIONS, STOCK_STATUSES } from '@/lib/types/inventory'
import { BUSINESS } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ImageUpload } from './image-upload'
import { Loader2, Search } from 'lucide-react'

interface PartFormProps {
  defaultValues?: Partial<PartSchemaInput> & { photos?: string[] }
  partId?: string
  onSubmit: (data: PartSchemaOutput & { photos: string[] }) => Promise<void>
  submitLabel?: string
}

const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear - 1900 + 2 }, (_, i) => currentYear + 1 - i)

const selectClass =
  'flex h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2'

export function PartForm({ defaultValues, partId, onSubmit, submitLabel = 'Save Part' }: PartFormProps) {
  const [photos, setPhotos] = useState<string[]>(defaultValues?.photos ?? [])
  const [uploading, setUploading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PartSchemaInput>({
    resolver: zodResolver(partSchema),
    defaultValues: {
      name: '',
      category: undefined,
      vin: '',
      vehicleYear: undefined,
      vehicleMake: '',
      vehicleModel: '',
      vehicleTrim: '',
      condition: undefined,
      price: undefined,
      mileage: undefined,
      yardLocation: '',
      stockStatus: 'Available',
      notes: '',
      addedBy: '',
      ...defaultValues,
    },
  })

  async function handleAddPhotos(files: File[]) {
    if (!partId) return
    setUploading(true)
    try {
      const urls = await Promise.all(files.map((f) => uploadPartImage(partId, f)))
      setPhotos((prev) => [...prev, ...urls])
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploading(false)
    }
  }

  async function handleRemovePhoto(index: number) {
    const url = photos[index]
    await deletePartImage(url)
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleFormSubmit(data: PartSchemaInput) {
    setSubmitError('')
    setSubmitting(true)
    try {
      await onSubmit({ ...(data as PartSchemaOutput), photos })
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  // VIN decode
  async function handleVinDecode() {
    const vinInput = (document.getElementById('vin') as HTMLInputElement)?.value
    if (!vinInput || vinInput.length !== 17) return

    try {
      const res = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vinInput}?format=json`
      )
      const json = await res.json()
      const result = json.Results?.[0]
      if (result) {
        if (result.ModelYear) setValue('vehicleYear', parseInt(result.ModelYear))
        if (result.Make) setValue('vehicleMake', result.Make)
        if (result.Model) setValue('vehicleModel', result.Model)
        if (result.Trim) setValue('vehicleTrim', result.Trim)
      }
    } catch {
      // Silently fail — manual entry still works
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-10">
      {submitError && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-5 py-4 text-base text-red-600 font-medium">
          {submitError}
        </div>
      )}

      {/* Photos FIRST — most important on mobile */}
      <section>
        <h2 className="mb-4 text-base font-bold uppercase tracking-wide text-slate-700">
          Photos
        </h2>
        {partId ? (
          <ImageUpload
            images={photos}
            onAdd={handleAddPhotos}
            onRemove={handleRemovePhoto}
            uploading={uploading}
          />
        ) : (
          <p className="text-base text-slate-500">
            Save the part first, then you can add photos.
          </p>
        )}
      </section>

      {/* Vehicle Info */}
      <section>
        <h2 className="mb-4 text-base font-bold uppercase tracking-wide text-slate-700">
          Vehicle Info
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="vin" className="mb-2 block text-base font-semibold text-slate-700">
              VIN
            </label>
            <div className="flex gap-2">
              <Input id="vin" {...register('vin')} placeholder="17-character VIN (optional)" className="flex-1" />
              <Button type="button" variant="outline" onClick={handleVinDecode} className="h-12 px-4 shrink-0">
                <Search className="h-4 w-4" />
                Decode
              </Button>
            </div>
            {errors.vin && <p className="mt-2 text-sm text-red-600 font-medium">{errors.vin.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="vehicleYear" className="mb-2 block text-base font-semibold text-slate-700">
                Year *
              </label>
              <select id="vehicleYear" {...register('vehicleYear', { valueAsNumber: true })} className={selectClass}>
                <option value="">Select year</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              {errors.vehicleYear && <p className="mt-2 text-sm text-red-600 font-medium">{errors.vehicleYear.message}</p>}
            </div>

            <div>
              <label htmlFor="vehicleMake" className="mb-2 block text-base font-semibold text-slate-700">
                Make *
              </label>
              <Input id="vehicleMake" {...register('vehicleMake')} placeholder="e.g. Ford" />
              {errors.vehicleMake && <p className="mt-2 text-sm text-red-600 font-medium">{errors.vehicleMake.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="vehicleModel" className="mb-2 block text-base font-semibold text-slate-700">
                Model *
              </label>
              <Input id="vehicleModel" {...register('vehicleModel')} placeholder="e.g. F-150" />
              {errors.vehicleModel && <p className="mt-2 text-sm text-red-600 font-medium">{errors.vehicleModel.message}</p>}
            </div>

            <div>
              <label htmlFor="vehicleTrim" className="mb-2 block text-base font-semibold text-slate-700">
                Trim
              </label>
              <Input id="vehicleTrim" {...register('vehicleTrim')} placeholder="e.g. XLT" />
            </div>
          </div>
        </div>
      </section>

      {/* Part Info */}
      <section>
        <h2 className="mb-4 text-base font-bold uppercase tracking-wide text-slate-700">
          Part Info
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-2 block text-base font-semibold text-slate-700">
              Part Name *
            </label>
            <Input id="name" {...register('name')} placeholder="e.g. Engine Assembly" />
            {errors.name && <p className="mt-2 text-sm text-red-600 font-medium">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="category" className="mb-2 block text-base font-semibold text-slate-700">
                Category *
              </label>
              <select id="category" {...register('category')} className={selectClass}>
                <option value="">Select category</option>
                {PART_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{PART_CATEGORY_LABELS[cat]}</option>
                ))}
              </select>
              {errors.category && <p className="mt-2 text-sm text-red-600 font-medium">{errors.category.message}</p>}
            </div>

            <div>
              <label htmlFor="condition" className="mb-2 block text-base font-semibold text-slate-700">
                Condition *
              </label>
              <select id="condition" {...register('condition')} className={selectClass}>
                <option value="">Select</option>
                {PART_CONDITIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.condition && <p className="mt-2 text-sm text-red-600 font-medium">{errors.condition.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="price" className="mb-2 block text-base font-semibold text-slate-700">
                Price (cents) *
              </label>
              <Input
                id="price"
                type="number"
                {...register('price', { valueAsNumber: true })}
                placeholder="e.g. 18500 = $185"
              />
              {errors.price && <p className="mt-2 text-sm text-red-600 font-medium">{errors.price.message}</p>}
            </div>

            <div>
              <label htmlFor="mileage" className="mb-2 block text-base font-semibold text-slate-700">
                Mileage
              </label>
              <Input
                id="mileage"
                type="number"
                {...register('mileage', { valueAsNumber: true })}
                placeholder="Optional"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Location & Status */}
      <section>
        <h2 className="mb-4 text-base font-bold uppercase tracking-wide text-slate-700">
          Location & Status
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="yardLocation" className="mb-2 block text-base font-semibold text-slate-700">
                Yard Location *
              </label>
              <Input id="yardLocation" {...register('yardLocation')} placeholder="e.g. Row 4, B" />
              {errors.yardLocation && <p className="mt-2 text-sm text-red-600 font-medium">{errors.yardLocation.message}</p>}
            </div>

            <div>
              <label htmlFor="stockStatus" className="mb-2 block text-base font-semibold text-slate-700">
                Status
              </label>
              <select id="stockStatus" {...register('stockStatus')} className={selectClass}>
                {STOCK_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="addedBy" className="mb-2 block text-base font-semibold text-slate-700">
              Added By *
            </label>
            <select id="addedBy" {...register('addedBy')} className={selectClass}>
              <option value="">Who is adding this?</option>
              {BUSINESS.staff.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            {errors.addedBy && <p className="mt-2 text-sm text-red-600 font-medium">{errors.addedBy.message}</p>}
          </div>
        </div>
      </section>

      {/* Notes */}
      <section>
        <h2 className="mb-4 text-base font-bold uppercase tracking-wide text-slate-700">
          Notes
        </h2>
        <textarea
          {...register('notes')}
          rows={4}
          placeholder="Any additional details about this part..."
          className="flex w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-800 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 resize-none"
        />
        {errors.notes && <p className="mt-2 text-sm text-red-600 font-medium">{errors.notes.message}</p>}
      </section>

      {/* Submit — big and obvious */}
      <div className="sticky bottom-16 z-10 -mx-4 bg-white/95 backdrop-blur-sm border-t border-slate-200 px-4 py-4 md:static md:mx-0 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
        <Button type="submit" size="xl" disabled={submitting || uploading} className="w-full md:w-auto">
          {submitting && <Loader2 className="h-5 w-5 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
