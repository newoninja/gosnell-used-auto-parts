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
import { Loader2 } from 'lucide-react'

interface PartFormProps {
  defaultValues?: Partial<PartSchemaInput> & { photos?: string[] }
  partId?: string
  onSubmit: (data: PartSchemaOutput & { photos: string[] }) => Promise<void>
  submitLabel?: string
}

const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear - 1900 + 2 }, (_, i) => currentYear + 1 - i)

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
      // Zod has applied defaults by this point — safe to cast
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
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {submitError && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{submitError}</div>
      )}

      {/* Vehicle Info */}
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Vehicle Info
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="vin" className="mb-1.5 block text-sm font-medium text-slate-700">
              VIN
            </label>
            <div className="flex gap-2">
              <Input id="vin" {...register('vin')} placeholder="17-character VIN (optional)" className="flex-1" />
              <Button type="button" variant="outline" size="sm" onClick={handleVinDecode}>
                Decode
              </Button>
            </div>
            {errors.vin && <p className="mt-1 text-xs text-red-600">{errors.vin.message}</p>}
          </div>

          <div>
            <label htmlFor="vehicleYear" className="mb-1.5 block text-sm font-medium text-slate-700">
              Year *
            </label>
            <select
              id="vehicleYear"
              {...register('vehicleYear', { valueAsNumber: true })}
              className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
              <option value="">Select year</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            {errors.vehicleYear && <p className="mt-1 text-xs text-red-600">{errors.vehicleYear.message}</p>}
          </div>

          <div>
            <label htmlFor="vehicleMake" className="mb-1.5 block text-sm font-medium text-slate-700">
              Make *
            </label>
            <Input id="vehicleMake" {...register('vehicleMake')} placeholder="e.g. Ford" />
            {errors.vehicleMake && <p className="mt-1 text-xs text-red-600">{errors.vehicleMake.message}</p>}
          </div>

          <div>
            <label htmlFor="vehicleModel" className="mb-1.5 block text-sm font-medium text-slate-700">
              Model *
            </label>
            <Input id="vehicleModel" {...register('vehicleModel')} placeholder="e.g. F-150" />
            {errors.vehicleModel && <p className="mt-1 text-xs text-red-600">{errors.vehicleModel.message}</p>}
          </div>

          <div>
            <label htmlFor="vehicleTrim" className="mb-1.5 block text-sm font-medium text-slate-700">
              Trim
            </label>
            <Input id="vehicleTrim" {...register('vehicleTrim')} placeholder="e.g. XLT (optional)" />
          </div>
        </div>
      </section>

      {/* Part Info */}
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Part Info
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">
              Part Name *
            </label>
            <Input id="name" {...register('name')} placeholder="e.g. Engine Assembly" />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-slate-700">
              Category *
            </label>
            <select
              id="category"
              {...register('category')}
              className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
              <option value="">Select category</option>
              {PART_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{PART_CATEGORY_LABELS[cat]}</option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category.message}</p>}
          </div>

          <div>
            <label htmlFor="condition" className="mb-1.5 block text-sm font-medium text-slate-700">
              Condition *
            </label>
            <select
              id="condition"
              {...register('condition')}
              className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
              <option value="">Select condition</option>
              {PART_CONDITIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.condition && <p className="mt-1 text-xs text-red-600">{errors.condition.message}</p>}
          </div>

          <div>
            <label htmlFor="price" className="mb-1.5 block text-sm font-medium text-slate-700">
              Price (cents) *
            </label>
            <Input
              id="price"
              type="number"
              {...register('price', { valueAsNumber: true })}
              placeholder="e.g. 18500 = $185.00"
            />
            {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price.message}</p>}
          </div>

          <div>
            <label htmlFor="mileage" className="mb-1.5 block text-sm font-medium text-slate-700">
              Mileage
            </label>
            <Input
              id="mileage"
              type="number"
              {...register('mileage', { valueAsNumber: true })}
              placeholder="e.g. 85000 (optional)"
            />
          </div>
        </div>
      </section>

      {/* Location & Status */}
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Location & Status
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="yardLocation" className="mb-1.5 block text-sm font-medium text-slate-700">
              Yard Location *
            </label>
            <Input id="yardLocation" {...register('yardLocation')} placeholder="e.g. Row 4, Section B" />
            {errors.yardLocation && <p className="mt-1 text-xs text-red-600">{errors.yardLocation.message}</p>}
          </div>

          <div>
            <label htmlFor="stockStatus" className="mb-1.5 block text-sm font-medium text-slate-700">
              Status
            </label>
            <select
              id="stockStatus"
              {...register('stockStatus')}
              className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
              {STOCK_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="addedBy" className="mb-1.5 block text-sm font-medium text-slate-700">
              Added By *
            </label>
            <select
              id="addedBy"
              {...register('addedBy')}
              className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
              <option value="">Select staff member</option>
              {BUSINESS.staff.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            {errors.addedBy && <p className="mt-1 text-xs text-red-600">{errors.addedBy.message}</p>}
          </div>
        </div>
      </section>

      {/* Photos */}
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
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
          <p className="text-sm text-slate-500">
            Save the part first, then you can add photos.
          </p>
        )}
      </section>

      {/* Notes */}
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Notes
        </h2>
        <textarea
          {...register('notes')}
          rows={4}
          placeholder="Any additional details about this part..."
          className="flex w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 resize-none"
        />
        {errors.notes && <p className="mt-1 text-xs text-red-600">{errors.notes.message}</p>}
      </section>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={submitting || uploading}>
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
