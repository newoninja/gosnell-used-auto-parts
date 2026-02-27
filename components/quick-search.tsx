'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ExternalLink, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { buildInventorySearchUrl } from '@/lib/inventory-search'
import { years, makes } from '@/lib/vehicle-data'

const partTypes = [
  'Engine', 'Transmission', 'Door', 'Hood', 'Bumper', 'Fender', 'Mirror',
  'Headlight', 'Taillight', 'Alternator', 'Starter', 'Radiator', 'A/C Compressor',
  'Axle', 'Suspension', 'Wheel/Rim', 'Seat', 'Dashboard', 'Window',
  'Interior Trim', 'Other',
]

interface SelectProps {
  label: string
  id: string
  options: string[]
  value: string
  onChange: (val: string) => void
  placeholder?: string
}

function SelectField({ label, id, options, value, onChange, placeholder = 'Select...' }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors cursor-pointer"
          aria-label={label}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}

export function QuickSearch({ overlap = true }: { overlap?: boolean }) {
  const [year, setYear] = useState('')
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [partType, setPartType] = useState('')
  const searchUrl = buildInventorySearchUrl({ year, make, model, partType })
  const hasCriteria = Boolean(year || make || model.trim() || partType)

  // Build internal inventory search URL
  const internalParams = new URLSearchParams()
  if (make) internalParams.set('make', make)
  if (model.trim()) internalParams.set('model', model.trim())
  if (year) internalParams.set('year', year)
  const internalSearchUrl = `/inventory${internalParams.toString() ? `?${internalParams.toString()}` : ''}`

  return (
    <section
      id="search"
      className={`relative z-20 px-4 sm:px-6 lg:px-8 ${overlap ? '-mt-8 pb-16' : 'py-12 bg-slate-50'}`}
      aria-label="Quick parts search"
    >
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl font-black font-heading text-slate-900 flex items-center gap-2">
                <Search className="h-5 w-5 text-orange-500" aria-hidden="true" />
                Find Your Part
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Search our inventory — updated daily
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="inline-flex h-2 w-2 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
              Live inventory
            </div>
          </div>

          {/* Search Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <SelectField
              label="Year"
              id="search-year"
              options={years}
              value={year}
              onChange={setYear}
              placeholder="Any Year"
            />
            <SelectField
              label="Make"
              id="search-make"
              options={makes}
              value={make}
              onChange={setMake}
              placeholder="Any Make"
            />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="search-model" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Model
              </label>
              <input
                id="search-model"
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. F-150, Silverado"
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
              />
            </div>
            <SelectField
              label="Part Type"
              id="search-part"
              options={partTypes}
              value={partType}
              onChange={setPartType}
              placeholder="Any Part"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Browse our in-house inventory or search extended listings on{' '}
              <strong className="text-slate-600">Car-Part.com</strong>.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-400 text-white font-bold"
              >
                <a
                  href={internalSearchUrl}
                  aria-label={
                    hasCriteria
                      ? 'Search our inventory with selected filters'
                      : 'Browse all parts in our inventory'
                  }
                >
                  <Search className="h-4 w-4" aria-hidden="true" />
                  Search Our Inventory
                </a>
              </Button>
              <Button
                asChild
                variant="forest"
                size="lg"
                className="w-full sm:w-auto"
              >
                <a
                  href={searchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Search Car-Part.com"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  Search Car-Part.com
                </a>
              </Button>
            </div>
          </div>

          {/* Bottom note */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span>Can't find it online?</span>
            <a
              href="tel:+18286962500"
              className="text-orange-500 hover:text-orange-600 font-semibold transition-colors"
            >
              Call (828) 696-2500
            </a>
            <span className="hidden sm:inline">·</span>
            <span>Our staff pulls parts daily and may have what you need.</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
