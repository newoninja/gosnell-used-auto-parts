'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createPart, generatePartId } from '@/lib/firebase/parts'
import { PartForm } from '@/components/admin/part-form'
import type { PartSchemaOutput } from '@/lib/schemas/part'

export default function NewPartPage() {
  const router = useRouter()
  const partId = useMemo(() => generatePartId(), [])

  async function handleSubmit(data: PartSchemaOutput & { photos: string[] }) {
    await createPart(data, partId)
    router.push('/admin/inventory')
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-xl font-bold text-slate-900">Add New Part</h1>
      <PartForm partId={partId} onSubmit={handleSubmit} submitLabel="Add Part" />
    </div>
  )
}
