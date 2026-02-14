"use client"

import { Button } from "@/src/components/ui/button"

interface Props {
  currentPage: number
  totalPages: number
  setCurrentPage: (v: number | ((prev: number) => number)) => void
  direction: number
}

export default function UsersPagination({
  currentPage,
  totalPages,
  setCurrentPage,
}: Props) {
  return (
    <div className="w-full mt-8 sm:mt-10">

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Previous Button */}
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="w-full sm:w-auto"
          aria-label="Go to previous page"
        >
          Previous
        </Button>

        {/* Page Info */}
        <div className="text-sm text-muted-foreground text-center whitespace-nowrap">
          Page <span className="font-medium">{currentPage}</span> of{" "}
          <span className="font-medium">{totalPages}</span>
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="w-full sm:w-auto"
          aria-label="Go to next page"
        >
          Next
        </Button>

      </div>

    </div>
  )
}
