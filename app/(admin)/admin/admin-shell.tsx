'use client'

import { usePathname } from 'next/navigation'
import { AuthProvider } from '@/lib/firebase/auth-context'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminTopbar } from '@/components/admin/admin-topbar'

const AUTH_PAGES = ['/admin/login']

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = AUTH_PAGES.includes(pathname)

  return (
    <AuthProvider>
      {isAuthPage ? (
        // Login page — no sidebar/topbar
        <div className="min-h-screen bg-slate-50">{children}</div>
      ) : (
        // Authenticated pages — full admin layout
        <div className="flex min-h-screen bg-slate-50">
          <AdminSidebar />
          <div className="flex flex-1 flex-col">
            <AdminTopbar />
            <main className="flex-1 p-4 pb-20 md:p-6 md:pb-6">{children}</main>
          </div>
        </div>
      )}
    </AuthProvider>
  )
}
