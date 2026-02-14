import { Mail } from "lucide-react"

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
      <Mail className="w-12 h-12 mb-4 opacity-40" />
      <p className="text-lg">No messages yet</p>
      <p className="text-sm mt-2">
        Incoming contact form submissions will appear here.
      </p>
    </div>
  )
}
