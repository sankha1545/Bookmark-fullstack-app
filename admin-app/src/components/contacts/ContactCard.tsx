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
  const initials = message.name
    .split(" ")
    .map((n) => n[0])
    .join("")

  return (
    <Card className="p-8 rounded-3xl shadow-lg hover:shadow-xl transition bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md border border-neutral-200 dark:border-neutral-800">
      <div className="flex justify-between">
        <div className="flex gap-4">
          <Avatar>
            <AvatarFallback>
              {initials}
            </AvatarFallback>
          </Avatar>

          <div>
            <h3 className="text-lg font-semibold">
              {message.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {message.email}
            </p>
          </div>
        </div>

        {!message.is_read && (
          <Badge className="bg-primary text-white">
            New
          </Badge>
        )}
      </div>

      {/* DETAILS GRID */}
      <div className="grid grid-cols-2 gap-6 mt-6 text-sm">
        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            Country
          </p>
          <p>{message.country}</p>
        </div>

        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            State
          </p>
          <p>{message.state}</p>
        </div>

        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            Phone
          </p>
          <p>
            {message.dial_code} {message.phone}
          </p>
        </div>

        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            Submitted
          </p>
          <p>
            {new Date(
              message.created_at
            ).toLocaleString()}
          </p>
        </div>
      </div>

      {/* MESSAGE */}
      <div className="mt-6">
        <p className="text-muted-foreground text-xs uppercase tracking-wide mb-2">
          Message
        </p>
        <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl text-sm leading-relaxed">
          {message.message}
        </div>
      </div>

      {!message.is_read && (
        <div className="mt-6">
          <Button
            size="sm"
            onClick={() =>
              onMarkAsRead(message.id)
            }
          >
            Mark as Read
          </Button>
        </div>
      )}
    </Card>
  )
}
