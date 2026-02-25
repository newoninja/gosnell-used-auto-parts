import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, Search } from 'lucide-react'
import { BUSINESS } from '@/lib/utils'
import { getAvailableParts } from '@/lib/firebase/parts-server'
import { PART_CATEGORIES, PART_CATEGORY_LABELS, type PartCategory } from '@/lib/types/inventory'
import { StatusBadge } from '@/components/admin/status-badge'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Inventory',
  description:
    'Browse Gosnell Used Auto Parts inventory online. Quality used OEM parts by year, make, model, or part type.',
  alternates: { canonical: '/inventory' },
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

interface PageProps {
  searchParams: Promise<{
    category?: string
    make?: string
    model?: string
    year?: string
    page?: string
  }>
}

export default async function InventoryPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Math.max(1, parseInt(params.page || '1', 10))
  const pageSize = 24
  const offset = (page - 1) * pageSize

  const { parts, total } = await getAvailableParts({
    category: params.category as PartCategory | undefined,
    make: params.make || undefined,
    model: params.model || undefined,
    year: params.year ? parseInt(params.year, 10) : undefined,
    pageSize,
    offset,
  })

  const totalPages = Math.ceil(total / pageSize)

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
            {total} part{total !== 1 ? 's' : ''} available. Filter by category, make, or model below.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-slate-200 bg-slate-50">
        <form className="mx-auto flex max-w-6xl flex-wrap items-end gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-1">
            <label htmlFor="filter-category" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Category
            </label>
            <select
              id="filter-category"
              name="category"
              defaultValue={params.category || ''}
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700"
            >
              <option value="">All Categories</option>
              {PART_CATEGORIES.map((c) => (
                <option key={c} value={c}>{PART_CATEGORY_LABELS[c]}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="filter-make" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Make
            </label>
            <input
              id="filter-make"
              name="make"
              type="text"
              defaultValue={params.make || ''}
              placeholder="e.g. Ford"
              className="h-9 w-32 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="filter-model" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Model
            </label>
            <input
              id="filter-model"
              name="model"
              type="text"
              defaultValue={params.model || ''}
              placeholder="e.g. F-150"
              className="h-9 w-32 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="filter-year" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Year
            </label>
            <input
              id="filter-year"
              name="year"
              type="number"
              defaultValue={params.year || ''}
              placeholder="e.g. 2018"
              className="h-9 w-24 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 placeholder:text-slate-400"
            />
          </div>

          <button
            type="submit"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-orange-500 px-4 text-sm font-semibold text-white hover:bg-orange-400 transition-colors"
          >
            <Search className="h-3.5 w-3.5" />
            Filter
          </button>

          {(params.category || params.make || params.model || params.year) && (
            <Link
              href="/inventory"
              className="inline-flex h-9 items-center px-3 text-sm text-slate-500 hover:text-slate-700"
            >
              Clear filters
            </Link>
          )}
        </form>
      </section>

      {/* Parts grid */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {parts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {parts.map((part) => (
                <Link
                  key={part.id}
                  href={`/inventory/${part.id}`}
                  className="group rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Photo */}
                  <div className="relative aspect-[4/3] bg-slate-100">
                    {part.photos[0] ? (
                      <Image
                        src={part.photos[0]}
                        alt={part.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-slate-400">
                        No photo
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                      {part.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {part.vehicleYear} {part.vehicleMake} {part.vehicleModel}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-lg font-black text-slate-900">{formatPrice(part.price)}</span>
                      <StatusBadge status={part.stockStatus} />
                    </div>
                    {part.condition && (
                      <p className="mt-1 text-xs text-slate-400">Condition: {part.condition}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                {page > 1 && (
                  <Link
                    href={`/inventory?${new URLSearchParams({ ...params, page: String(page - 1) }).toString()}`}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Previous
                  </Link>
                )}
                <span className="px-3 text-sm text-slate-500">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <Link
                    href={`/inventory?${new URLSearchParams({ ...params, page: String(page + 1) }).toString()}`}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="py-16 text-center">
            <p className="text-lg font-bold text-slate-700">No parts found</p>
            <p className="mt-2 text-sm text-slate-500">
              Try adjusting your filters, or give us a call — we may have it in the yard.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/inventory"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Clear Filters
              </Link>
              <a
                href={BUSINESS.phones.mainHref}
                className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-400"
              >
                <Phone className="h-4 w-4" />
                Call {BUSINESS.phones.main}
              </a>
            </div>
          </div>
        )}
      </section>

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
