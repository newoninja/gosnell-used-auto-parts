'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
import { Phone, Search, Loader2 } from 'lucide-react'
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  type DocumentSnapshot,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { BUSINESS } from '@/lib/utils'
import { PART_CATEGORIES, PART_CATEGORY_LABELS, type PartCategory, type Part } from '@/lib/types/inventory'
import { StatusBadge } from '@/components/admin/status-badge'

const PAGE_SIZE = 24

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

function docToPart(doc: DocumentSnapshot): Part {
  const data = doc.data()!
  return { id: doc.id, ...data } as Part
}

export function InventoryGrid() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const category = searchParams.get('category') || ''
  const make = searchParams.get('make') || ''
  const model = searchParams.get('model') || ''
  const year = searchParams.get('year') || ''

  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  // Filter form state (local until submit)
  const [formCategory, setFormCategory] = useState(category)
  const [formMake, setFormMake] = useState(make)
  const [formModel, setFormModel] = useState(model)
  const [formYear, setFormYear] = useState(year)

  // Sync form state when URL params change
  useEffect(() => {
    setFormCategory(category)
    setFormMake(make)
    setFormModel(model)
    setFormYear(year)
  }, [category, make, model, year])

  // All parts cache (fetched once, filtered in JS)
  const [allParts, setAllParts] = useState<Part[]>([])
  const [page, setPage] = useState(1)

  // Fetch all available parts once (simple query, no composite index needed)
  useEffect(() => {
    setLoading(true)
    const q = query(
      collection(db, 'parts'),
      where('stockStatus', '==', 'Available'),
      orderBy('createdAt', 'desc')
    )
    getDocs(q)
      .then((snapshot) => {
        setAllParts(snapshot.docs.map(docToPart))
      })
      .catch((err) => {
        console.error('Failed to fetch parts:', err)
        setAllParts([])
      })
      .finally(() => setLoading(false))
  }, [])

  // Filter in JavaScript (case-insensitive)
  const filtered = allParts.filter((p) => {
    if (category && p.category !== category) return false
    if (make && !p.vehicleMake.toLowerCase().includes(make.toLowerCase())) return false
    if (model && !p.vehicleModel.toLowerCase().includes(model.toLowerCase())) return false
    if (year && p.vehicleYear !== parseInt(year, 10)) return false
    return true
  })

  const totalFiltered = filtered.length
  const displayedParts = filtered.slice(0, page * PAGE_SIZE)
  const hasMore = displayedParts.length < totalFiltered

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [category, make, model, year])

  // Sync total for display
  useEffect(() => {
    setTotal(totalFiltered)
  }, [totalFiltered])

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (formCategory) params.set('category', formCategory)
    if (formMake) params.set('make', formMake)
    if (formModel) params.set('model', formModel)
    if (formYear) params.set('year', formYear)
    router.push(`/inventory${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const hasFilters = category || make || model || year

  return (
    <>
      {/* Filters */}
      <section className="border-b border-slate-200 bg-slate-50">
        <form
          onSubmit={handleFilter}
          className="mx-auto flex max-w-6xl flex-wrap items-end gap-3 px-4 py-4 sm:px-6 lg:px-8"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="filter-category" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Category
            </label>
            <select
              id="filter-category"
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
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
              type="text"
              value={formMake}
              onChange={(e) => setFormMake(e.target.value)}
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
              type="text"
              value={formModel}
              onChange={(e) => setFormModel(e.target.value)}
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
              type="number"
              value={formYear}
              onChange={(e) => setFormYear(e.target.value)}
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

          {hasFilters && (
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
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            <span className="ml-3 text-sm text-slate-500">Loading inventory...</span>
          </div>
        ) : displayedParts.length > 0 ? (
          <>
            <p className="mb-6 text-sm text-slate-500">
              {totalFiltered} part{totalFiltered !== 1 ? 's' : ''} available
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {displayedParts.map((part) => (
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

            {/* Load more */}
            {hasMore && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Load More Parts
                </button>
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
    </>
  )
}
