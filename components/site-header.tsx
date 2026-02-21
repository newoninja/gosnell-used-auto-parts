'use client'

import Link from 'next/link'
import { Menu, Phone, X } from 'lucide-react'
import { useState } from 'react'
import { BUSINESS } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/inventory', label: 'Inventory' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
]

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/92 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="leading-tight">
              <span className="block font-heading text-sm font-black tracking-tight text-slate-950 sm:text-base">
                GOSNELL USED AUTO PARTS
              </span>
              <span className="block text-xs font-semibold text-slate-600">Flat Rock, North Carolina</span>
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-3 md:flex">
              <a
                href={BUSINESS.phones.mainHref}
                className="text-sm font-bold tracking-wide text-slate-900 transition-colors hover:text-forest-700"
              >
                {BUSINESS.phones.main}
              </a>
              <a
                href={BUSINESS.phones.mainHref}
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-black text-white transition-colors hover:bg-orange-400"
              >
                Call Now
              </a>
            </div>

            <button
              type="button"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-800 md:hidden"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 px-6 py-8 md:hidden">
          <div className="mx-auto flex h-full max-w-md flex-col">
            <div className="flex items-center justify-between">
              <span className="font-heading text-lg font-black text-white">Menu</span>
              <button
                type="button"
                aria-label="Close menu"
                className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-slate-700 text-slate-200"
                onClick={() => setMenuOpen(false)}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <nav className="mt-10 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-4 text-base font-bold text-slate-100"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto space-y-3">
              <a
                href={BUSINESS.phones.mainHref}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-base font-black text-white"
                onClick={() => setMenuOpen(false)}
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Call {BUSINESS.phones.main}
              </a>
              <p className="text-center text-xs text-slate-400">Mon-Thu 8-5, Fri 8-4</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
