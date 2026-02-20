'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Users, DollarSign, Package, HeartHandshake, Shield, Truck } from 'lucide-react'

const reasons = [
  {
    icon: Users,
    title: 'Family Owned & Operated',
    description:
      'Three generations of the Gosnell family serving Western North Carolina. Greg, Rodney, and Dustin bring decades of combined automotive expertise and that old-school small-town integrity.',
    accentClass: 'text-orange-600',
    bgClass: 'bg-orange-50',
    borderClass: 'border-orange-100',
    hoverBorderClass: 'group-hover:border-orange-300',
    glowColor: 'rgba(249,115,22,0.12)',
    iconBg: 'bg-orange-100',
  },
  {
    icon: DollarSign,
    title: 'Honest Pricing, No Surprises',
    description:
      "We quote fair prices upfront — no bait-and-switch, no hidden fees. Our parts are priced to save you serious money over dealership prices, and we're always transparent about part condition.",
    accentClass: 'text-forest-700',
    bgClass: 'bg-forest-50',
    borderClass: 'border-forest-100',
    hoverBorderClass: 'group-hover:border-forest-300',
    glowColor: 'rgba(15,81,50,0.10)',
    iconBg: 'bg-forest-100',
  },
  {
    icon: Package,
    title: 'Huge Mountain Inventory',
    description:
      'Thousands of parts from hundreds of vehicles — pulled fresh daily from our rolling Blue Ridge salvage yard. Cars, trucks, SUVs, vans. Domestic and imports. Search 24/7 at Car-Part.com.',
    accentClass: 'text-orange-600',
    bgClass: 'bg-orange-50',
    borderClass: 'border-orange-100',
    hoverBorderClass: 'group-hover:border-orange-300',
    glowColor: 'rgba(249,115,22,0.12)',
    iconBg: 'bg-orange-100',
  },
  {
    icon: HeartHandshake,
    title: 'Staff Who Actually Help',
    description:
      "Our team knows every row of the yard. Call us with your VIN and we'll tell you exactly what we have. No runaround, no holding you for 20 minutes. Real people, real answers.",
    accentClass: 'text-forest-700',
    bgClass: 'bg-forest-50',
    borderClass: 'border-forest-100',
    hoverBorderClass: 'group-hover:border-forest-300',
    glowColor: 'rgba(15,81,50,0.10)',
    iconBg: 'bg-forest-100',
  },
  {
    icon: Shield,
    title: 'OEM Quality Guaranteed',
    description:
      'Original equipment manufacturer parts that fit right the first time. We test electrical components and inspect mechanical parts before they go on the shelf. Your satisfaction is our reputation.',
    accentClass: 'text-orange-600',
    bgClass: 'bg-orange-50',
    borderClass: 'border-orange-100',
    hoverBorderClass: 'group-hover:border-orange-300',
    glowColor: 'rgba(249,115,22,0.12)',
    iconBg: 'bg-orange-100',
  },
  {
    icon: Truck,
    title: 'Fast Local Service',
    description:
      "Minutes from Hendersonville and Asheville, we pull parts quickly so you're not waiting days. Need something by end of day? Call us in the morning and we'll do our best to make it happen.",
    accentClass: 'text-forest-700',
    bgClass: 'bg-forest-50',
    borderClass: 'border-forest-100',
    hoverBorderClass: 'group-hover:border-forest-300',
    glowColor: 'rgba(15,81,50,0.10)',
    iconBg: 'bg-forest-100',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 56 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 160, damping: 20, mass: 0.8 },
  },
}

const reducedCardVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
}

// Dust particles on hover
function DustParticles({ active }: { active: boolean }) {
  if (!active) return null
  return (
    <>
      {Array.from({ length: 5 }, (_, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute h-1 w-1 rounded-full bg-slate-400/40"
          initial={{
            x: 20 + Math.random() * 20,
            y: 20 + Math.random() * 20,
            opacity: 0.5,
            scale: 1,
          }}
          animate={{
            x: -10 + Math.random() * 80,
            y: -10 + Math.random() * 80,
            opacity: 0,
            scale: 0.3,
          }}
          transition={{ duration: 0.7 + Math.random() * 0.5, ease: 'easeOut' }}
          aria-hidden="true"
        />
      ))}
    </>
  )
}

