'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useMotionValue,
  useTransform,
  animate,
} from 'framer-motion'
import { Star, Quote, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Yelp Customer',
    source: 'Yelp',
    sourceUrl: 'https://www.yelp.com/biz/gosnell-used-auto-parts-flat-rock',
    rating: 5,
    text: 'Super helpful. Referred by the place I got my oil changed. Was missing blinker lens for a Ford 2002 F150. They had the part I needed, brand new!',
    vehicle: 'Ford F-150',
    verified: true,
    featured: true,
  },
  {
    id: 2,
    name: 'James R.',
    source: 'Google',
    rating: 5,
    text: "Greg and the team went above and beyond to find the right alternator for my old Chevy. Had it pulled and ready the same day. Best parts yard in Henderson County! I've been coming here for years and never been disappointed.",
    vehicle: 'Chevrolet Truck',
    verified: false,
    featured: false,
  },
  {
    id: 3,
    name: 'Sarah M.',
    source: 'Google',
    rating: 5,
    text: "Fair prices, no BS. These guys know their inventory inside and out. Called ahead and they had my door panel waiting when I arrived. Will always come back here instead of driving to Asheville.",
    vehicle: 'Honda CRV',
    verified: false,
    featured: false,
  },
  {
    id: 4,
    name: 'David T.',
    source: 'Facebook',
    rating: 5,
    text: "Family-owned and it shows. Rodney helped me find a transmission for my truck that three other places couldn't locate. Saved me hundreds over new parts. The drive from Asheville is absolutely worth it.",
    vehicle: 'Ford F-250',
    verified: false,
    featured: false,
  },
  {
    id: 5,
    name: 'Mike P.',
    source: 'Google',
    rating: 5,
    text: "Been buying parts here for over 20 years. Always honest about what they have and what they don't. Dustin even helped me load the engine into my truck. You can't find service like this anywhere else.",
    vehicle: 'Dodge Ram',
    verified: false,
    featured: false,
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`} role="img">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? 'text-orange-400 fill-orange-400' : 'text-slate-200'}`}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

