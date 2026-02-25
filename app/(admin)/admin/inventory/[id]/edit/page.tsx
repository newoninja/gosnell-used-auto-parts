'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getPart, updatePart } from '@/lib/firebase/parts'
import { PartForm } from '@/components/admin/part-form'
import type { Part } from '@/lib/types/inventory'
import type { PartSchemaOutput } from '@/lib/schemas/part'

export default function EditPartPage() {
  const params = useParams()
  const router = useRouter()
  const partId = params.id as string

  const [part, setPart] = useState<Part | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPart(partId)
      .then(setPart)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [partId])

  async function handleSubmit(data: PartSchemaOutput & { photos: string[] }) {
    await updatePart(partId, data)
    router.push('/admin/inventory')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-slate-500">Loading part...</p>
      </div>
    )
  }

  if (!part) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-red-600">Part not found</p>
      </div>
    )
  }

  const defaultValues = {
    name: part.name,
    category: part.category,
    vin: part.vin,
    vehicleYear: part.vehicleYear,
    vehicleMake: part.vehicleMake,
    vehicleModel: part.vehicleModel,
    vehicleTrim: part.vehicleTrim,
    condition: part.condition,
    price: part.price,
    mileage: part.mileage,
    yardLocation: part.yardLocation,
    stockStatus: part.stockStatus,
    notes: part.notes,
    addedBy: part.addedBy,
    photos: part.photos,
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-xl font-bold text-slate-900">Edit Part</h1>
      <PartForm
        partId={partId}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        submitLabel="Update Part"
      />
    </div>
  )
}
