'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { MapPin, Mountain, Users } from 'lucide-react'
import { BUSINESS } from '@/lib/utils'

const SHOP_IMAGE = 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=900&q=80'
const MOUNTAINS_IMAGE = 'https://images.unsplash.com/photo-1565118531796-763e5082d113?auto=format&fit=crop&w=600&q=80'

const milestones = [
  {
    year: 'The Beginning',
    title: 'A Family Tradition Starts',
    desc: "The Gosnell family opens a salvage yard in the foothills of the Blue Ridge Mountains, bringing honest pricing and hard work to Henderson County.",
  },
  {
    year: 'Growing Roots',
    title: 'Expanding the Yard',
    desc: "Word spreads from Hendersonville to Asheville — Gosnell's is the place for quality used parts and no-nonsense service.",
  },
  {
    year: 'Today',
    title: 'Greg, Rodney & Dustin',
    desc: 'Three family members continue the tradition. Modern online search system, thousands of parts in inventory, and the same handshake service that started it all.',
  },
]

export function AboutSection() {
  const prefersReduced = useReducedMotion()

  return (
    <motion.section
      id="about"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={prefersReduced ? { duration: 0.3 } : { duration: 0.4, ease: 'easeOut' }}
      className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white"
      aria-label="About Gosnell Used Auto Parts"
    >
      <div className="absolute inset-0 mountain-pattern opacity-20 pointer-events-none" aria-hidden="true" />
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-forest-50 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Story */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={prefersReduced ? { duration: 0.3 } : { type: 'spring', stiffness: 140, damping: 20 }}
            className="space-y-6"
          >
            <div className="space-y-4 text-base">
              <p className="text-lg text-slate-700 leading-relaxed">
                Nestled in the beautiful Flat Rock community at the foot of the Blue Ridge Mountains,{' '}
                <strong className="text-slate-900">Gosnell Used Auto Parts</strong> has been a cornerstone
                of Henderson County's automotive community for decades.
              </p>
              <p className="text-slate-500 leading-relaxed">
                Located at{' '}
                <a
                  href="https://maps.google.com/?q=110+Tabor+Road+Extension+Flat+Rock+NC+28731"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:text-orange-600 transition-colors"
                >
                  110 Tabor Road Extension, Flat Rock, NC
                </a>
                , we sit just minutes from Hendersonville and a short drive from Asheville —
                the most convenient quality salvage yard for all of WNC.
              </p>
              <p className="text-slate-500 leading-relaxed">
                Our philosophy is simple: treat every customer like a neighbor, because most of
                them are. Honest prices, straight answers, right part the first time. The mountains
                surrounding us represent the toughness and reliability we bring to every part.
              </p>
            </div>

            {/* Staff highlight */}
            <motion.div
              whileHover={prefersReduced ? {} : { borderColor: 'rgba(15,81,50,0.3)', y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="rounded-2xl border border-forest-200 bg-forest-50 p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <Users className="h-5 w-5 text-forest-700" aria-hidden="true" />
                <h3 className="font-heading font-bold text-slate-900">Meet the Team</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                <strong className="text-orange-500">Greg, Rodney, and Dustin</strong> are your
                go-to contacts at Gosnell's. Decades of hands-on experience, and they know every
                row of the yard. You'll talk to a real person — not an automated system.
              </p>
            </motion.div>

            {/* Address */}
            <div className="flex items-start gap-3 text-sm text-slate-500">
              <MapPin className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <strong className="text-slate-900 block">{BUSINESS.address.full}</strong>
                <span>Minutes from Hendersonville · 30 min from Asheville</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Photos + Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={prefersReduced ? { duration: 0.3 } : { type: 'spring', stiffness: 140, damping: 20, delay: 0.15 }}
            className="space-y-6"
          >
            {/* Photos */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { src: SHOP_IMAGE, alt: 'Auto parts and mechanics in the shop', label: 'The Shop' },
                { src: MOUNTAINS_IMAGE, alt: 'Blue Ridge Mountains – Flat Rock, NC', label: 'Blue Ridge, NC', icon: true },
              ].map(({ src, alt, label, icon }) => (
                <motion.div
                  key={label}
                  whileHover={prefersReduced ? {} : { scale: 1.03, zIndex: 10 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 shadow-sm"
                  style={{ transformOrigin: 'center' }}
                >
                  <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-xs font-semibold text-white flex items-center gap-1">
                    {icon && <Mountain className="h-3 w-3 text-orange-400" aria-hidden="true" />}
                    {label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Timeline */}
            <div className="space-y-4" role="list" aria-label="History timeline">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  role="listitem"
                  className="flex gap-4"
                >
                  <div className="flex flex-col items-center">
                    <motion.div
                      whileHover={prefersReduced ? {} : { scale: 1.15, backgroundColor: 'rgba(249,115,22,0.15)' }}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50 border border-orange-200 text-orange-600"
                    >
                      <span className="text-xs font-black">{i + 1}</span>
                    </motion.div>
                    {i < milestones.length - 1 && (
                      <div className="w-px flex-1 bg-gradient-to-b from-orange-200 to-transparent mt-2" aria-hidden="true" />
                    )}
                  </div>
                  <div className="pb-4">
                    <div className="text-xs font-semibold text-orange-500 uppercase tracking-wider mb-0.5">{m.year}</div>
                    <h4 className="font-heading font-bold text-slate-900 text-sm mb-1">{m.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{m.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
