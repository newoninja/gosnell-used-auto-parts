'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Menu, X, Phone, Mountain, Wrench, ExternalLink } from 'lucide-react'
import { BUSINESS } from '@/lib/utils'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/inventory', label: 'Inventory' },
  { href: '/about', label: 'About Us' },
  { href: '/services', label: 'Services' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/contact', label: 'Contact' },
]

function NavLink({
  href,
  label,
  prefersReduced,
  pathname,
}: {
  href: string
  label: string
  prefersReduced: boolean
  pathname: string
}) {
  const [hovered, setHovered] = useState(false)
  const isActive =
    href === '/'
      ? pathname === '/'
      : !href.includes('#') && pathname.startsWith(href)

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'relative px-3 py-1.5 text-sm font-semibold transition-colors duration-150 rounded-md',
        isActive
          ? 'text-forest-800 bg-forest-50'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
      )}
    >
      {label}
      <motion.span
        className="absolute bottom-0 left-2 right-2 h-[2px] bg-orange-500 origin-center rounded-full"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={
          isActive || (!prefersReduced && hovered)
            ? { scaleX: 1, opacity: 1 }
            : { scaleX: 0, opacity: 0 }
        }
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        aria-hidden="true"
      />
    </Link>
  )
}

export function Navbar() {
  const prefersReduced = useReducedMotion()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const handleScroll = useCallback(() => setScrolled(window.scrollY > 20), [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setIsOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      <motion.header
        initial={prefersReduced ? {} : { y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.1 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-400',
          scrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-md shadow-slate-900/5'
            : 'bg-white/80 backdrop-blur-sm border-b border-white/60'
        )}
        role="banner"
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
          <div className="flex h-16 items-center justify-between gap-4">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 flex-shrink-0 group"
              aria-label="Gosnell Used Auto Parts – Home"
            >
              <motion.div
                layoutId="logo-icon"
                whileHover={prefersReduced ? {} : { scale: 1.08, rotate: -3 }}
                whileTap={prefersReduced ? {} : { scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-forest-800 shadow-md"
              >
                <Mountain className="h-4 w-4 text-orange-400" aria-hidden="true" />
                <Wrench className="h-2.5 w-2.5 text-white absolute bottom-1 right-1" aria-hidden="true" />
              </motion.div>
              <div className="leading-tight">
                <span className="block text-sm font-black tracking-tight text-slate-900 font-heading">
                  GOSNELL'S
                </span>
                <span className="block text-[10px] text-forest-700 font-semibold tracking-widest uppercase leading-none">
                  Auto Parts · Flat Rock, NC
                </span>
              </div>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-0.5" role="list">
              {navLinks.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  prefersReduced={!!prefersReduced}
                  pathname={pathname}
                />
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-3 flex-shrink-0">
              <a
                href={BUSINESS.phones.mainHref}
                className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-forest-800 transition-colors"
                aria-label={`Call ${BUSINESS.phones.main}`}
              >
                <Phone className="h-3.5 w-3.5 text-orange-500" aria-hidden="true" />
                <span className="hidden lg:inline">{BUSINESS.phones.main}</span>
              </a>
              <motion.a
                href={BUSINESS.phones.mainHref}
                whileHover={prefersReduced ? {} : { scale: 1.04, y: -1 }}
                whileTap={prefersReduced ? {} : { scale: 0.93 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 px-4 py-2 text-sm font-bold text-white shadow-md hover:shadow-orange-200 transition-colors"
                aria-label="Call us now"
              >
                <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                Call Now
              </motion.a>
            </div>

            {/* Mobile */}
            <div className="flex md:hidden items-center gap-2">
              <motion.a
                href={BUSINESS.phones.mainHref}
                whileTap={prefersReduced ? {} : { scale: 0.9 }}
                className="flex items-center justify-center h-9 w-9 rounded-lg bg-orange-500 text-white shadow-sm"
                aria-label={`Call ${BUSINESS.phones.main}`}
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
              </motion.a>
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileTap={prefersReduced ? {} : { scale: 0.9 }}
                className="flex items-center justify-center h-9 w-9 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={isOpen ? 'close' : 'menu'}
                    initial={prefersReduced ? {} : { rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={prefersReduced ? {} : { rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {isOpen
                      ? <X className="h-5 w-5" aria-hidden="true" />
                      : <Menu className="h-5 w-5" aria-hidden="true" />
                    }
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm md:hidden"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              id="mobile-menu"
              initial={prefersReduced ? {} : { x: '100%' }}
              animate={{ x: 0 }}
              exit={prefersReduced ? {} : { x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-[280px] bg-white border-l border-slate-200 shadow-2xl flex flex-col md:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <span className="font-heading font-black text-sm text-slate-900">NAVIGATION</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto p-4" aria-label="Mobile navigation">
                <ul className="space-y-1" role="list">
                  {navLinks.map((link, i) => {
                    const isActive = link.href === '/' ? pathname === '/' : !link.href.includes('#') && pathname.startsWith(link.href)
                    return (
                      <motion.li
                        key={link.href}
                        initial={prefersReduced ? {} : { opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 + 0.1 }}
                        role="listitem"
                      >
                        <Link
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            'flex items-center px-4 py-3 rounded-xl font-medium transition-colors',
                            isActive
                              ? 'bg-forest-50 text-forest-800 font-semibold'
                              : 'text-slate-700 hover:bg-slate-50'
                          )}
                        >
                          {link.label}
                        </Link>
                      </motion.li>
                    )
                  })}
                </ul>
                <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                  <a
                    href={BUSINESS.inventory}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-forest-800 hover:bg-forest-700 text-white font-semibold transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    Search Inventory
                  </a>
                  <a
                    href={BUSINESS.phones.mainHref}
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-colors"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    {BUSINESS.phones.main}
                  </a>
                </div>
              </nav>
              <div className="p-4 border-t border-slate-100">
                <p className="text-xs text-slate-400 text-center">
                  {BUSINESS.address.city}, {BUSINESS.address.state} {BUSINESS.address.zip}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
