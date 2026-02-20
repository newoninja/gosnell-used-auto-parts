'use client'

import { useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
} from 'framer-motion'
import { ChevronDown, Search, Phone, MapPin, Clock } from 'lucide-react'
import { BUSINESS } from '@/lib/utils'

const HERO_IMAGE = '/hendersonville.jpg'

const stats = [
  { label: 'Years Serving WNC', value: '30+' },
  { label: 'Parts in Inventory', value: '10K+' },
  { label: 'Happy Customers', value: '5K+' },
  { label: 'Five-Star Reviews', value: '★ 4.8' },
]

const headline = ['Quality', 'Used', 'Auto', 'Parts']

// ─── Magnetic Button ──────────────────────────────────────────────────────────
function MagneticCTA({
  href,
  children,
  variant = 'primary',
  external = false,
  prefersReduced = false,
}: {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  external?: boolean
  prefersReduced?: boolean
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 350, damping: 30 })
  const springY = useSpring(y, { stiffness: 350, damping: 30 })
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (prefersReduced) return
      const rect = ref.current?.getBoundingClientRect()
      if (!rect) return
      x.set((e.clientX - rect.left - rect.width / 2) * 0.18)
      y.set((e.clientY - rect.top - rect.height / 2) * 0.18)
    },
    [prefersReduced, x, y]
  )

  const handleMouseLeave = useCallback(() => {
    x.set(0)
    y.set(0)
    setHovered(false)
  }, [x, y])

  const isPrimary = variant === 'primary'

  return (
    <motion.a
      ref={ref}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.92 }}
      animate={
        !prefersReduced && hovered
          ? {
              boxShadow: isPrimary
                ? '0 0 40px rgba(249,115,22,0.6), 0 0 80px rgba(249,115,22,0.2)'
                : '0 0 30px rgba(15,81,50,0.4)',
            }
          : { boxShadow: 'none' }
      }
      transition={{ duration: 0.25 }}
      className={`relative overflow-hidden inline-flex items-center justify-center gap-3 rounded-2xl px-8 py-4 text-lg font-black transition-colors duration-200 w-full sm:w-auto cursor-pointer select-none ${
        isPrimary
          ? 'bg-orange-500 hover:bg-orange-400 text-white shadow-xl'
          : 'border-2 border-white/20 hover:border-forest-500 hover:bg-forest-900/50 text-cream backdrop-blur-sm'
      }`}
    >
      {/* Shimmer sweep */}
      {!prefersReduced && (
        <motion.span
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
          initial={{ x: '-110%' }}
          animate={hovered ? { x: '110%' } : { x: '-110%' }}
          transition={{ duration: 0.55, ease: 'easeInOut' }}
          aria-hidden="true"
        />
      )}
      {children}
    </motion.a>
  )
}

// ─── Word reveal variant ───────────────────────────────────────────────────────
const wordContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.5 },
  },
}

const wordItem = {
  hidden: { opacity: 0, y: 48, rotateX: -25 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { type: 'spring', stiffness: 130, damping: 16, mass: 0.8 },
  },
}

