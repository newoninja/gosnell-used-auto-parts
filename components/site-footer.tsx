import Link from 'next/link'
import { BUSINESS } from '@/lib/utils'

const navLinks = [
  { href: '/#home', label: 'Home' },
  { href: '/#inventory', label: 'Inventory' },
  { href: '/services', label: 'Services' },
  { href: '/#about', label: 'About' },
  { href: '/#request-part', label: 'Request a Part' },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-300 bg-slate-950 text-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="font-heading text-lg font-black tracking-tight text-white">{BUSINESS.name}</h2>
            <p className="mt-2 text-sm text-slate-300">{BUSINESS.tagline}</p>
            <p className="mt-3 text-sm text-slate-300">{BUSINESS.address.full}</p>
            <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
              <a href={BUSINESS.social.yelp} target="_blank" rel="noopener noreferrer" className="rounded-md border border-slate-700 px-2 py-1 hover:border-slate-500">
                Yelp
              </a>
              <span className="rounded-md border border-slate-700 px-2 py-1">Facebook</span>
              <span className="rounded-md border border-slate-700 px-2 py-1">Instagram</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Quick Links</h3>
            <ul className="mt-3 space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-block py-1 text-sm text-slate-200 transition-colors hover:text-orange-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Contact</h3>
            <div className="mt-3 space-y-2 text-sm text-slate-300">
              <p>
                Main: <a href={BUSINESS.phones.mainHref} className="font-semibold text-white hover:text-orange-400">{BUSINESS.phones.main}</a>
              </p>
              <p>
                Secondary: <a href={BUSINESS.phones.secondaryHref} className="font-semibold text-white hover:text-orange-400">{BUSINESS.phones.secondary}</a>
              </p>
              <p>
                <a
                  href="https://maps.google.com/?q=110+Tabor+Road+Extension,+Flat+Rock,+NC+28731"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-400"
                >
                  Open map and directions
                </a>
              </p>
              <p>Fax: {BUSINESS.phones.fax}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Hours & Policies</h3>
            <div className="mt-3 space-y-2 text-sm text-slate-300">
              <p>Mon-Thu: 8:00 AM-5:00 PM</p>
              <p>Fri: 8:00 AM-4:00 PM</p>
              <p>Sat-Sun: Closed</p>
              <p>Limited parts warranty available.</p>
              <p className="font-semibold text-orange-300">We buy junk cars.</p>
            </div>
          </div>
        </div>

        <p className="mt-10 border-t border-slate-800 pt-4 text-center text-xs text-slate-400 md:text-left">
          © {new Date().getFullYear()} {BUSINESS.name}. Built with pride in North Carolina. {' '}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-white">Privacy Policy</Link>
        </p>
      </div>
    </footer>
  )
}
