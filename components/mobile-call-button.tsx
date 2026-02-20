import { Phone } from 'lucide-react'
import { BUSINESS } from '@/lib/utils'

export function MobileCallButton() {
  return (
    <a
      href={BUSINESS.phones.mainHref}
      className="fixed bottom-4 right-4 z-50 inline-flex min-h-12 items-center gap-2 rounded-full bg-orange-500 px-5 py-3 text-sm font-black text-white shadow-xl shadow-orange-900/25 md:hidden"
      aria-label={`Call ${BUSINESS.phones.main}`}
    >
      <Phone className="h-4 w-4" aria-hidden="true" />
      Call Now
    </a>
  )
}
