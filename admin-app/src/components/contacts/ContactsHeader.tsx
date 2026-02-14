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
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          Contact Inbox
        </h1>
        <p className="text-muted-foreground mt-2">
          Review and manage customer inquiries.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Badge className="px-4 py-1 text-sm">
          {unreadCount} Unread
        </Badge>

        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
