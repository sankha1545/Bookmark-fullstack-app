"use client"

import { Button } from "@/src/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface Props {
  currentPage: number
  totalPages: number
  setCurrentPage: (v: number) => void
  direction: number
}

export default function UsersPagination({
  currentPage,
  totalPages,
  setCurrentPage,
  direction,
}: Props) {
  return (
    <div className="flex items-center justify-between mt-10">

      <Button
        variant="outline"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((p) => p - 1)}
      >
        Previous
      </Button>

      <div className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </div>

      <Button
        variant="outline"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((p) => p + 1)}
      >
        Next
      </Button>
    </div>
  )
}
