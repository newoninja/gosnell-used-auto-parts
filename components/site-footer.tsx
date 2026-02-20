import Link from 'next/link'
import { BUSINESS } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/inventory', label: 'Inventory' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white/92 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-9 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3 md:text-left">
          <div>
            <h2 className="font-heading text-lg font-bold text-slate-900">{BUSINESS.name}</h2>
            <p className="mt-2 text-sm text-slate-600">{BUSINESS.tagline}</p>
            <p className="mt-2 text-sm text-slate-600">{BUSINESS.address.full}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Pages</h3>
            <ul className="mt-3 space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-block py-1 text-sm text-slate-600 transition-colors hover:text-orange-600">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Contact</h3>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <p>
                Main: <a href={BUSINESS.phones.mainHref} className="font-semibold text-slate-900 hover:text-orange-600">{BUSINESS.phones.main}</a>
              </p>
              <p>
                Secondary: <a href={BUSINESS.phones.secondaryHref} className="font-semibold text-slate-900 hover:text-orange-600">{BUSINESS.phones.secondary}</a>
              </p>
              <p>Mon-Thu: 8:00 AM-5:00 PM</p>
              <p>Fri: 8:00 AM-4:00 PM</p>
            </div>
          </div>
        </div>

        <p className="mt-8 border-t border-slate-100 pt-4 text-center text-xs text-slate-500 md:text-left">
          © {new Date().getFullYear()} {BUSINESS.name}. Serving Henderson County and Western North Carolina.
        </p>
      </div>
    </footer>
  )
}
