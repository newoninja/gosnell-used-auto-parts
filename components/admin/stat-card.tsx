import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: number | string
  icon: LucideIcon
  className?: string
  iconColor?: string
  href?: string
}

export function StatCard({ label, value, icon: Icon, className, iconColor = 'text-slate-400', href }: StatCardProps) {
  const content = (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <Icon className={cn('h-5 w-5', iconColor)} />
      </div>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </>
  )

  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          'block rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-orange-200 hover:bg-orange-50/30',
          className
        )}
      >
        {content}
      </Link>
    )
  }

  return (
    <div className={cn('rounded-xl border border-slate-200 bg-white p-4', className)}>
      {content}
    </div>
  )
}
