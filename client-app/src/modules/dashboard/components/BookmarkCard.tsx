"use client"

import { Star, Pencil, Trash2, ExternalLink, Calendar, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { useMemo, useState } from "react"

type Bookmark = {
  id: string
  title: string
  url: string
  tags?: string[]
  note?: string
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
  const formattedDate = format(new Date(bookmark.created_at), "PPP p")

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
    <article
      aria-labelledby={`bookmark-title-${bookmark.id}`}
      className="group relative bg-white dark:bg-card p-4 sm:p-6 rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col gap-3 sm:gap-4"
    >
      {/* Top row: Title + favicon + favourite (desktop layout uses same order) */}
      <div className="flex items-start gap-3 sm:gap-4">
        {/* favicon */}
        <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-muted/20 dark:bg-muted/10 flex items-center justify-center overflow-hidden border">
          {faviconUrl && !faviconError ? (
            // plain img is fine here — keep src small
            <img
              src={faviconUrl}
              alt={`${domain || "favicon"}`}
              className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
              onError={() => setFaviconError(true)}
            />
          ) : (
            <Globe size={18} className="text-muted-foreground" aria-hidden />
          )}
        </div>

        {/* Title + URL */}
        <div className="min-w-0 flex-1">
          <h3
            id={`bookmark-title-${bookmark.id}`}
            className="font-semibold text-base sm:text-lg leading-snug truncate"
            title={bookmark.title}
          >
            {bookmark.title || bookmark.url}
          </h3>

          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-2 text-sm text-sky-600 hover:underline break-words max-w-full"
            title={bookmark.url}
          >
            <ExternalLink size={14} aria-hidden />
            <span className="truncate max-w-[60vw] sm:max-w-[40vw] md:max-w-[30vw] lg:max-w-[24vw]">
              {bookmark.url}
            </span>
          </a>
        </div>

        {/* Favourite toggle (right aligned) */}
        <div className="flex-shrink-0 ml-2">
          <button
            onClick={onToggleFavourite}
            aria-pressed={bookmark.favourite}
            aria-label={bookmark.favourite ? "Unmark favourite" : "Mark favourite"}
            className="p-2 rounded-md hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            title={bookmark.favourite ? "Unmark favourite" : "Mark favourite"}
          >
            <Star
              size={18}
              className={
                bookmark.favourite
                  ? "text-yellow-500 fill-yellow-400"
                  : "text-muted-foreground"
              }
            />
          </button>
        </div>
      </div>

      {/* Meta row: date + tags (stacked on small screens) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar size={14} />
          <span>{formattedDate}</span>
        </div>

        {/* Tags */}
        {bookmark.tags && bookmark.tags.length > 0 && (
          <div className="mt-2 sm:mt-0 flex flex-wrap gap-2">
            {bookmark.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-1 bg-muted/30 dark:bg-muted/20 rounded-md text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Note */}
      {bookmark.note && (
        <p
          className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2"
          title={bookmark.note}
        >
          {bookmark.note}
        </p>
      )}

      {/* Actions */}
      <div className="mt-3 flex items-center justify-between gap-3">
        {/* Left side (empty for now, reserved) */}
        <div />

        {/* Buttons: visible on touch by default, on desktop show on hover */}
        <div className="flex items-center gap-2 ml-auto opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
          <Button
            size="sm"
            variant="outline"
            onClick={onEdit}
            className="flex items-center gap-2"
            aria-label="Edit bookmark"
          >
            <Pencil size={14} />
            <span className="hidden sm:inline">Edit</span>
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={onDelete}
            className="flex items-center gap-2"
            aria-label="Delete bookmark"
          >
            <Trash2 size={14} />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      </div>
    </article>
  )
}
