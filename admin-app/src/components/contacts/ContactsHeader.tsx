"use client"

import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { RefreshCw } from "lucide-react"

interface Props {
  unreadCount: number
  onRefresh: () => void
}

export default function ContactsHeader({
  unreadCount,
  onRefresh,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 w-full">

      {/* ================= LEFT CONTENT ================= */}
      <div className="min-w-0">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
          Contact Inbox
        </h1>

        <p className="text-muted-foreground mt-2 text-sm sm:text-base max-w-xl">
          Review and manage customer inquiries.
        </p>
      </div>

      {/* ================= RIGHT ACTIONS ================= */}
      <div className="flex items-center gap-3 sm:gap-4 flex-wrap">

        <Badge className="px-3 sm:px-4 py-1 text-xs sm:text-sm whitespace-nowrap">
          {unreadCount} Unread
        </Badge>

        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          className="h-9 w-9 sm:h-10 sm:w-10"
          aria-label="Refresh contacts"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>

      </div>
    </div>
  )
}
