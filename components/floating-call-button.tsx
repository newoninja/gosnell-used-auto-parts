'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Phone, X, ChevronRight } from 'lucide-react'
import { BUSINESS } from '@/lib/utils'

export function FloatingCallButton() {
  const prefersReduced = useReducedMotion()
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', handleScroll, { passive: true })

    const expandTimer = setTimeout(() => {
      if (window.innerWidth < 768) setExpanded(true)
    }, 4500)

    const collapseTimer = setTimeout(() => setExpanded(false), 10000)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(expandTimer)
      clearTimeout(collapseTimer)
    }
  }, [])

  if (dismissed) return null

  // Engine-pulse: scale 1 → 1.08 and back, 2.5s loop
  const enginePulse = prefersReduced
    ? {}
    : {
        scale: [1, 1.08, 1, 1.04, 1],
        transition: {
          duration: 2.5,
          repeat: Infinity,
          ease: [0.4, 0, 0.6, 1],
          times: [0, 0.3, 0.6, 0.8, 1],
        },
      }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={prefersReduced ? {} : { opacity: 0, y: 20, scale: 0.88 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={prefersReduced ? {} : { opacity: 0, y: 20, scale: 0.88 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-2"
          role="complementary"
          aria-label="Quick call"
        >
          {/* Dismiss */}
          <motion.button
            onClick={() => setDismissed(true)}
            whileHover={prefersReduced ? {} : { scale: 1.15 }}
            whileTap={prefersReduced ? {} : { scale: 0.9 }}
            className="hidden sm:flex items-center justify-center h-6 w-6 rounded-full bg-dark-700 border border-slate-700/40 text-slate-500 hover:text-slate-300 hover:bg-dark-600 transition-all"
            aria-label="Dismiss call button"
          >
            <X className="h-3 w-3" aria-hidden="true" />
          </motion.button>

          <div className="flex items-center gap-2">
            {/* Expanded label */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={prefersReduced ? {} : { opacity: 0, x: 20, width: 0, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, width: 'auto', scale: 1 }}
                  exit={prefersReduced ? {} : { opacity: 0, x: 20, width: 0, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="overflow-hidden"
                >
                  <a
                    href={BUSINESS.phones.mainHref}
                    className="flex items-center gap-2 rounded-2xl bg-dark-800 border border-orange-500/30 px-4 py-2.5 shadow-xl whitespace-nowrap"
                    aria-label={`Call ${BUSINESS.phones.main}`}
                  >
                    <div>
                      <div className="text-xs text-slate-400">Call us now</div>
                      <div className="text-sm font-bold text-cream">{BUSINESS.phones.main}</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-orange-400" aria-hidden="true" />
                  </a>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main phone button – engine pulse */}
            <div className="relative">
              {/* Ping rings */}
              {!prefersReduced && (
                <>
                  <motion.span
                    className="absolute inset-0 rounded-full border-2 border-orange-500/30"
                    animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                    aria-hidden="true"
                  />
                  <motion.span
                    className="absolute inset-0 rounded-full border border-orange-500/20"
                    animate={{ scale: [1, 2.2], opacity: [0.4, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
                    aria-hidden="true"
                  />
                </>
              )}

              <motion.a
                href={BUSINESS.phones.mainHref}
                onClick={() => setExpanded((e) => !e)}
                animate={enginePulse}
                whileHover={prefersReduced ? {} : {
                  scale: 1.1,
                  boxShadow: '0 0 30px rgba(249,115,22,0.6), 0 0 60px rgba(249,115,22,0.2)',
                }}
                whileTap={prefersReduced ? {} : { scale: 0.9 }}
                className="relative flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-2xl shadow-orange-500/40 cursor-pointer"
                aria-label={`Call Gosnell's at ${BUSINESS.phones.main}`}
              >
                <Phone className="h-6 w-6" aria-hidden="true" />
              </motion.a>
            </div>
          </div>

          <div className="hidden sm:flex items-center justify-center">
            <span className="text-xs text-slate-600 text-center">Mon–Fri · 8 AM–5 PM</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
