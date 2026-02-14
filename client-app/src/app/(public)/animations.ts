// src/app/(public)/animations.ts
import { Variants } from "framer-motion";

/**
 * Simple stagger + fade-up variants used across pages (Hero, Contact, etc.)
 * Drop this file in src/app/(public)/animations.ts so ../animations resolves
 */

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.06,
    },
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};
