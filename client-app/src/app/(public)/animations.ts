// src/modules/landing/animations.ts
import type { Variants } from "framer-motion"

/**
 * Common easing as a cubic-bezier array (works with framer-motion types)
 * [0.16, 1, 0.3, 1] is similar to "easeOut" but typed.
 */
export const EASE_OUT: number[] = [0.16, 1, 0.3, 1]

/**
 * Simple fadeUp animation for single elements
 * - hidden -> slightly down + transparent
 * - visible -> natural position + visible
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.48,
      ease: EASE_OUT,
    },
  },
}

/**
 * A container variant that staggers children
 * Useful for lists, TOCs, or grouped sections
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
}

/**
 * Optional: small slide-in from left (typed)
 */
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.45,
      ease: EASE_OUT,
    },
  },
}

/**
 * Optional: small scale-up variant (for cards)
 */
export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.36,
      ease: EASE_OUT,
    },
  },
}
