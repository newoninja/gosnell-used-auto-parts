'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
import { Phone, Search, Loader2, SlidersHorizontal, X, Package } from 'lucide-react'
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
import { PART_CATEGORIES, PART_CATEGORY_LABELS, type Part } from '@/lib/types/inventory'
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
  const searchQuery = searchParams.get('q') || ''

  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(!!(category || make || model || year))

  // Filter form state
  const [formSearch, setFormSearch] = useState(searchQuery)
  const [formCategory, setFormCategory] = useState(category)
  const [formMake, setFormMake] = useState(make)
  const [formModel, setFormModel] = useState(model)
  const [formYear, setFormYear] = useState(year)

  useEffect(() => {
    setFormSearch(searchQuery)
    setFormCategory(category)
    setFormMake(make)
    setFormModel(model)
    setFormYear(year)
  }, [searchQuery, category, make, model, year])

  const [allParts, setAllParts] = useState<Part[]>([])
  const [page, setPage] = useState(1)

  useEffect(() => {
    setLoading(true)
    const q = query(
      collection(db, 'parts'),
      where('stockStatus', '==', 'Available'),
      orderBy('createdAt', 'desc')
    )
    getDocs(q)
      .then((snapshot) => setAllParts(snapshot.docs.map(docToPart)))
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
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const matches =
        p.name.toLowerCase().includes(q) ||
        p.vehicleMake.toLowerCase().includes(q) ||
        p.vehicleModel.toLowerCase().includes(q) ||
        `${p.vehicleYear}`.includes(q) ||
        (p.notes && p.notes.toLowerCase().includes(q))
      if (!matches) return false
    }
    return true
  })

  const totalFiltered = filtered.length
  const displayedParts = filtered.slice(0, page * PAGE_SIZE)
  const hasMore = displayedParts.length < totalFiltered

  useEffect(() => { setPage(1) }, [category, make, model, year, searchQuery])

  const activeFilterCount = [category, make, model, year].filter(Boolean).length

  function applyFilters(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (formSearch.trim()) params.set('q', formSearch.trim())
    if (formCategory) params.set('category', formCategory)
    if (formMake.trim()) params.set('make', formMake.trim())
    if (formModel.trim()) params.set('model', formModel.trim())
    if (formYear.trim()) params.set('year', formYear.trim())
    router.push(`/inventory${params.toString() ? `?${params.toString()}` : ''}`)
  }

  function clearAll() {
    setFormSearch('')
    setFormCategory('')
    setFormMake('')
    setFormModel('')
    setFormYear('')
    router.push('/inventory')
  }

  const hasAnyFilter = searchQuery || category || make || model || year

  return (
    <>
      {/* Search & Filters */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <form onSubmit={applyFilters}>
            {/* Main search bar */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={formSearch}
                onChange={(e) => setFormSearch(e.target.value)}
                placeholder="Search parts — try &quot;injector&quot;, &quot;Ford F-150&quot;, &quot;transmission&quot;..."
                className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-32 text-base text-slate-900 placeholder:text-slate-400 focus:border-orange-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
              />
              <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowFilters((s) => !s)}
                  className={`inline-flex h-10 items-center gap-1.5 rounded-xl border px-3 text-sm font-semibold transition-colors ${
                    showFilters || activeFilterCount > 0
                      ? 'border-orange-200 bg-orange-50 text-orange-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
                <button
                  type="submit"
                  className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-orange-500 px-4 text-sm font-bold text-white transition-colors hover:bg-orange-400"
                >
                  <Search className="h-4 w-4" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </div>

            {/* Advanced filters (collapsible) */}
            {showFilters && (
              <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-4">
                <div>
                  <label htmlFor="filter-category" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Category
                  </label>
                  <select
                    id="filter-category"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  >
                    <option value="">All Categories</option>
                    {PART_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{PART_CATEGORY_LABELS[c]}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="filter-make" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Make
                  </label>
                  <input
                    id="filter-make"
                    type="text"
                    value={formMake}
                    onChange={(e) => setFormMake(e.target.value)}
                    placeholder="e.g. Ford"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <div>
                  <label htmlFor="filter-model" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Model
                  </label>
                  <input
                    id="filter-model"
                    type="text"
                    value={formModel}
                    onChange={(e) => setFormModel(e.target.value)}
                    placeholder="e.g. F-150"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <div>
                  <label htmlFor="filter-year" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Year
                  </label>
                  <input
                    id="filter-year"
                    type="number"
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                    placeholder="e.g. 2018"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>
            )}
          </form>

          {/* Active filter tags */}
          {hasAnyFilter && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Active:</span>
              {searchQuery && (
                <FilterTag label={`"${searchQuery}"`} onClear={() => {
                  const params = new URLSearchParams(searchParams.toString())
                  params.delete('q')
                  router.push(`/inventory${params.toString() ? `?${params.toString()}` : ''}`)
                }} />
              )}
              {category && (
                <FilterTag label={PART_CATEGORY_LABELS[category as keyof typeof PART_CATEGORY_LABELS] || category} onClear={() => {
                  const params = new URLSearchParams(searchParams.toString())
                  params.delete('category')
                  router.push(`/inventory${params.toString() ? `?${params.toString()}` : ''}`)
                }} />
              )}
              {make && (
                <FilterTag label={make} onClear={() => {
                  const params = new URLSearchParams(searchParams.toString())
                  params.delete('make')
                  router.push(`/inventory${params.toString() ? `?${params.toString()}` : ''}`)
                }} />
              )}
              {model && (
                <FilterTag label={model} onClear={() => {
                  const params = new URLSearchParams(searchParams.toString())
                  params.delete('model')
                  router.push(`/inventory${params.toString() ? `?${params.toString()}` : ''}`)
                }} />
              )}
              {year && (
                <FilterTag label={year} onClear={() => {
                  const params = new URLSearchParams(searchParams.toString())
                  params.delete('year')
                  router.push(`/inventory${params.toString() ? `?${params.toString()}` : ''}`)
                }} />
              )}
              <button onClick={clearAll} className="text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors">
                Clear all
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
            <span className="mt-4 text-sm text-slate-500">Loading inventory...</span>
          </div>
        ) : displayedParts.length > 0 ? (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">
                {totalFiltered} part{totalFiltered !== 1 ? 's' : ''} found
              </p>
              {allParts.length !== totalFiltered && (
                <p className="text-xs text-slate-400">{allParts.length} total in stock</p>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {displayedParts.map((part) => (
                <Link
                  key={part.id}
                  href={`/inventory/${part.id}`}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-lg hover:border-slate-300"
                >
                  <div className="relative aspect-[4/3] bg-slate-100">
                    {part.photos[0] ? (
                      <Image
                        src={part.photos[0]}
                        alt={part.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-300">
                        <Package className="h-8 w-8" />
                        <span className="text-xs">No photo</span>
                      </div>
                    )}
                    <div className="absolute right-2 top-2">
                      <StatusBadge status={part.stockStatus} />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 transition-colors group-hover:text-orange-600">
                      {part.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {part.vehicleYear} {part.vehicleMake} {part.vehicleModel}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xl font-black text-slate-900">{formatPrice(part.price)}</span>
                      {part.condition && (
                        <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{part.condition}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {hasMore && (
              <div className="mt-10 flex justify-center">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-3 text-sm font-bold text-slate-700 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
                >
                  Load More Parts
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-20 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <Search className="h-7 w-7 text-slate-400" />
            </div>
            <p className="text-xl font-bold text-slate-700">No parts found</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              {hasAnyFilter
                ? 'Try adjusting your search or filters. We may also have unlisted parts in the yard.'
                : 'No parts are listed right now. Call us — we likely have what you need.'}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {hasAnyFilter && (
                <button
                  onClick={clearAll}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm hover:shadow-md transition-all"
                >
                  Clear Filters
                </button>
              )}
              <a
                href={BUSINESS.phones.mainHref}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-orange-400 transition-colors"
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

function FilterTag({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
      {label}
      <button onClick={onClear} className="ml-0.5 rounded-full p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors">
        <X className="h-3 w-3" />
      </button>
    </span>
  )
}
