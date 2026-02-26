'use client'

import { Suspense, useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { listParts, bulkUpdateStatus, bulkDelete, type ListPartsResult, type ListPartsOptions } from '@/lib/firebase/parts'
import { PART_CATEGORIES, PART_CATEGORY_LABELS, STOCK_STATUSES, type PartCategory, type StockStatus } from '@/lib/types/inventory'
import type { Part } from '@/lib/types/inventory'
import type { DocumentSnapshot } from 'firebase/firestore'
import { StatusBadge } from '@/components/admin/status-badge'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  PlusCircle,
  Pencil,
  Trash2,
  ChevronRight,
  Package,
  SlidersHorizontal,
  Loader2,
  Camera,
} from 'lucide-react'

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

export default function AdminInventoryPage() {
  return (
    <Suspense>
      <InventoryContent />
    </Suspense>
  )
}

function InventoryContent() {
  const searchParams = useSearchParams()
  const initialStatus = (searchParams.get('status') as StockStatus | null) || ''

  const [parts, setParts] = useState<Part[]>([])
  const [loading, setLoading] = useState(true)
  const [cursor, setCursor] = useState<DocumentSnapshot | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  // Filters
  const [statusFilter, setStatusFilter] = useState<StockStatus | ''>(initialStatus)
  const [categoryFilter, setCategoryFilter] = useState<PartCategory | ''>('')
  const [makeFilter, setMakeFilter] = useState('')

  // Bulk selection
  const [selected, setSelected] = useState<Set<string>>(new Set())

  // Confirm dialog
  const [confirmAction, setConfirmAction] = useState<{
    title: string
    description: string
    variant: 'default' | 'destructive'
    action: () => Promise<void>
  } | null>(null)
  const [confirmLoading, setConfirmLoading] = useState(false)

  const fetchParts = useCallback(
    async (append = false) => {
      setLoading(true)
      try {
        const options: ListPartsOptions = { pageSize: 20 }
        if (statusFilter) options.status = statusFilter
        if (categoryFilter) options.category = categoryFilter
        if (makeFilter) options.make = makeFilter
        if (append && cursor) options.cursor = cursor

        const result: ListPartsResult = await listParts(options)
        setParts((prev) => (append ? [...prev, ...result.parts] : result.parts))
        setCursor(result.lastDoc)
        setHasMore(result.hasMore)
      } catch (err) {
        console.error('Failed to load parts:', err)
      } finally {
        setLoading(false)
      }
    },
    [statusFilter, categoryFilter, makeFilter, cursor]
  )

  // Reset and fetch when filters change
  useEffect(() => {
    setCursor(null)
    setSelected(new Set())
    fetchParts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, categoryFilter, makeFilter])

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleSelectAll() {
    if (selected.size === parts.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(parts.map((p) => p.id)))
    }
  }

  async function handleBulkStatus(status: StockStatus) {
    setConfirmAction({
      title: `Mark ${selected.size} part(s) as ${status}?`,
      description: `This will update the status of the selected parts.`,
      variant: 'default',
      action: async () => {
        await bulkUpdateStatus(Array.from(selected), status)
        setSelected(new Set())
        setCursor(null)
        await fetchParts()
      },
    })
  }

  async function handleBulkDelete() {
    setConfirmAction({
      title: `Delete ${selected.size} part(s)?`,
      description: 'This action cannot be undone. The parts and their photos will be permanently removed.',
      variant: 'destructive',
      action: async () => {
        await bulkDelete(Array.from(selected))
        setSelected(new Set())
        setCursor(null)
        await fetchParts()
      },
    })
  }

  async function handleConfirm() {
    if (!confirmAction) return
    setConfirmLoading(true)
    try {
      await confirmAction.action()
    } catch (err) {
      console.error(err)
    } finally {
      setConfirmLoading(false)
      setConfirmAction(null)
    }
  }

  const activeFilterCount = [statusFilter, categoryFilter, makeFilter].filter(Boolean).length

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-2">
        <h1 className="text-xl font-bold text-slate-900">Inventory</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters((s) => !s)}
            className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium transition-colors ${
              showFilters || activeFilterCount > 0
                ? 'border-orange-200 bg-orange-50 text-orange-700'
                : 'border-slate-200 bg-white text-slate-600'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {activeFilterCount > 0 && (
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
          <Button asChild size="sm">
            <Link href="/admin/inventory/new">
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Add Part</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters (collapsible) */}
      {showFilters && (
        <div className="mb-4 grid grid-cols-1 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StockStatus | '')}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700"
          >
            <option value="">All Statuses</option>
            {STOCK_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as PartCategory | '')}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700"
          >
            <option value="">All Categories</option>
            {PART_CATEGORIES.map((c) => (
              <option key={c} value={c}>{PART_CATEGORY_LABELS[c]}</option>
            ))}
          </select>

          <Input
            value={makeFilter}
            onChange={(e) => setMakeFilter(e.target.value)}
            placeholder="Filter by make..."
            className="h-10"
          />
        </div>
      )}

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl bg-orange-50 border border-orange-200 px-3 py-2">
          <span className="text-sm font-semibold text-orange-700">
            {selected.size} selected
          </span>
          <Button size="sm" variant="outline" onClick={() => handleBulkStatus('Available')}>
            Available
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleBulkStatus('Sold')}>
            Sold
          </Button>
          <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </Button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
          <span className="ml-2 text-sm text-slate-500">Loading...</span>
        </div>
      )}

      {/* Desktop table */}
      {!loading && (
        <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white md:block">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={parts.length > 0 && selected.size === parts.length}
                    onChange={toggleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="px-4 py-3 font-medium text-slate-500">Photo</th>
                <th className="px-4 py-3 font-medium text-slate-500">Part Name</th>
                <th className="px-4 py-3 font-medium text-slate-500">Vehicle</th>
                <th className="px-4 py-3 font-medium text-slate-500">Category</th>
                <th className="px-4 py-3 font-medium text-slate-500">Status</th>
                <th className="px-4 py-3 font-medium text-slate-500">Price</th>
                <th className="px-4 py-3 font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {parts.map((part) => (
                <tr key={part.id} className={`hover:bg-slate-50 ${selected.has(part.id) ? 'bg-orange-50/50' : ''}`}>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(part.id)}
                      onChange={() => toggleSelect(part.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-4 py-2">
                    {part.photos[0] ? (
                      <img
                        src={part.photos[0]}
                        alt={part.name}
                        className="h-14 w-14 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100">
                        <Package className="h-5 w-5 text-slate-300" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">{part.name}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {part.vehicleYear} {part.vehicleMake} {part.vehicleModel}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {PART_CATEGORY_LABELS[part.category]}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={part.stockStatus} />
                  </td>
                  <td className="px-4 py-3 font-semibold">{formatPrice(part.price)}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/inventory/${part.id}/edit`}
                      className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-colors"
                    >
                      <Pencil className="h-3 w-3" />
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {parts.length === 0 && (
            <div className="py-12 text-center text-sm text-slate-500">
              No parts found. {activeFilterCount > 0 ? 'Try adjusting your filters.' : ''}
            </div>
          )}
        </div>
      )}

      {/* Mobile card view — big photos */}
      {!loading && (
        <div className="grid grid-cols-2 gap-2.5 md:hidden">
          {parts.map((part) => (
            <Link
              key={part.id}
              href={`/admin/inventory/${part.id}/edit`}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all active:scale-[0.97]"
            >
              {/* Big photo */}
              <div className="relative aspect-square bg-slate-100">
                {part.photos[0] ? (
                  <img
                    src={part.photos[0]}
                    alt={part.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-1 text-slate-300">
                    <Camera className="h-8 w-8" />
                    <span className="text-[10px]">No photo</span>
                  </div>
                )}
                <div className="absolute left-1.5 top-1.5">
                  <StatusBadge status={part.stockStatus} />
                </div>
              </div>

              {/* Info */}
              <div className="p-2.5">
                <p className="truncate text-sm font-bold text-slate-900">{part.name}</p>
                <p className="mt-0.5 truncate text-[11px] text-slate-500">
                  {part.vehicleYear} {part.vehicleMake} {part.vehicleModel}
                </p>
                <p className="mt-1 text-base font-black text-slate-900">
                  {formatPrice(part.price)}
                </p>
              </div>
            </Link>
          ))}

          {parts.length === 0 && (
            <div className="col-span-2 py-16 text-center">
              <Package className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-2 text-sm text-slate-500">No parts found</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {hasMore && !loading && (
        <div className="mt-6 text-center">
          <Button variant="outline" onClick={() => fetchParts(true)} className="w-full sm:w-auto">
            Load More
          </Button>
        </div>
      )}

      {/* Confirm dialog */}
      <ConfirmDialog
        open={!!confirmAction}
        title={confirmAction?.title ?? ''}
        description={confirmAction?.description ?? ''}
        variant={confirmAction?.variant ?? 'default'}
        confirmLabel="Yes, proceed"
        loading={confirmLoading}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  )
}
