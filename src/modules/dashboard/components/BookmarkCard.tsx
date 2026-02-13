"use client"

import { Star, Pencil, Trash2, ExternalLink, Calendar, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { useMemo, useState } from "react"

type Bookmark = {
  id: string
  title: string
  url: string
  tags: string[]
  note: string
  favourite: boolean
  created_at: string
}

type Props = {
  bookmark: Bookmark
  onEdit: () => void
  onDelete: () => void
  onToggleFavourite: () => void
}

export default function BookmarkCard({
  bookmark,
  onEdit,
  onDelete,
  onToggleFavourite,
}: Props) {

  /* ==============================
     FORMAT DATE
  ============================== */

  const formattedDate = format(
    new Date(bookmark.created_at),
    "PPP p"
  )

  /* ==============================
     EXTRACT DOMAIN FOR FAVICON
  ============================== */

  const domain = useMemo(() => {
    try {
      return new URL(bookmark.url).hostname
    } catch {
      return ""
    }
  }, [bookmark.url])

  const faviconUrl = domain
    ? `https://www.google.com/s2/favicons?sz=64&domain=${domain}`
    : null

  const [faviconError, setFaviconError] = useState(false)

  return (
    <div className="relative bg-white p-6 rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300 group">

      {/* Favourite Toggle */}
      <button
        onClick={onToggleFavourite}
        className="absolute top-4 right-4 text-muted-foreground hover:text-yellow-500 transition"
      >
        <Star
          size={18}
          className={bookmark.favourite ? "fill-yellow-400 text-yellow-500" : ""}
        />
      </button>

      {/* Header Row (Favicon + Title) */}
      <div className="flex items-start gap-3">

        {/* Favicon */}
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden border">

          {faviconUrl && !faviconError ? (
            <img
              src={faviconUrl}
              alt="favicon"
              className="w-6 h-6"
              onError={() => setFaviconError(true)}
            />
          ) : (
            <Globe size={18} className="text-muted-foreground" />
          )}

        </div>

        {/* Title + URL */}
        <div className="flex-1 min-w-0">

          <h3 className="font-semibold text-lg truncate">
            {bookmark.title}
          </h3>

          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 flex items-center gap-1 text-sm text-blue-600 hover:underline break-all"
          >
            <ExternalLink size={14} />
            {bookmark.url}
          </a>

        </div>
      </div>

      {/* Timestamp */}
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <Calendar size={14} />
        {formattedDate}
      </div>

      {/* Tags */}
      {bookmark.tags?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {bookmark.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Note */}
      {bookmark.note && (
        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
          {bookmark.note}
        </p>
      )}

      {/* Actions */}
      <div className="mt-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition">

        <Button
          size="sm"
          variant="outline"
          onClick={onEdit}
          className="flex items-center gap-2"
        >
          <Pencil size={14} />
          Edit
        </Button>

        <Button
          size="sm"
          variant="destructive"
          onClick={onDelete}
          className="flex items-center gap-2"
        >
          <Trash2 size={14} />
          Delete
        </Button>

      </div>
    </div>
  )
}
