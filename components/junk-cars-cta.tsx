'use client'

import { motion } from 'framer-motion'
import { Phone, Car } from 'lucide-react'
import { BUSINESS } from '@/lib/utils'

export function JunkCarsCta() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="border-y border-slate-800 bg-slate-900"
    >
      <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 sm:py-16 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange-300 mb-5">
          <Car className="h-3.5 w-3.5" aria-hidden="true" />
          Cash for Cars
        </div>
        <h2 className="font-heading text-3xl font-black text-white sm:text-4xl lg:text-5xl">
          We Buy Junk Cars
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-slate-300 sm:text-lg">
          Got a vehicle you no longer need? We purchase end-of-life cars and trucks.
          Call us with the year, make, model, and condition for a fair offer.
        </p>
        <a
          href={BUSINESS.phones.mainHref}
          className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-orange-500 px-7 py-3 text-base font-black text-white transition-colors hover:bg-orange-400"
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          Call for a Quote
        </a>
      </div>
    </motion.section>
  )
}