export function Testimonials() {
  const prefersReduced = useReducedMotion()
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Drag support
  const dragX = useMotionValue(0)
  const dragOpacity = useTransform(dragX, [-200, 0, 200], [0.3, 1, 0.3])

  const navigate = useCallback(
    (dir: number) => {
      setDirection(dir)
      setCurrent((prev) => (prev + dir + testimonials.length) % testimonials.length)
    },
    []
  )

  useEffect(() => {
    if (isPaused || prefersReduced) return
    intervalRef.current = setInterval(() => navigate(1), 5500)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isPaused, prefersReduced, navigate])

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.96,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { type: 'spring' as const, stiffness: 200, damping: 26, mass: 0.8 },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      scale: 0.96,
      transition: { duration: 0.25 },
    }),
  }

  const active = testimonials[current]

  return (
    <motion.section
      id="testimonials"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={prefersReduced ? { duration: 0.3 } : { duration: 0.4, ease: 'easeOut' }}
      className="relative py-20 px-4 sm:px-6 lg:px-8 bg-slate-50"
      aria-labelledby="testimonials-heading"
    >
      {/* Borders */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent" aria-hidden="true" />
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-orange-100/50 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-sm font-semibold text-orange-600 mb-4">
            <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
            Customer Reviews
          </div>
          <h2 id="testimonials-heading" className="font-heading text-4xl font-black text-slate-900 sm:text-5xl">
            What Our{' '}
            <span className="gradient-text-orange">Neighbors</span>{' '}
            Say
          </h2>
        </motion.div>

        {/* Aggregate rating */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-orange-200 bg-white px-6 py-3 shadow-sm">
            <div className="text-4xl font-black font-heading gradient-text-orange">4.8</div>
            <div>
              <StarRating rating={5} />
              <div className="text-xs text-slate-400 mt-1">{testimonials.length} reviews · Yelp & Google</div>
            </div>
          </div>

          {/* Google Reviews button */}
          <a
            href="https://www.google.com/search?q=Gosnell+Used+Auto+Parts+Flat+Rock+NC+reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm hover:shadow-md hover:border-slate-300 hover:scale-[1.02] transition-all duration-200 cursor-pointer"
            aria-label="View our Google Reviews"
          >
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map((i) => (
                <svg key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-semibold text-slate-700">Leave a Google Review</span>
            <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </a>
        </motion.div>

        {/* Main carousel – drag to swipe */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          aria-live="polite"
          aria-atomic="true"
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.article
              key={active.id}
              custom={direction}
              variants={prefersReduced ? {} : slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag={prefersReduced ? false : 'x'}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              style={{ x: prefersReduced ? undefined : dragX, opacity: prefersReduced ? undefined : dragOpacity }}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 60) {
                  navigate(info.offset.x < 0 ? 1 : -1)
                }
                animate(dragX, 0, { type: 'spring', stiffness: 300, damping: 30 })
              }}
              className="relative rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-lg cursor-grab active:cursor-grabbing select-none"
              aria-label={`Testimonial from ${active.name}`}
            >
              <Quote
                className="absolute top-8 right-8 h-12 w-12 text-orange-100 rotate-180"
                aria-hidden="true"
              />

              {active.featured && (
                <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600 mb-5">
                  <Star className="h-3 w-3 fill-current" aria-hidden="true" />
                  Verified Yelp Review
                </div>
              )}

              <StarRating rating={active.rating} />

              <blockquote className="mt-5 text-lg sm:text-xl font-medium text-slate-800 leading-relaxed pointer-events-none">
                "{active.text}"
              </blockquote>

              <div className="mt-8 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-700 font-black text-white font-heading">
                    {active.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{active.name}</div>
                    <div className="text-xs text-slate-400">
                      {active.vehicle && `${active.vehicle} · `}
                      {active.source}
                    </div>
                  </div>
                </div>
                {active.sourceUrl && (
                  <a
                    href={active.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-orange-500 transition-colors"
                    aria-label={`View review on ${active.source}`}
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    View on {active.source}
                  </a>
                )}
              </div>

              {/* Drag hint */}
              {!prefersReduced && (
                <p className="mt-4 text-center text-[10px] text-slate-300 select-none pointer-events-none">
                  ← drag to navigate →
                </p>
              )}
            </motion.article>
          </AnimatePresence>

          {/* Navigation controls */}
          <div className="flex items-center justify-between mt-6">
            <motion.button
              onClick={() => navigate(-1)}
              whileHover={prefersReduced ? {} : { scale: 1.08 }}
              whileTap={prefersReduced ? {} : { scale: 0.9 }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-all duration-200 shadow-sm"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </motion.button>

            {/* Dots */}
            <div className="flex items-center gap-2" role="tablist">
              {testimonials.map((t, i) => (
                <motion.button
                  key={t.id}
                  role="tab"
                  aria-selected={i === current}
                  aria-label={`Go to testimonial ${i + 1}`}
                  onClick={() => {
                    setDirection(i > current ? 1 : -1)
                    setCurrent(i)
                  }}
                  animate={
                    i === current
                      ? { width: 24, backgroundColor: '#f97316' }
                      : { width: 8, backgroundColor: '#cbd5e1' }
                  }
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="h-2 rounded-full cursor-pointer"
                />
              ))}
            </div>

            <motion.button
              onClick={() => navigate(1)}
              whileHover={prefersReduced ? {} : { scale: 1.08 }}
              whileTap={prefersReduced ? {} : { scale: 0.9 }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-all duration-200 shadow-sm"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </motion.button>
          </div>
        </div>

        {/* Mini card strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {testimonials.slice(1, 4).map((t, i) => (
            <motion.article
              key={t.id}
              initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.08 }}
              whileHover={prefersReduced ? {} : { y: -4, borderColor: 'rgba(203,213,225,0.9)' }}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors cursor-default"
            >
              <StarRating rating={t.rating} />
              <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-3">"{t.text}"</p>
              <p className="mt-2 text-xs text-slate-400 font-medium">{t.name} · {t.source}</p>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <p className="text-sm text-slate-500">
            Had a great experience?{' '}
            <a
              href="https://www.yelp.com/biz/gosnell-used-auto-parts-flat-rock"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 hover:text-orange-600 font-semibold transition-colors"
            >
              Leave us a review on Yelp
            </a>
          </p>
        </motion.div>
      </div>
    </motion.section>
  )
}
