"use client"

import { Mail } from "lucide-react"

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24 lg:py-32 px-4 text-center text-muted-foreground w-full">

      {/* Icon */}
      <Mail className="w-10 h-10 sm:w-12 sm:h-12 mb-4 opacity-40" />

      {/* Title */}
      <p className="text-base sm:text-lg font-medium">
        No messages yet
      </p>

      {/* Subtitle */}
      <p className="text-sm sm:text-base mt-2 max-w-md">
        Incoming contact form submissions will appear here.
      </p>

    </div>
  )
}
