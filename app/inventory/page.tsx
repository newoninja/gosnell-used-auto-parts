import type { Metadata } from 'next'
import { ExternalLink, Phone, Search } from 'lucide-react'
import { BUSINESS } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Inventory',
  description:
    'Search Gosnell Used Auto Parts inventory online. Find used OEM auto parts by year, make, model, or VIN.',
  alternates: { canonical: '/inventory' },
}

const searchTips = [
  'Search by year, make, model, and part type.',
  'If you have it, use VIN for the best match.',
  'Call us if you do not see your part online.',
]

export default function InventoryPage() {
  return (
    <main className="min-h-screen">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-forest-700">Inventory</p>
          <h1 className="mt-3 font-heading text-4xl font-black text-slate-900 sm:text-5xl">
            Search our live parts inventory
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Our online inventory is updated daily through Car-Part.com.
            If you are unsure about fitment, call us and we will help.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a
              href={BUSINESS.inventory}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-orange-400"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Open Inventory Search
            </a>
            <a
              href={BUSINESS.phones.mainHref}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-900 transition-colors hover:bg-slate-100"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Call {BUSINESS.phones.main}
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="font-heading text-2xl font-bold text-slate-900">How to search</h2>
        <ul className="mt-5 space-y-3">
          {searchTips.map((tip) => (
            <li key={tip} className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700">
              <Search className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" aria-hidden="true" />
              {tip}
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
