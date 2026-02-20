'use client'

import { useEffect, useState, useCallback } from 'react'
import { Command } from 'cmdk'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import {
  Search,
  Phone,
  MapPin,
  Clock,
  Car,
  Home,
  Info,
  MessageSquare,
  Wrench,
  Star,
  ChevronRight,
} from 'lucide-react'
import { BUSINESS } from '@/lib/utils'

type CommandItem = {
  id: string
  label: string
  sublabel?: string
  icon: React.ElementType
  onSelect: () => void
  group: string
}

export function CommandMenu() {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const toggle = useCallback(() => setOpen((o) => !o), [])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        toggle()
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggle])

  const navigateToSection = useCallback(
    (route: string, id: string) => {
      const target = `${route}#${id}`
      setOpen(false)

      if (pathname === route) {
        const section = document.getElementById(id)
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' })
          return
        }
      }

      router.push(target)
    },
    [pathname, router]
  )

  const items: CommandItem[] = [
    {
      id: 'search-inventory',
      label: 'Search Parts Inventory',
      sublabel: 'Opens Car-Part.com',
      icon: Search,
      group: 'Inventory',
      onSelect: () => {
        window.open(BUSINESS.inventory, '_blank', 'noopener,noreferrer')
        setOpen(false)
      },
    },
    {
      id: 'request-part',
      label: 'Request a Part',
      sublabel: 'Go to contact form',
      icon: Car,
      group: 'Inventory',
      onSelect: () => {
        navigateToSection('/contact', 'contact')
      },
    },
    {
      id: 'call-main',
      label: 'Call Main Line',
      sublabel: BUSINESS.phones.main,
      icon: Phone,
      group: 'Contact',
      onSelect: () => {
        window.location.href = BUSINESS.phones.mainHref
        setOpen(false)
      },
    },
    {
      id: 'call-secondary',
      label: 'Call Secondary Line',
      sublabel: BUSINESS.phones.secondary,
      icon: Phone,
      group: 'Contact',
      onSelect: () => {
        window.location.href = BUSINESS.phones.secondaryHref
        setOpen(false)
      },
    },
    {
      id: 'directions',
      label: 'Get Directions',
      sublabel: BUSINESS.address.full,
      icon: MapPin,
      group: 'Contact',
      onSelect: () => {
        window.open(
          'https://maps.google.com/?q=110+Tabor+Road+Extension+Flat+Rock+NC+28731',
          '_blank',
          'noopener,noreferrer'
        )
        setOpen(false)
      },
    },
    {
      id: 'home',
      label: 'Go Home',
      icon: Home,
      group: 'Navigate',
      onSelect: () => {
        router.push('/')
        setOpen(false)
      },
    },
    {
      id: 'about',
      label: 'About Us',
      sublabel: 'Our story & team',
      icon: Info,
      group: 'Navigate',
      onSelect: () => {
        navigateToSection('/about', 'about')
      },
    },
    {
      id: 'services',
      label: 'Our Services',
      icon: Wrench,
      group: 'Navigate',
      onSelect: () => {
        navigateToSection('/services', 'services')
      },
    },
    {
      id: 'reviews',
      label: 'Customer Reviews',
      icon: Star,
      group: 'Navigate',
      onSelect: () => {
        navigateToSection('/about', 'testimonials')
      },
    },
    {
      id: 'hours',
      label: 'Business Hours',
      sublabel: 'Mon–Thu 8–5, Fri 8–4',
      icon: Clock,
      group: 'Info',
      onSelect: () => {
        navigateToSection('/contact', 'location')
      },
    },
    {
      id: 'contact-form',
      label: 'Contact Us',
      sublabel: 'Send a message',
      icon: MessageSquare,
      group: 'Info',
      onSelect: () => {
        navigateToSection('/contact', 'contact')
      },
    },
  ]

  const groups = Array.from(new Set(items.map((i) => i.group)))

  const filtered = query
    ? items.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.sublabel?.toLowerCase().includes(query.toLowerCase())
      )
    : items

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[60] bg-dark-950/80 backdrop-blur-md"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-1/2 top-[15vh] z-[61] w-full max-w-lg -translate-x-1/2"
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
          >
            <Command
              className="rounded-2xl border border-slate-700/50 bg-dark-800 shadow-2xl overflow-hidden"
              shouldFilter={false}
            >
              {/* Search input */}
              <div className="flex items-center gap-3 border-b border-slate-700/40 px-4 py-3">
                <Search className="h-4 w-4 text-slate-500 shrink-0" aria-hidden="true" />
                <Command.Input
                  value={query}
                  onValueChange={setQuery}
                  placeholder="Search inventory, call us, get directions..."
                  className="flex-1 bg-transparent text-sm text-cream placeholder:text-slate-500 focus:outline-none"
                  aria-label="Command search"
                />
                <kbd className="hidden sm:flex items-center gap-0.5 rounded border border-slate-700 bg-dark-700 px-1.5 py-0.5 text-xs text-slate-500">
                  ESC
                </kbd>
              </div>

              <Command.List
                className="max-h-[400px] overflow-y-auto p-2 scrollbar-thin"
                aria-label="Command options"
              >
                <Command.Empty className="py-8 text-center text-sm text-slate-500">
                  No results for "{query}"
                </Command.Empty>

                {(query ? ['Results'] : groups).map((group) => {
                  const groupItems = query
                    ? filtered
                    : filtered.filter((i) => i.group === group)
                  if (groupItems.length === 0) return null

                  return (
                    <Command.Group key={group} heading={group}>
                      <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600">
                        {query ? 'Results' : group}
                      </div>
                      {groupItems.map((item) => {
                        const Icon = item.icon
                        return (
                          <Command.Item
                            key={item.id}
                            value={item.id}
                            onSelect={item.onSelect}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm cursor-pointer transition-colors hover:bg-dark-700 data-[selected]:bg-dark-700 data-[selected]:text-cream text-slate-300 group"
                            aria-label={item.label}
                          >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-dark-600 border border-slate-700/30 text-slate-400 group-data-[selected]:text-orange-400 transition-colors">
                              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                            </span>
                            <span className="flex-1 min-w-0">
                              <span className="block font-medium text-cream truncate">
                                {item.label}
                              </span>
                              {item.sublabel && (
                                <span className="block text-xs text-slate-500 truncate">
                                  {item.sublabel}
                                </span>
                              )}
                            </span>
                            <ChevronRight
                              className="h-4 w-4 text-slate-600 group-data-[selected]:text-slate-400 shrink-0"
                              aria-hidden="true"
                            />
                          </Command.Item>
                        )
                      })}
                    </Command.Group>
                  )
                })}
              </Command.List>

              {/* Footer */}
              <div className="border-t border-slate-700/40 px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <kbd className="rounded border border-slate-700 bg-dark-700 px-1 py-0.5 text-slate-500">↑↓</kbd>
                    navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="rounded border border-slate-700 bg-dark-700 px-1 py-0.5 text-slate-500">↵</kbd>
                    select
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <kbd className="rounded border border-slate-700 bg-dark-700 px-1 py-0.5 text-slate-500">⌘K</kbd>
                  toggle
                </div>
              </div>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