export function WhyChooseUs() {
  const prefersReduced = useReducedMotion()

  return (
    <motion.section
      id="why-us"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={prefersReduced ? { duration: 0.3 } : { duration: 0.4, ease: 'easeOut' }}
      className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white"
      aria-labelledby="why-heading"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 tire-pattern opacity-30 pointer-events-none" aria-hidden="true" />
      <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-forest-50 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-orange-50 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={prefersReduced ? { duration: 0.2 } : { duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-forest-200 bg-forest-50 px-4 py-1.5 text-sm font-semibold text-forest-700 mb-4">
            Why Gosnell's?
          </div>
          <h2
            id="why-heading"
            className="font-heading text-4xl font-black text-slate-900 sm:text-5xl text-balance"
          >
            The Gosnell's{' '}
            <span className="gradient-text-orange">Difference</span>
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Dozens of salvage yards serve the Carolinas. Here's why neighbors from Henderson
            County to Asheville keep coming back.
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          role="list"
          aria-label="Reasons to choose Gosnell Used Auto Parts"
        >
          {reasons.map((reason) => (
            <HoverCard key={reason.title} reason={reason} prefersReduced={!!prefersReduced} />
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mt-14 text-center"
        >
          <p className="text-slate-500 mb-4">Still have questions? Our team is ready to help.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:+18286962500"
              className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-bold text-lg transition-colors"
            >
              (828) 696-2500
            </a>
            <span className="text-slate-300 hidden sm:inline" aria-hidden="true">·</span>
            <a
              href="tel:+18286962719"
              className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-bold text-lg transition-colors"
            >
              (828) 696-2719
            </a>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

function HoverCard({
  reason,
  prefersReduced,
}: {
  reason: (typeof reasons)[number]
  prefersReduced: boolean
}) {
  const Icon = reason.icon
  const [hovered, setHovered] = useState(false)
  const [iconRotated, setIconRotated] = useState(false)

  function handleEnter() {
    setHovered(true)
    if (!iconRotated) {
      setIconRotated(true)
      setTimeout(() => setIconRotated(false), 700)
    }
  }

  return (
    <motion.article
      variants={prefersReduced ? reducedCardVariants : cardVariants}
      role="listitem"
      className={`group relative rounded-2xl border ${reason.borderClass} ${reason.hoverBorderClass} bg-white p-6 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md`}
      onHoverStart={handleEnter}
      onHoverEnd={() => setHovered(false)}
      whileHover={
        prefersReduced
          ? {}
          : {
              y: -12,
              boxShadow: `0 24px 40px -8px rgba(0,0,0,0.10), 0 0 60px -12px ${reason.glowColor}`,
            }
      }
      whileTap={prefersReduced ? {} : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      style={{ perspective: 1000 }}
    >
      {/* Dust particles */}
      {!prefersReduced && <DustParticles active={hovered} />}

      {/* Icon – spins once on hover */}
      <motion.div
        animate={!prefersReduced && iconRotated ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${reason.iconBg} border ${reason.borderClass} shadow-sm`}
      >
        <Icon className={`h-6 w-6 ${reason.accentClass}`} aria-hidden="true" />
      </motion.div>

      {/* Content */}
      <h3 className="font-heading text-xl font-bold text-slate-900 mb-3">{reason.title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{reason.description}</p>

      {/* Bottom accent */}
      <motion.div
        className={`absolute bottom-0 left-6 right-6 h-[2px] rounded-full ${reason.accentClass.replace('text-', 'bg-')}`}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={!prefersReduced && hovered ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        style={{ originX: 'left' }}
        aria-hidden="true"
      />
    </motion.article>
  )
}
