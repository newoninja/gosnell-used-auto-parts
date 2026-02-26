'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Package, PlusCircle } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/inventory', label: 'Inventory', icon: Package, exact: true },
  { href: '/admin/inventory/new', label: 'Add Part', icon: PlusCircle, exact: false },
]

function isActive(pathname: string, item: (typeof navItems)[number]) {
  if (item.exact) return pathname === item.href
  return pathname.startsWith(item.href)
}

export function AdminSidebar() {
  const pathname = usePathname()

  // For /admin/inventory/new, match "Add Part" only (not "Inventory")
  // For /admin/inventory/[id]/edit, match "Inventory" only
  function getIsActive(item: (typeof navItems)[number]) {
    if (item.href === '/admin') return pathname === '/admin'
    if (item.href === '/admin/inventory/new') return pathname.startsWith('/admin/inventory/new')
    if (item.href === '/admin/inventory') {
      // Active for /admin/inventory exactly OR /admin/inventory/[id]/edit
      // But NOT for /admin/inventory/new
      return pathname === '/admin/inventory' || (pathname.startsWith('/admin/inventory/') && !pathname.startsWith('/admin/inventory/new'))
    }
    return false
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-60 md:flex-col md:border-r md:border-slate-200 md:bg-white">
        <div className="flex h-16 items-center border-b border-slate-200 px-5">
          <Link href="/admin" className="text-base font-bold text-slate-900">
            Gosnell Admin
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const active = getIsActive(item)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold transition-colors',
                  active
                    ? 'bg-orange-50 text-orange-600 border border-orange-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Mobile bottom tab bar — bigger touch targets */}
      <nav className="fixed inset-x-0 bottom-0 z-50 flex border-t border-slate-200 bg-white safe-area-pb md:hidden">
        {navItems.map((item) => {
          const active = getIsActive(item)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 py-3 text-sm font-semibold transition-colors',
                active ? 'text-orange-600' : 'text-slate-400'
              )}
            >
              <item.icon className="h-6 w-6" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
