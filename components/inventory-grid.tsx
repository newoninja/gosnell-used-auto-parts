'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
import { Phone, Search, Loader2 } from 'lucide-react'
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getCountFromServer,
  startAfter,
  type QueryConstraint,
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

  const [parts, setParts] = useState<Part[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null)
  const [hasMore, setHasMore] = useState(false)

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

  const fetchParts = useCallback(async () => {
    setLoading(true)
    try {
      const constraints: QueryConstraint[] = [
        where('stockStatus', '==', 'Available'),
      ]

      if (category) constraints.push(where('category', '==', category))
      if (make) constraints.push(where('vehicleMake', '==', make))
      if (year) constraints.push(where('vehicleYear', '==', parseInt(year, 10)))

      constraints.push(orderBy('createdAt', 'desc'))

      // Get count
      const countQuery = query(collection(db, 'parts'), ...constraints)
      const countSnap = await getCountFromServer(countQuery)
      setTotal(countSnap.data().count)

      // Get first page
      const dataQuery = query(collection(db, 'parts'), ...constraints, limit(PAGE_SIZE))
      const snapshot = await getDocs(dataQuery)

      let fetchedParts = snapshot.docs.map(docToPart)

      // Client-side model filter
      if (model) {
        const modelLower = model.toLowerCase()
        fetchedParts = fetchedParts.filter((p) =>
          p.vehicleModel.toLowerCase().includes(modelLower)
        )
      }

      setParts(fetchedParts)
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null)
      setHasMore(snapshot.docs.length === PAGE_SIZE)
    } catch (err) {
      console.error('Failed to fetch parts:', err)
      setParts([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [category, make, model, year])

  useEffect(() => {
    fetchParts()
  }, [fetchParts])

  const loadMore = async () => {
    if (!lastDoc || loadingMore) return
    setLoadingMore(true)
    try {
      const constraints: QueryConstraint[] = [
        where('stockStatus', '==', 'Available'),
      ]

      if (category) constraints.push(where('category', '==', category))
      if (make) constraints.push(where('vehicleMake', '==', make))
      if (year) constraints.push(where('vehicleYear', '==', parseInt(year, 10)))

      constraints.push(orderBy('createdAt', 'desc'))
      constraints.push(startAfter(lastDoc))
      constraints.push(limit(PAGE_SIZE))

      const dataQuery = query(collection(db, 'parts'), ...constraints)
      const snapshot = await getDocs(dataQuery)

      let fetchedParts = snapshot.docs.map(docToPart)

      if (model) {
        const modelLower = model.toLowerCase()
        fetchedParts = fetchedParts.filter((p) =>
          p.vehicleModel.toLowerCase().includes(modelLower)
        )
      }

      setParts((prev) => [...prev, ...fetchedParts])
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null)
      setHasMore(snapshot.docs.length === PAGE_SIZE)
    } catch (err) {
      console.error('Failed to load more parts:', err)
    } finally {
      setLoadingMore(false)
    }
  }

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
        ) : parts.length > 0 ? (
          <>
            <p className="mb-6 text-sm text-slate-500">
              {total} part{total !== 1 ? 's' : ''} available
            </p>
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

            {/* Load more */}
            {hasMore && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More Parts'
                  )}
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
