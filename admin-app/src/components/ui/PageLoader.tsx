"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"

interface Props {
  show: boolean
  message?: string
}

export default function PageLoader({
  show,
  message = "Logging you out...",
}: Props) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-white/70 dark:bg-black/70 backdrop-blur-md z-[60] flex flex-col items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
