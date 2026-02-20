'use client'

import { useScroll, useSpring, motion, useReducedMotion } from 'framer-motion'

export function ScrollProgress() {
  const prefersReduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  if (prefersReduced) return null

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[100] h-[2px] origin-left bg-gradient-to-r from-forest-700 via-orange-500 to-orange-400 will-change-transform"
      style={{ scaleX }}
      aria-hidden="true"
    />
  )
}
