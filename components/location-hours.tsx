'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { MapPin, Clock, Phone, Printer, Navigation, CheckCircle, XCircle } from 'lucide-react'
import { BUSINESS, isCurrentlyOpen } from '@/lib/utils'

const directions = [
  {
    from: 'Hendersonville',
    distance: '~5 miles',
    instructions: "Head south on US-64 W / Asheville Hwy toward Flat Rock. Turn onto Tabor Road Extension. We're on the right.",
  },
  {
    from: 'Asheville',
    distance: '~30 miles',
    instructions: 'Take I-26 E toward Hendersonville. Exit 44 for US-64. Continue through town and into Flat Rock.',
  },
  {
    from: 'Brevard / Transylvania',
    distance: '~25 miles',
    instructions: 'Head north on US-64 E through Brevard. Continue into Henderson County through Hendersonville.',
  },
]

export function LocationHours() {
  const prefersReduced = useReducedMotion()
  const currentlyOpen = isCurrentlyOpen()
  const [mapLoaded, setMapLoaded] = useState(false)

  return (
    <motion.section
      id="location"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={prefersReduced ? { duration: 0.3 } : { duration: 0.4, ease: 'easeOut' }}
      className="relative py-20 px-4 sm:px-6 lg:px-8 bg-white"
      aria-labelledby="location-heading"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-forest-200 to-transparent" aria-hidden="true" />

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-forest-200 bg-forest-50 px-4 py-1.5 text-sm font-semibold text-forest-700 mb-4">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            Find Us
          </div>
          <h2 id="location-heading" className="font-heading text-4xl font-black text-slate-900 sm:text-5xl">
            Visit Our{' '}
            <span className="gradient-text-green">Flat Rock Yard</span>
          </h2>
          <p className="mt-4 text-slate-500 max-w-xl mx-auto">
            110 Tabor Road Extension, Flat Rock, NC — right in the heart of Henderson County,
            at the foot of the Blue Ridge.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={prefersReduced ? { duration: 0.3 } : { type: 'spring', stiffness: 90, damping: 18 }}
            className="lg:col-span-3 map-container"
          >
            {/* Iframe with fade-in on load */}
            <div
              className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-md"
              style={{ aspectRatio: '16/10' }}
            >
              {/* Loading skeleton */}
              {!mapLoaded && (
                <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 rounded-full border-2 border-forest-500 border-t-transparent animate-spin" aria-hidden="true" />
                    <span className="text-xs text-slate-400">Loading map...</span>
                  </div>
                </div>
              )}
              <motion.iframe
                title="Gosnell Used Auto Parts location"
                src="https://maps.google.com/maps?q=110+Tabor+Road+Extension,+Flat+Rock,+NC+28731&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                aria-label="Google Maps – Gosnell Used Auto Parts, 110 Tabor Road Extension, Flat Rock, NC"
                onLoad={() => setMapLoaded(true)}
                initial={prefersReduced ? {} : { opacity: 0, scale: 0.97 }}
                animate={mapLoaded ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>

            {/* Direction cards */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {directions.map((d, i) => (
                <motion.div
                  key={d.from}
                  initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  whileHover={prefersReduced ? {} : { y: -4, borderColor: 'rgba(148,163,184,0.8)' }}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition-colors shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Navigation className="h-3.5 w-3.5 text-orange-500 shrink-0" aria-hidden="true" />
                    <span className="text-sm font-semibold text-slate-900">{d.from}</span>
                  </div>
                  <span className="text-xs text-orange-500 font-mono">{d.distance}</span>
                  <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">{d.instructions}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Info panel */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={prefersReduced ? { duration: 0.3 } : { type: 'spring', stiffness: 90, damping: 18, delay: 0.1 }}
            className="lg:col-span-2 space-y-5"
          >
            {/* Open/Closed status */}
            <motion.div
              initial={prefersReduced ? {} : { opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
                currentlyOpen
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : 'border-red-200 bg-red-50 text-red-600'
              }`}
              role="status"
              aria-live="polite"
            >
              {currentlyOpen
                ? <CheckCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                : <XCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
              }
              <span className="font-semibold">{currentlyOpen ? 'Open Now' : 'Currently Closed'}</span>
              {currentlyOpen && <span className="text-xs text-green-500 ml-auto">Ready to help!</span>}
            </motion.div>

            {/* Hours */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="flex items-center gap-2 font-heading font-bold text-slate-900 text-lg mb-4">
                <Clock className="h-5 w-5 text-orange-500" aria-hidden="true" />
                Business Hours
              </h3>
              <table className="w-full text-sm" aria-label="Business hours">
                <tbody className="divide-y divide-slate-100">
                  {BUSINESS.hours.map((h) => (
                    <tr key={h.days}>
                      <td className="py-2.5 font-medium text-slate-800">{h.days}</td>
                      <td className="py-2.5 text-right">
                        {h.isOpen ? (
                          <span className="text-forest-700 font-mono text-xs">
                            {h.open} – {h.close}
                          </span>
                        ) : (
                          <span className="text-slate-400">Closed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-4 text-xs text-slate-400">All times Eastern Time (ET)</p>
            </div>

            {/* Contact info */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h3 className="font-heading font-bold text-slate-900 text-lg">Contact Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" aria-hidden="true" />
                  <address className="not-italic text-slate-600 leading-relaxed">
                    <a
                      href="https://maps.google.com/?q=110+Tabor+Road+Extension+Flat+Rock+NC+28731"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-orange-500 transition-colors"
                    >
                      110 Tabor Road Extension<br />Flat Rock, NC 28731
                    </a>
                  </address>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-orange-500 shrink-0" aria-hidden="true" />
                  <div className="space-y-1">
                    <a href={BUSINESS.phones.mainHref} className="block text-slate-700 hover:text-orange-500 transition-colors font-medium">
                      {BUSINESS.phones.main} (Main)
                    </a>
                    <a href={BUSINESS.phones.secondaryHref} className="block text-slate-600 hover:text-orange-500 transition-colors">
                      {BUSINESS.phones.secondary} (Secondary)
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <Printer className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Fax: {BUSINESS.phones.fax}</span>
                </div>
              </div>
              <motion.a
                href="https://maps.google.com/?q=110+Tabor+Road+Extension+Flat+Rock+NC+28731"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={prefersReduced ? {} : { scale: 1.02, y: -1 }}
                whileTap={prefersReduced ? {} : { scale: 0.97 }}
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-forest-800 hover:bg-forest-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors"
                aria-label="Get directions to Gosnell Used Auto Parts"
              >
                <Navigation className="h-4 w-4" aria-hidden="true" />
                Get Directions
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
