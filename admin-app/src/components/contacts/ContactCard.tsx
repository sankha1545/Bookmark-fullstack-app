"use client"

import { Card } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar"
import { Message } from "@/src/app/(protected)/contacts/page"

interface Props {
  message: Message
  onMarkAsRead: (id: string) => void
}

export default function ContactCard({
  message,
  onMarkAsRead,
}: Props) {
  /* =====================================
     SAFE INITIALS GENERATION
  ===================================== */
  const initials = message.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const formattedDate = new Date(
    message.created_at
  ).toLocaleString()

  return (
    <Card className="w-full p-4 sm:p-6 lg:p-8 rounded-3xl shadow-lg hover:shadow-xl transition bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md border border-neutral-200 dark:border-neutral-800">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

        <div className="flex gap-4 items-start min-w-0">
          <Avatar className="shrink-0">
            <AvatarFallback>
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold truncate">
              {message.name}
            </h3>

            <p className="text-sm text-muted-foreground break-all">
              {message.email}
            </p>
          </div>
        </div>

        {!message.is_read && (
          <Badge className="bg-primary text-white self-start sm:self-auto">
            New
          </Badge>
        )}
      </div>

      {/* ================= DETAILS GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6 text-sm">

        <div className="min-w-0">
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            Country
          </p>
          <p className="break-words">{message.country}</p>
        </div>

        <div className="min-w-0">
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            State
          </p>
          <p className="break-words">{message.state}</p>
        </div>

        <div className="min-w-0">
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            Phone
          </p>
          <p className="break-words">
            {message.dial_code} {message.phone}
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            Submitted
          </p>
          <p className="break-words">{formattedDate}</p>
        </div>
      </div>

      {/* ================= MESSAGE ================= */}
      <div className="mt-6">
        <p className="text-muted-foreground text-xs uppercase tracking-wide mb-2">
          Message
        </p>

        <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl text-sm leading-relaxed break-words whitespace-pre-wrap">
          {message.message}
        </div>
      </div>

      {/* ================= ACTION ================= */}
      {!message.is_read && (
        <div className="mt-6">
          <Button
            size="sm"
            onClick={() => onMarkAsRead(message.id)}
            className="w-full sm:w-auto"
          >
            Mark as Read
          </Button>
        </div>
      )}
    </Card>
  )
}
