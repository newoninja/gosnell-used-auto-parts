'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { User, Wrench, Clock, Handshake } from 'lucide-react'

const highlights = [
  {
    icon: Clock,
    label: 'Decades of Experience',
    desc: 'Built from years of hands-on work in the salvage and auto parts industry.',
  },
  {
    icon: Wrench,
    label: 'Knows Every Part',
    desc: 'Greg can walk the yard and find what you need — no computer required.',
  },
  {
    icon: Handshake,
    label: 'Straight Shooter',
    desc: "If he has it, he'll get it to you fast. If he doesn't, he'll tell you upfront.",
  },
]

export function MeetTheOwner() {
  const prefersReduced = useReducedMotion()

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={prefersReduced ? { duration: 0.3 } : { duration: 0.5, ease: 'easeOut' }}
      className="relative py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 overflow-hidden"
      aria-labelledby="owner-heading"
    >
      {/* Decorative top border */}
      <div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent"
        aria-hidden="true"
      />
      {/* Background glow */}
      <div
        className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-orange-50 blur-3xl opacity-60 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-sm font-semibold text-orange-600 mb-4">
            <User className="h-3.5 w-3.5" aria-hidden="true" />
            Meet the Owner
          </div>
          <h2
            id="owner-heading"
            className="font-heading text-4xl font-black text-slate-900 sm:text-5xl"
          >
            Greg{' '}
            <span className="gradient-text-orange">Gosnell</span>
          </h2>
          <p className="mt-4 text-slate-500 max-w-2xl mx-auto">
            The man behind the yard. Greg has spent his career in the auto salvage business,
            building Gosnell Used Auto Parts into a trusted name across Western North Carolina.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left — Photos */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={
              prefersReduced
                ? { duration: 0.3 }
                : { type: 'spring', stiffness: 120, damping: 20 }
            }
            className="space-y-4"
          >
            {/* Primary photo */}
            <motion.div
              whileHover={prefersReduced ? {} : { scale: 1.015 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 shadow-lg"
            >
              <Image
                src="/greg-horse.jpg"
                alt="Greg Gosnell, owner of Gosnell Used Auto Parts"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm">
                  Greg Gosnell — Owner
                </span>
              </div>
            </motion.div>

            {/* Secondary photo */}
            <motion.div
              whileHover={prefersReduced ? {} : { scale: 1.015 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-slate-200 shadow-lg"
            >
              <Image
                src="/greg-fishing.jpg"
                alt="Greg Gosnell enjoying deep-sea fishing"
                fill
                className="object-cover object-[center_30%]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm">
                  Off the clock — Greg&apos;s an avid fisherman
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right — Bio + highlights */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={
              prefersReduced
                ? { duration: 0.3 }
                : { type: 'spring', stiffness: 120, damping: 20, delay: 0.1 }
            }
            className="space-y-8"
          >
            {/* Bio text */}
            <div className="space-y-4">
              <p className="text-lg text-slate-700 leading-relaxed">
                Greg Gosnell is the driving force behind Gosnell Used Auto Parts. Based in
                Flat Rock, North Carolina, he&apos;s built a reputation on doing business the
                right way — honest pricing, reliable parts, and treating every customer like a
                neighbor.
              </p>
              <p className="text-slate-500 leading-relaxed">
                Under Greg&apos;s leadership, the yard has grown into one of Henderson County&apos;s
                most trusted sources for quality used OEM parts. Whether you&apos;re a weekend DIYer,
                a local mechanic, or a body shop looking for a specific panel, Greg and his team —
                Rodney and Dustin — know the inventory inside and out and will get you what you need
                quickly.
              </p>
              <p className="text-slate-500 leading-relaxed">
                When he&apos;s not at the yard, Greg can usually be found outdoors — fishing,
                spending time with family, or enjoying the Western North Carolina mountains he
                calls home.
              </p>
            </div>

            {/* Highlight cards */}
            <div className="space-y-3">
              {highlights.map((h, i) => (
                <motion.div
                  key={h.label}
                  initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                  whileHover={
                    prefersReduced
                      ? {}
                      : { y: -2, borderColor: 'rgba(249,115,22,0.3)' }
                  }
                  className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 border border-orange-200">
                    <h.icon className="h-5 w-5 text-orange-600" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-slate-900 text-sm">{h.label}</h3>
                    <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{h.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.a
              href="/contact"
              whileHover={prefersReduced ? {} : { scale: 1.02, y: -1 }}
              whileTap={prefersReduced ? {} : { scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors"
            >
              Get in Touch with Greg&apos;s Team
            </motion.a>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
