'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { listParts, getPartStats, type PartStats, type ListPartsResult } from '@/lib/firebase/parts'
import type { Part } from '@/lib/types/inventory'
import { PART_CATEGORY_LABELS } from '@/lib/types/inventory'
import { StatCard } from '@/components/admin/stat-card'
import { StatusBadge } from '@/components/admin/status-badge'
import { Button } from '@/components/ui/button'
import {
  Package,
  CheckCircle,
  XCircle,
  Clock,
  CalendarPlus,
  PlusCircle,
  Camera,
  Pencil,
  ChevronRight,
  Loader2,
} from 'lucide-react'

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<PartStats | null>(null)
  const [recentParts, setRecentParts] = useState<Part[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getPartStats(),
      listParts({ status: 'Available', pageSize: 8, sortField: 'createdAt', sortDirection: 'desc' }),
    ])
      .then(([statsResult, partsResult]: [PartStats, ListPartsResult]) => {
        setStats(statsResult)
        setRecentParts(partsResult.parts)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Header with quick add */}
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
        <Button asChild size="sm">
          <Link href="/admin/inventory/new">
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Add Part</span>
            <span className="sm:hidden">Add</span>
          </Link>
        </Button>
      </div>

      {/* Stats — compact on mobile */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
        <StatCard
          label="Total"
          value={loading ? '—' : stats?.total ?? 0}
          icon={Package}
          iconColor="text-slate-500"
          href="/admin/inventory"
        />
        <StatCard
          label="Available"
          value={loading ? '—' : stats?.available ?? 0}
          icon={CheckCircle}
          iconColor="text-green-500"
          href="/admin/inventory?status=Available"
        />
        <StatCard
          label="Sold"
          value={loading ? '—' : stats?.sold ?? 0}
          icon={XCircle}
          iconColor="text-slate-400"
          href="/admin/inventory?status=Sold"
        />
        <StatCard
          label="On Hold"
          value={loading ? '—' : stats?.onHold ?? 0}
          icon={Clock}
          iconColor="text-amber-500"
          href="/admin/inventory?status=On Hold"
        />
        <StatCard
          label="This Week"
          value={loading ? '—' : stats?.addedThisWeek ?? 0}
          icon={CalendarPlus}
          iconColor="text-orange-500"
          className="col-span-2 sm:col-span-1"
          href="/admin/inventory"
        />
      </div>

      {/* Quick Actions — big touch targets for mobile */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Link
          href="/admin/inventory/new"
          className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50 p-5 text-center transition-colors hover:border-orange-400 hover:bg-orange-100 active:bg-orange-100"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white">
            <Camera className="h-6 w-6" />
          </div>
          <span className="text-sm font-bold text-orange-700">Add Part + Photos</span>
        </Link>
        <Link
          href="/admin/inventory"
          className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-5 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 active:bg-slate-50"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600">
            <Package className="h-6 w-6" />
          </div>
          <span className="text-sm font-bold text-slate-700">View Inventory</span>
        </Link>
      </div>

      {/* Recent Parts — visual product cards */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Recently Added
          </h2>
          <Link
            href="/admin/inventory"
            className="text-xs font-semibold text-orange-600 hover:text-orange-700"
          >
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
          </div>
        ) : recentParts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {recentParts.map((part) => (
              <Link
                key={part.id}
                href={`/admin/inventory/${part.id}/edit`}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
              >
                {/* Photo */}
                <div className="relative aspect-square bg-slate-100">
                  {part.photos[0] ? (
                    <img
                      src={part.photos[0]}
                      alt={part.name}
                      className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-1 text-slate-300">
                      <Package className="h-8 w-8" />
                      <span className="text-[10px]">No photo</span>
                    </div>
                  )}
                  {/* Status overlay */}
                  <div className="absolute left-1.5 top-1.5">
                    <StatusBadge status={part.stockStatus} />
                  </div>
                  {/* Edit overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
                    <span className="rounded-lg bg-white/90 px-2.5 py-1 text-xs font-bold text-slate-800 opacity-0 transition-opacity group-hover:opacity-100">
                      <Pencil className="mr-1 inline h-3 w-3" />
                      Edit
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="truncate text-sm font-bold text-slate-900">{part.name}</p>
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {part.vehicleYear} {part.vehicleMake} {part.vehicleModel}
                  </p>
                  <p className="mt-1.5 text-base font-black text-slate-900">
                    {formatPrice(part.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 py-12 text-center">
            <Package className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-2 text-sm text-slate-500">No parts yet</p>
            <Button asChild size="sm" className="mt-4">
              <Link href="/admin/inventory/new">
                <PlusCircle className="h-4 w-4" />
                Add Your First Part
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
