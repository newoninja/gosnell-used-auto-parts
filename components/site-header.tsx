import Link from 'next/link'
import { BUSINESS } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/inventory', label: 'Inventory' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/70 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="leading-tight">
            <span className="block font-heading text-sm font-black tracking-tight text-slate-900 sm:text-base">
              GOSNELL USED AUTO PARTS
            </span>
            <span className="block text-xs font-medium text-slate-500">Flat Rock, North Carolina</span>
          </Link>
          <a
            href={BUSINESS.phones.mainHref}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-orange-400"
          >
            Call {BUSINESS.phones.main}
          </a>
        </div>
        <nav className="mt-3 flex flex-wrap gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
