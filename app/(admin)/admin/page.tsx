'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getPartStats, type PartStats } from '@/lib/firebase/parts'
import { StatCard } from '@/components/admin/stat-card'
import { Button } from '@/components/ui/button'
import { Package, CheckCircle, XCircle, Clock, CalendarPlus, PlusCircle, List } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState<PartStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPartStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard
          label="Total Parts"
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
          label="Added This Week"
          value={loading ? '—' : stats?.addedThisWeek ?? 0}
          icon={CalendarPlus}
          iconColor="text-orange-500"
          className="col-span-2 sm:col-span-1"
          href="/admin/inventory"
        />
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-slate-500 uppercase tracking-wide">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/admin/inventory/new">
              <PlusCircle className="h-4 w-4" />
              Add New Part
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/inventory">
              <List className="h-4 w-4" />
              View Inventory
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
