import Link from 'next/link'
import { Mountain, Phone, MapPin, Clock, ExternalLink, Wrench, Printer } from 'lucide-react'
import { BUSINESS } from '@/lib/utils'

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/inventory', label: 'Search Parts' },
  { href: '/about', label: 'About Us' },
  { href: '/services', label: 'Services' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/contact', label: 'Contact' },
]

const serviceLinks = [
  'Used OEM Parts',
  'Engine & Transmission',
  'Body Panels & Doors',
  'Electrical Components',
  'Scrap Metal Recycling',
  'Part Matching Help',
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="relative border-t border-white/5 bg-dark-950"
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* Mountain silhouette top edge */}
      <div
        className="absolute top-0 left-0 right-0 -translate-y-full h-12 opacity-20 pointer-events-none"
        style={{
          background:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1440 48\'%3E%3Cpath d=\'M0 48 L160 15 L300 30 L480 5 L640 22 L800 2 L960 18 L1120 8 L1280 25 L1440 10 L1440 48 Z\' fill=\'%230a0f0d\'/%3E%3C/svg%3E") bottom/cover no-repeat',
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-4">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-forest-800 border border-forest-600/30 shadow-lg">
                <Mountain className="h-5 w-5 text-orange-400" aria-hidden="true" />
                <Wrench className="h-3 w-3 text-cream absolute bottom-1.5 right-1.5" aria-hidden="true" />
              </div>
              <div>
                <div className="text-sm font-black tracking-tight text-cream font-heading">
                  GOSNELL'S
                </div>
                <div className="text-[10px] text-orange-400 font-semibold tracking-widest uppercase">
                  Used Auto Parts
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-500 leading-relaxed mb-5 max-w-xs">
              {BUSINESS.tagline}. Family-owned and operated in Flat Rock, NC since day one.
            </p>

            {/* Inventory link */}
            <a
              href={BUSINESS.inventory}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-forest-700/40 bg-forest-900/30 hover:bg-forest-800/40 px-4 py-2 text-sm text-forest-400 font-semibold transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              Search Our Inventory
            </a>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2" role="list">
              {quickLinks.map((link) => (
                <li key={link.href} role="listitem">
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-orange-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
              Our Services
            </h3>
            <ul className="space-y-2" role="list">
              {serviceLinks.map((s) => (
                <li key={s} role="listitem">
                  <Link
                    href="/services"
                    className="text-sm text-slate-400 hover:text-orange-400 transition-colors"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
              Contact & Hours
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" aria-hidden="true" />
                <address className="not-italic text-slate-400 leading-relaxed">
                  110 Tabor Road Extension<br />
                  Flat Rock, NC 28731
                </address>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-orange-400 shrink-0" aria-hidden="true" />
                <div className="space-y-0.5">
                  <a
                    href={BUSINESS.phones.mainHref}
                    className="block text-slate-300 hover:text-orange-400 transition-colors"
                  >
                    {BUSINESS.phones.main}
                  </a>
                  <a
                    href={BUSINESS.phones.secondaryHref}
                    className="block text-slate-400 hover:text-orange-400 transition-colors text-xs"
                  >
                    {BUSINESS.phones.secondary}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-slate-500 text-xs">
                <Printer className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                Fax: {BUSINESS.phones.fax}
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="h-4 w-4 text-forest-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div className="text-slate-400 text-xs leading-relaxed">
                  <div className="font-medium text-slate-300">Mon–Thu: 8:00 AM – 5:00 PM</div>
                  <div>Friday: 8:00 AM – 4:00 PM</div>
                  <div className="text-slate-600">Sat–Sun: Closed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-slate-600">
            <p>© {year} Gosnell Used Auto Parts. All rights reserved.</p>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <p>110 Tabor Road Extension, Flat Rock, NC 28731</p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-700">
            <Mountain className="h-3 w-3 text-forest-800" aria-hidden="true" />
            <span>Built with pride in Western North Carolina</span>
          </div>
        </div>

        {/* SEO text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-700 max-w-2xl mx-auto leading-relaxed">
            Gosnell Used Auto Parts serves Henderson County, Hendersonville, Asheville, Brevard,
            Flat Rock, and all of Western North Carolina with quality used OEM auto parts from our
            Blue Ridge Mountain salvage yard.
          </p>
        </div>
      </div>
    </footer>
  )
}
