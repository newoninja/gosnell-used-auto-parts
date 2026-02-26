import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Phone, MessageSquare, MapPin } from 'lucide-react'
import { getPartById } from '@/lib/firebase/parts-server'
import { PART_CATEGORY_LABELS } from '@/lib/types/inventory'
import { StatusBadge } from '@/components/admin/status-badge'
import { BUSINESS } from '@/lib/utils'
import { PartPhotoGallery } from '@/components/part-photo-gallery'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  try {
    const part = await getPartById(id)
    if (!part) return { title: 'Part Not Found' }

    return {
      title: `${part.name} — ${part.vehicleYear} ${part.vehicleMake} ${part.vehicleModel}`,
      description: `Used ${part.name} for ${part.vehicleYear} ${part.vehicleMake} ${part.vehicleModel}. ${part.condition} condition. $${(part.price / 100).toFixed(2)}. Available at Gosnell Used Auto Parts in Flat Rock, NC.`,
      alternates: { canonical: `/inventory/${id}` },
    }
  } catch {
    return { title: 'Inventory' }
  }
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

export default async function PartDetailPage({ params }: PageProps) {
  const { id } = await params
  let part = null
  try {
    part = await getPartById(id)
  } catch {
    // Firebase unavailable
  }

  if (!part) notFound()

  return (
    <main className="min-h-screen">
      {/* Breadcrumb */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/inventory"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Inventory
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Photo gallery */}
          <div>
            {part.photos.length > 0 ? (
              <PartPhotoGallery photos={part.photos} partName={part.name} />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-sm text-slate-400">
                No photos available
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <StatusBadge status={part.stockStatus} className="mb-3" />
            <h1 className="font-heading text-2xl font-black text-slate-900 sm:text-3xl">
              {part.name}
            </h1>
            <p className="mt-2 text-lg text-slate-600">
              {part.vehicleYear} {part.vehicleMake} {part.vehicleModel}
              {part.vehicleTrim && ` ${part.vehicleTrim}`}
            </p>

            <p className="mt-4 text-3xl font-black text-slate-900">{formatPrice(part.price)}</p>

            {/* Details grid */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <DetailItem label="Category" value={PART_CATEGORY_LABELS[part.category]} />
              <DetailItem label="Condition" value={part.condition} />
              {part.mileage && <DetailItem label="Mileage" value={`${part.mileage.toLocaleString()} mi`} />}
              {part.vin && <DetailItem label="VIN" value={part.vin} />}
              <DetailItem label="Location" value={part.yardLocation} />
            </div>

            {part.notes && (
              <div className="mt-6">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Notes</h2>
                <p className="mt-2 text-sm text-slate-700 leading-relaxed">{part.notes}</p>
              </div>
            )}

            {/* CTAs */}
            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
              <a
                href={BUSINESS.phones.mainHref}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-base font-black text-white hover:bg-orange-400 transition-colors sm:w-auto"
              >
                <Phone className="h-4 w-4" />
                Call to Inquire
              </a>
              <Link
                href={`/contact?part=${encodeURIComponent(part.name)}&vehicle=${encodeURIComponent(`${part.vehicleYear} ${part.vehicleMake} ${part.vehicleModel}`)}`}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-bold text-slate-900 hover:bg-slate-50 transition-colors sm:w-auto"
              >
                <MessageSquare className="h-4 w-4" />
                Request This Part
              </Link>
            </div>

            {/* Location blurb */}
            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-forest-700" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{BUSINESS.name}</p>
                  <p className="text-sm text-slate-600">{BUSINESS.address.full}</p>
                  <p className="text-xs text-slate-500 mt-1">Mon-Thu 8-5, Fri 8-4</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-slate-900">{value}</p>
    </div>
  )
}
