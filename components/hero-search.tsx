'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, ChevronDown } from 'lucide-react'
import { years, makes } from '@/lib/vehicle-data'

function HeroSelect({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder: string
}) {
  return (
    <div className="relative flex-1 min-w-0">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 pr-8 text-sm text-white placeholder:text-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors cursor-pointer"
      >
        <option value="" className="text-slate-900">
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="text-slate-900">
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/60"
        aria-hidden="true"
      />
    </div>
  )
}

export function HeroSearch() {
  const router = useRouter()
  const [year, setYear] = useState('')
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (year) params.set('year', year)
    if (make) params.set('make', make)
    if (model.trim()) params.set('model', model.trim())
    router.push(`/inventory${params.toString() ? `?${params.toString()}` : ''}`)
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-10 rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur-md sm:p-4"
      aria-label="Quick vehicle search"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <HeroSelect
          id="hero-year"
          label="Year"
          value={year}
          onChange={setYear}
          options={years}
          placeholder="Year"
        />
        <HeroSelect
          id="hero-make"
          label="Make"
          value={make}
          onChange={setMake}
          options={makes}
          placeholder="Make"
        />
        <div className="relative flex-1 min-w-0">
          <label htmlFor="hero-model" className="sr-only">
            Model
          </label>
          <input
            id="hero-model"
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Model"
            className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-orange-400 shrink-0"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          Search
        </button>
      </div>
    </motion.form>
  )
}
