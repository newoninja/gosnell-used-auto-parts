'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Cog,
  Wrench,
  Recycle,
  Truck,
  Search,
  PhoneCall,
  ArrowRight,
} from 'lucide-react'
import { BUSINESS } from '@/lib/utils'

const services = [
  {
    icon: Cog,
    title: 'Used OEM Parts',
    description:
      'Original equipment manufacturer parts at a fraction of retail price. Engines, transmissions, body panels, electrical, interior trim, and thousands more.',
    color: 'orange',
    items: ['Engines & Transmissions', 'Body Panels & Doors', 'Electrical Components', 'Interior Trim & Glass'],
  },
  {
    icon: Wrench,
    title: 'Salvage Yard Pulling',
    description:
      "Our experienced team pulls parts fresh from the yard. Need something specific? Call us with your year, make, and model — we'll locate and pull the part for you.",
    color: 'green',
    items: ['Same-Day Pulling Available', 'Staff Assistance', 'Complex Part Removal', 'Heavy Components'],
  },
  {
    icon: Search,
    title: 'Part Matching Assistance',
    description:
      "Not sure which part fits? Give us your VIN and we'll cross-reference our inventory to find an exact match — no guesswork required.",
    color: 'orange',
    items: ['VIN Lookup', 'Cross-Reference Matching', 'OEM Part Number Search', 'Phone Support Available'],
  },
  {
    icon: Truck,
    title: 'Local Delivery',
    description:
      "Can't make it to the yard? We offer local delivery options in the Henderson County area. Call to discuss availability and pricing.",
    color: 'green',
    items: ['Henderson County Coverage', 'Call for Availability', 'Hendersonville & Nearby', 'Heavy Part Delivery'],
  },
  {
    icon: Recycle,
    title: 'Scrap Metal & Recycling',
    description:
      'We accept end-of-life vehicles and responsibly recycle scrap metal and tires. Reduce your environmental footprint and get paid for your junked vehicle.',
    color: 'orange',
    items: ['Vehicle Buy-Back', 'Scrap Metal Purchase', 'Tire Recycling', 'Responsible Disposal'],
  },
  {
    icon: PhoneCall,
    title: 'Phone Parts Lookup',
    description:
      "Old school service, new school results. Call our team and describe what you need — we'll check our inventory in real time and give you availability and pricing.",
    color: 'green',
    items: ['Real-Time Inventory Check', 'Immediate Pricing', 'Part Hold Service', 'Mon–Fri Support'],
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 160, damping: 20 },
  },
}

function ServiceCard({
  service,
  prefersReduced,
}: {
  service: (typeof services)[number]
  prefersReduced: boolean
}) {
  const Icon = service.icon
  const isOrange = service.color === 'orange'
  const [iconSpun, setIconSpun] = useState(false)

  function handleEnter() {
    if (!iconSpun) {
      setIconSpun(true)
      setTimeout(() => setIconSpun(false), 650)
    }
  }

  return (
    <motion.article
      variants={prefersReduced ? {} : cardVariants}
      role="listitem"
      className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      onHoverStart={handleEnter}
      whileHover={
        prefersReduced
          ? {}
          : {
              y: -12,
              rotateX: 3,
              boxShadow: isOrange
                ? '0 20px 40px -10px rgba(0,0,0,0.10), 0 0 40px -15px rgba(249,115,22,0.20)'
                : '0 20px 40px -10px rgba(0,0,0,0.10), 0 0 40px -15px rgba(15,81,50,0.20)',
              borderColor: isOrange ? 'rgba(249,115,22,0.3)' : 'rgba(15,81,50,0.25)',
            }
      }
      whileTap={prefersReduced ? {} : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      style={{ perspective: 800, willChange: 'transform' }}
    >
      {/* Icon with spin on hover */}
      <motion.div
        animate={!prefersReduced && iconSpun ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className={`mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border shadow-sm ${
          isOrange
            ? 'bg-orange-50 border-orange-100 text-orange-600'
            : 'bg-forest-50 border-forest-100 text-forest-700'
        }`}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </motion.div>

      {/* Background tint on hover */}
      <motion.div
        className={`pointer-events-none absolute inset-0 rounded-2xl ${
          isOrange ? 'bg-orange-500/[0.02]' : 'bg-forest-700/[0.02]'
        }`}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        aria-hidden="true"
      />

      <h3 className="font-heading text-lg font-bold text-slate-900 mb-2">{service.title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed mb-5 flex-1">{service.description}</p>

      <ul className="space-y-1.5 mb-5" aria-label={`${service.title} features`}>
        {service.items.map((item) => (
          <li key={item} className="flex items-center gap-2 text-xs text-slate-500">
            <span
              className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                isOrange ? 'bg-orange-400' : 'bg-forest-500'
              }`}
              aria-hidden="true"
            />
            {item}
          </li>
        ))}
      </ul>

      {/* Animated bottom line */}
      <motion.div
        className={`h-px rounded-full ${
          isOrange
            ? 'bg-gradient-to-r from-orange-500/0 via-orange-400 to-orange-500/0'
            : 'bg-gradient-to-r from-forest-500/0 via-forest-500 to-forest-500/0'
        }`}
        initial={{ scaleX: 0, opacity: 0 }}
        whileHover={{ scaleX: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        style={{ originX: 'center' }}
        aria-hidden="true"
      />
    </motion.article>
  )
}

export function Services() {
  const prefersReduced = useReducedMotion()

  return (
    <motion.section
      id="services"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={prefersReduced ? { duration: 0.3 } : { duration: 0.4, ease: 'easeOut' }}
      className="relative py-20 px-4 sm:px-6 lg:px-8 bg-slate-50"
      aria-label="Our services"
    >
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          role="list"
          aria-label="Our services"
        >
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} prefersReduced={!!prefersReduced} />
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mt-14 rounded-2xl border border-forest-200 bg-forest-800 p-8 text-center"
        >
          <h3 className="font-heading text-2xl font-bold text-white mb-2">Not Sure What You Need?</h3>
          <p className="text-forest-100 mb-6 max-w-lg mx-auto">
            Give us a call and describe your situation. Our team has seen it all.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href={BUSINESS.phones.mainHref}
              whileHover={prefersReduced ? {} : { scale: 1.04, y: -2 }}
              whileTap={prefersReduced ? {} : { scale: 0.93 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-400 px-6 py-3 text-white font-bold shadow-lg transition-colors"
            >
              <PhoneCall className="h-4 w-4" aria-hidden="true" />
              Call {BUSINESS.phones.main}
            </motion.a>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-forest-300/40 hover:border-white/40 bg-forest-700 hover:bg-forest-600 px-6 py-3 text-white font-semibold transition-all duration-200"
            >
              Submit a Part Request
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}
