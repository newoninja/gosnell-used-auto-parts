import { cn } from '@/lib/utils'
import type { StockStatus } from '@/lib/types/inventory'

const statusStyles: Record<StockStatus, string> = {
  Available: 'bg-green-50 text-green-700 border-green-200',
  Sold: 'bg-slate-100 text-slate-600 border-slate-200',
  'On Hold': 'bg-amber-50 text-amber-700 border-amber-200',
}

export function StatusBadge({ status, className }: { status: StockStatus; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        statusStyles[status],
        className
      )}
    >
      {status}
    </span>
  )
}
