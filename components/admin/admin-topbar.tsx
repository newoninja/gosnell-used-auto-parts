'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/firebase/auth-context'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function AdminTopbar() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  async function handleLogout() {
    await signOut()
    router.push('/admin/login')
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">
      {/* Mobile logo — hidden on desktop (sidebar has it) */}
      <span className="text-base font-bold text-slate-900 md:hidden">Gosnell Admin</span>

      {/* Spacer on desktop */}
      <div className="hidden md:block" />

      <div className="flex items-center gap-3">
        {user?.email && (
          <span className="hidden text-sm text-slate-500 sm:inline">{user.email}</span>
        )}
        <Button variant="ghost" size="default" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </header>
  )
}
