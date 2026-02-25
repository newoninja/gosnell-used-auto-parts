'use client'
import { motion, useReducedMotion } from 'framer-motion'
import { ExternalLink, Search, Database, RefreshCw, CheckCircle } from 'lucide-react'
import { BUSINESS } from '@/lib/utils'
import Link from 'next/link'

const features = [
  { icon: Search, label: 'Search by Year, Make & Model' },
  { icon: Database, label: 'Browse Our Yard Stock' },
  { icon: RefreshCw, label: 'Updated as Parts Are Pulled' },
  { icon: CheckCircle, label: 'VIN Lookup Available' },
]

export interface SpotlightPart {
  part: string
  year: string
  make: string
  model: string
  miles: string
  price: string
  id?: string
}

const fallbackRows: SpotlightPart[] = [
  { part: 'Engine Assembly', year: '2018', make: 'Ford', model: 'F-150', miles: '87K', price: '$1,850' },
  { part: 'Transmission Auto', year: '2016', make: 'Chevrolet', model: 'Silverado', miles: '94K', price: '$945' },
  { part: 'Door Front Right', year: '2019', make: 'Toyota', model: 'Tacoma', miles: '—', price: '$285' },
  { part: 'Alternator', year: '2015', make: 'Honda', model: 'Accord', miles: '—', price: '$95' },
  { part: 'Headlight Assembly', year: '2020', make: 'Dodge', model: 'Ram 1500', miles: '—', price: '$210' },
]

export function InventorySpotlight({ parts }: { parts?: SpotlightPart[] }) {
  const prefersReduced = useReducedMotion()
  const mockRows = parts && parts.length > 0 ? parts : fallbackRows

  return (
    <motion.section
      id="inventory"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={prefersReduced ? { duration: 0.3 } : { duration: 0.4, ease: 'easeOut' }}
      className="relative py-20 px-4 sm:px-6 lg:px-8 bg-slate-50"
      aria-labelledby="inventory-heading"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-forest-200 to-transparent" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-forest-200 to-transparent" aria-hidden="true" />

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={prefersReduced ? { duration: 0.3 } : { type: 'spring', stiffness: 100, damping: 18, delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-sm font-semibold text-orange-600 mb-6">
              <Database className="h-3.5 w-3.5" aria-hidden="true" />
              Live Inventory
            </div>

            <h2
              id="inventory-heading"
              className="font-heading text-4xl font-black text-slate-900 sm:text-5xl leading-tight"
            >
              Browse Our{' '}
              <span className="gradient-text-green">Yard's Inventory</span>{' '}
              Online
            </h2>

            <p className="mt-5 text-lg text-slate-500 leading-relaxed">
              Search thousands of used OEM parts 24/7 through our live inventory system at
              Car-Part.com. We pull parts daily from our Blue Ridge Mountain salvage yard.
            </p>

            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3" aria-label="Inventory features">
              {features.map((f, i) => {
                const Icon = f.icon
                return (
                  <motion.li
                    key={f.label}
                    initial={prefersReduced ? {} : { opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.07 }}
                    className="flex items-center gap-3 text-sm text-slate-700"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-forest-50 border border-forest-100">
                      <Icon className="h-4 w-4 text-forest-700" aria-hidden="true" />
                    </span>
                    {f.label}
                  </motion.li>
                )
              })}
            </ul>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link href="/inventory">
                <motion.span
                  whileHover={
                    prefersReduced
                      ? {}
                      : {
                          scale: 1.04,
                          y: -2,
                          boxShadow: '0 20px 40px -10px rgba(249,115,22,0.25)',
                        }
                  }
                  whileTap={prefersReduced ? {} : { scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="relative overflow-hidden inline-flex items-center gap-2 rounded-2xl bg-orange-500 hover:bg-orange-400 px-8 py-4 text-white font-black text-lg shadow-md transition-colors group"
                >
                  <Search className="h-5 w-5" aria-hidden="true" />
                  Browse Inventory
                </motion.span>
              </Link>
              <a
                href={BUSINESS.inventory}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 hover:border-forest-300 hover:bg-forest-50 px-6 py-4 text-slate-700 font-bold transition-all duration-300"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                Search Car-Part.com
              </a>
            </div>
          </motion.div>

          {/* Right: Browser mockup */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={prefersReduced ? { duration: 0.3 } : { type: 'spring', stiffness: 100, damping: 18, delay: 0.2 }}
            className="relative"
            aria-hidden="true"
          >
            <div className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
              {/* Title bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 border-b border-slate-200">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400/70" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400/70" />
                  <div className="h-3 w-3 rounded-full bg-green-400/70" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="flex items-center gap-2 rounded-md bg-white border border-slate-200 px-3 py-1.5 text-xs text-slate-500">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    trade3466.car-part.com
                  </div>
                </div>
              </div>

              {/* Fake inventory */}
              <div className="p-4 space-y-3 bg-white">
                <div className="flex gap-2">
                  <div className="flex-1 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center px-3">
                    <Search className="h-3.5 w-3.5 text-slate-400 mr-2" />
                    <span className="text-xs text-slate-400">Search parts...</span>
                  </div>
                  <div className="h-8 w-16 rounded-lg bg-orange-500 flex items-center justify-center">
                    <span className="text-xs text-white font-semibold">Search</span>
                  </div>
                </div>

                {mockRows.map((row, i) => (
                  <MockRow key={row.part} row={row} index={i} prefersReduced={!!prefersReduced} />
                ))}

                <div className="pt-2 text-center">
                  <Link
                    href="/inventory"
                    className="text-xs text-orange-500 hover:text-orange-600 transition-colors"
                  >
                    View all inventory →
                  </Link>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={prefersReduced ? {} : { y: [0, -7, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="absolute -top-4 -right-4 rounded-xl bg-forest-800 border border-forest-600/40 px-4 py-2 shadow-xl"
            >
              <div className="text-xs text-white font-semibold">Updated Daily</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-400">Live Inventory</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

function MockRow({
  row,
  index,
  prefersReduced,
}: {
  row: SpotlightPart
  index: number
  prefersReduced: boolean
}) {
  return (
    <motion.div
      initial={prefersReduced ? {} : { opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 + index * 0.07 }}
      animate={{
        backgroundColor: 'rgba(248,250,252,0.8)',
        borderColor: 'rgba(226,232,240,0.6)',
      }}
      whileHover={
        prefersReduced
          ? {}
          : {
              backgroundColor: 'rgba(249,115,22,0.04)',
              borderColor: 'rgba(249,115,22,0.15)',
              x: 2,
              transition: { duration: 0.2 },
            }
      }
      className="group grid grid-cols-6 gap-2 items-center py-2 px-3 rounded-lg border cursor-pointer"
    >
      <div className="col-span-2">
        <div className="text-xs font-semibold text-slate-800 truncate">{row.part}</div>
      </div>
      <div className="text-xs text-slate-400">{row.year}</div>
      <div className="text-xs text-slate-500 truncate">{row.make}</div>
      <div className="text-xs text-slate-400">{row.miles}</div>
      <div className="text-xs font-bold text-right text-green-600 transition-colors group-hover:text-orange-500">
        {row.price}
      </div>
    </motion.div>
  )
}
