"use client"

import { motion } from "framer-motion"
import type { HTMLMotionProps } from "framer-motion"

type Props = {
  step: number
} & HTMLMotionProps<"div">

export default function Spotlight({ step, ...props }: Props) {
  return (
    <motion.div
      key={step}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 0.35, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      // className="absolute inset-0 pointer-events-none"
      {...props}
    >
      <div className="absolute inset-0 bg-primary/20 blur-3xl" />
    </motion.div>
  )
}
