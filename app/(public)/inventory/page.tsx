import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Loader2 } from 'lucide-react'
import { InventoryGrid } from '@/components/inventory-grid'
import { BUSINESS } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Inventory',
  description:
    'Browse Gosnell Used Auto Parts inventory online. Quality used OEM parts by year, make, model, or part type.',
  alternates: { canonical: '/inventory' },
}

export default function InventoryPage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 text-center sm:px-6 sm:py-14 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-forest-700">Inventory</p>
          <h1 className="mt-3 font-heading text-3xl font-black text-slate-900 sm:text-5xl">
            Browse Our Parts
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
            Filter by category, make, or model below.
          </p>
        </div>
      </section>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            <span className="ml-3 text-sm text-slate-500">Loading inventory...</span>
          </div>
        }
      >
        <InventoryGrid />
      </Suspense>

      {/* Car-Part.com fallback */}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-slate-500">
            Looking for something specific? You can also search our extended inventory on{' '}
            <a
              href={BUSINESS.inventory}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-orange-600 hover:text-orange-700"
            >
              Car-Part.com
            </a>
          </p>
        </div>
      </section>
    </main>
  )
}
