"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Loader2 } from "lucide-react"

interface Props {
  open: boolean
  onClose: () => void
  onCreate: (title: string, url: string) => Promise<void>
}

export default function AddBookmarkModal({
  open,
  onClose,
  onCreate,
}: Props) {
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /* ESC CLOSE */
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }

    if (open) {
      window.addEventListener("keydown", handleKey)
    }

    return () => window.removeEventListener("keydown", handleKey)
  }, [open, onClose])

  if (!open) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim() || !url.trim()) {
      setError("Title and URL are required")
      return
    }

    try {
      setLoading(true)
      setError(null)

      // 🔥 Delegate creation to Dashboard
      await onCreate(title.trim(), url.trim())

      // Reset form
      setTitle("")
      setUrl("")

      onClose()

    } catch (err: any) {
      console.error("Create error:", err)
      setError(err.message || "Failed to add bookmark")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-neutral-950 w-full max-w-md rounded-2xl shadow-xl p-8 z-10 animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">
            Add New Bookmark
          </h2>

          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-2 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium">
              Title
            </label>
            <Input
              placeholder="e.g. Supabase Docs"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              URL
            </label>
            <Input
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Add Bookmark
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
