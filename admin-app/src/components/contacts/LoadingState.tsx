import { Loader2 } from "lucide-react"

export default function LoadingState() {
  return (
    <div className="flex items-center justify-center h-[70vh]">
      <Loader2 className="animate-spin w-8 h-8 text-primary" />
    </div>
  )
}