export function Hero() {
  const prefersReduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', prefersReduced ? '0%' : '28%'])
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, prefersReduced ? 1 : 1.08])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen flex flex-col overflow-hidden"
      aria-label="Hero – Gosnell Used Auto Parts"
    >
      {/* ─── Parallax Background ─────────────────────────────── */}
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0 z-0 will-change-transform"
        aria-hidden="true"
      >
        <Image
          src={HERO_IMAGE}
          alt="Salvage yard with mountain backdrop – Flat Rock, NC"
          fill
          priority
          quality={90}
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/60 to-transparent" />
      </motion.div>

      {/* Tire track SVG pattern – fades in on load */}
      <motion.div
        className="absolute inset-0 z-[1] pointer-events-none opacity-[0.035]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.035 }}
        transition={{ duration: 2, delay: 1.2 }}
        aria-hidden="true"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 28px,
            rgba(249,115,22,0.6) 28px,
            rgba(249,115,22,0.6) 30px
          ), repeating-linear-gradient(
            90deg,
            transparent,
            transparent 60px,
            rgba(249,115,22,0.4) 60px,
            rgba(249,115,22,0.4) 62px
          )`,
        }}
      />

      {/* Mountain silhouette bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 h-28 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 112'%3E%3Cpath d='M0 112 L200 40 L360 70 L520 18 L700 55 L880 8 L1040 42 L1200 22 L1360 60 L1440 28 L1440 112 Z' fill='%23f8fafc'/%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
          backgroundPosition: 'bottom',
        }}
        aria-hidden="true"
      />

      {/* ─── Content ─────────────────────────────────────────── */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-20 flex flex-1 flex-col items-center justify-center px-4 pt-24 pb-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-5xl text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-5 py-2 text-sm font-semibold text-orange-300 backdrop-blur-sm"
          >
            <MapPin className="h-3.5 w-3.5 text-orange-400" aria-hidden="true" />
            Family-Owned · Flat Rock, NC · Est. in the Blue Ridge Mountains
          </motion.div>

          {/* Animated headline – word by word spring */}
          <div className="overflow-hidden" style={{ perspective: 1200 }}>
            <motion.h1
              variants={prefersReduced ? {} : wordContainer}
              initial="hidden"
              animate="visible"
              className="font-heading text-5xl font-black leading-[0.92] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl"
              aria-label="Quality Used Auto Parts from the Blue Ridge"
            >
              {headline.map((word, i) => (
                <motion.span
                  key={word}
                  variants={prefersReduced ? {} : wordItem}
                  className="inline-block mr-3 will-change-transform"
                  style={
                    i === 2
                      ? {
                          background: 'linear-gradient(135deg, #f97316, #fb923c, #fbbf24)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }
                      : {}
                  }
                >
                  {word}
                </motion.span>
              ))}
              <br />
              <motion.span
                variants={prefersReduced ? {} : wordItem}
                className="inline-block text-4xl font-bold text-slate-200 sm:text-5xl lg:text-6xl will-change-transform"
              >
                from the Blue Ridge
              </motion.span>
            </motion.h1>
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 140, damping: 20, delay: 0.95 }}
            className="mx-auto mt-7 max-w-2xl text-lg text-slate-300 leading-relaxed sm:text-xl"
          >
            Mountain-tough parts at honest prices.{' '}
            <span className="text-orange-400 font-semibold">Greg, Rodney & Dustin</span>{' '}
            serve Henderson County, Hendersonville & Asheville with straight talk and fair deals.
          </motion.p>

          {/* CTA Buttons – Magnetic */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 130, damping: 18, delay: 1.1 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <MagneticCTA
              href={BUSINESS.inventory}
              variant="primary"
              external
              prefersReduced={!!prefersReduced}
            >
              <Search className="h-5 w-5" aria-hidden="true" />
              Search Our Inventory
            </MagneticCTA>

            <MagneticCTA
              href="/contact"
              variant="secondary"
              prefersReduced={!!prefersReduced}
            >
              Request a Part
            </MagneticCTA>
          </motion.div>

          {/* Google Reviews badge */}
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22, delay: 1.25 }}
            className="mt-7 flex justify-center"
          >
            <a
              href="https://www.google.com/search?q=Gosnell+Used+Auto+Parts+Flat+Rock+NC+reviews"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-4 rounded-2xl bg-white/95 backdrop-blur-sm px-5 py-3 shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all duration-200 border border-white/60 cursor-pointer"
              aria-label="View our Google Reviews"
            >
              {/* Stars */}
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map((i) => (
                  <svg key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              {/* Rating text */}
              <div className="leading-tight">
                <span className="font-black text-slate-900 text-base">4.8</span>
                <span className="text-slate-500 text-sm font-medium"> · Google Reviews</span>
              </div>
              {/* Google G logo */}
              <svg className="h-7 w-7 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </a>
          </motion.div>

          {/* Quick contact */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 1.35 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-6 text-sm"
          >
            <a
              href={BUSINESS.phones.mainHref}
              className="flex items-center gap-2 text-slate-300 hover:text-orange-400 transition-colors duration-200"
            >
              <Phone className="h-4 w-4 text-orange-500" aria-hidden="true" />
              {BUSINESS.phones.main}
            </a>
            <span className="text-slate-600 hidden sm:inline" aria-hidden="true">·</span>
            <a
              href={BUSINESS.phones.secondaryHref}
              className="flex items-center gap-2 text-slate-300 hover:text-orange-400 transition-colors duration-200"
            >
              <Phone className="h-4 w-4 text-orange-500" aria-hidden="true" />
              {BUSINESS.phones.secondary}
            </a>
            <span className="text-slate-600 hidden sm:inline" aria-hidden="true">·</span>
            <span className="flex items-center gap-2 text-slate-300">
              <Clock className="h-4 w-4 text-forest-400" aria-hidden="true" />
              Mon–Thu 8–5, Fri 8–4
            </span>
          </motion.div>
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 110, damping: 18, delay: 1.4 }}
          className="mt-16 w-full max-w-4xl mx-auto"
        >
          <div className="glass-dark rounded-2xl border border-white/10 p-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={prefersReduced ? {} : { opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 + i * 0.08, type: 'spring', stiffness: 200, damping: 18 }}
                className="text-center"
              >
                <div className="text-2xl font-black font-heading gradient-text-orange sm:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-slate-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.7 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="text-[10px] text-slate-600 tracking-[0.2em] uppercase">Scroll</span>
        <motion.div
          animate={prefersReduced ? {} : { y: [0, 9, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-5 w-5 text-orange-500/50" />
        </motion.div>
      </motion.div>
    </section>
  )
}
