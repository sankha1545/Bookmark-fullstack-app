"use client"
import { MotionDiv } from "@/components/motion/motion"
import React, { useMemo, useState } from "react"
import {
  Star,
  ExternalLink,
  Calendar,
  Pencil,
  Trash2,
  Eye,
  Globe,
} from "lucide-react"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Bookmark } from "@/types/bookmark"



type Props = {
  bookmarks: Bookmark[]
  onToggleFavourite: (b: Bookmark) => void
  onEdit: (b: Bookmark) => void
  onDelete: (b: Bookmark) => void
}

export default function BookmarkListView({
  bookmarks,
  onToggleFavourite,
  onEdit,
  onDelete,
}: Props) {
  if (!bookmarks || bookmarks.length === 0) {
    return (
      <div className="bg-card border rounded-2xl shadow-sm p-6 text-center text-muted-foreground">
        No bookmarks yet.
      </div>
    )
  }

  return (
    <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
      {bookmarks.map((bookmark, index) => (
        <ListRow
          key={bookmark.id}
          bookmark={bookmark}
          index={index}
          onToggleFavourite={() => onToggleFavourite(bookmark)}
          onEdit={() => onEdit(bookmark)}
          onDelete={() => onDelete(bookmark)}
        />
      ))}
    </div>
  )
}



function ListRow({
  bookmark,
  index,
  onToggleFavourite,
  onEdit,
  onDelete,
}: {
  bookmark: Bookmark
  index: number
  onToggleFavourite: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  /* FORMAT DATE (safe) */
  const formattedDate = useMemo(() => {
    try {
      // try Date parsing defensively
      const d = new Date(bookmark.created_at)
      if (isNaN(d.getTime())) return ""
      return format(d, "PPP p")
    } catch {
      return ""
    }
  }, [bookmark.created_at])

  /* DOMAIN EXTRACTION (safer) */
  const domain = useMemo(() => {
    try {
      const url = bookmark.url?.trim()
      if (!url) return ""
      const parsed = new URL(
        // if URL doesn't include protocol, try to add https
        url.startsWith("http://") || url.startsWith("https://")
          ? url
          : `https://${url}`
      )
      return parsed.hostname.replace(/^www\./i, "")
    } catch {
      return ""
    }
  }, [bookmark.url])

  const faviconUrl = domain
    ? `https://www.google.com/s2/favicons?sz=64&domain=${domain}`
    : null

  const [faviconError, setFaviconError] = useState(false)

  /* Accessibility labels */
  const titleId = `bookmark-title-${bookmark.id}`

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="
        group
        flex items-center justify-between
        gap-4
        px-4 sm:px-6 py-3 sm:py-4
        border-b last:border-none
        hover:bg-muted/40
        transition-all duration-200
      "
      role="listitem"
      aria-labelledby={titleId}
    >
      {/* LEFT: favicon + title */}
      <div className="flex items-center gap-4 min-w-0">
        {/* Favourite */}
        <button
          onClick={onToggleFavourite}
          aria-pressed={bookmark.favourite}
          aria-label={bookmark.favourite ? "Unfavourite" : "Mark as favourite"}
          className="text-muted-foreground hover:text-yellow-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-300 rounded"
        >
          <Star
            size={18}
            className={
              bookmark.favourite ? "fill-yellow-400 text-yellow-500" : ""
            }
            aria-hidden="true"
          />
          <span className="sr-only">
            {bookmark.favourite ? "Unfavourite" : "Mark as favourite"}
          </span>
        </button>

        {/* Favicon */}
        <div
          className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center overflow-hidden border flex-shrink-0"
          aria-hidden={faviconUrl ? "false" : "true"}
        >
          {faviconUrl && !faviconError ? (
            <img
              src={faviconUrl}
              alt={`${domain} favicon`}
              className="w-5 h-5 object-contain"
              onError={() => setFaviconError(true)}
              loading="lazy"
              width={20}
              height={20}
            />
          ) : (
            <Globe size={18} className="text-muted-foreground" />
          )}
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3
              id={titleId}
              className="font-semibold truncate group-hover:text-primary transition-colors text-sm sm:text-base"
              title={bookmark.title}
            >
              {bookmark.title || bookmark.url}
            </h3>

            {/* On very small screens show external link icon to open quickly */}
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:hidden inline-flex items-center gap-1 text-xs text-muted-foreground"
              aria-label={`Open ${bookmark.title || bookmark.url} in new tab`}
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={14} />
            </a>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 text-xs text-muted-foreground mt-1">
            <span className="truncate max-w-[200px] sm:max-w-[300px]">{domain}</span>

            <span className="opacity-40 hidden sm:inline">•</span>

            {formattedDate ? (
              <span className="flex items-center gap-1 mt-1 sm:mt-0">
                <Calendar size={12} />
                <span className="truncate">{formattedDate}</span>
              </span>
            ) : null}
          </div>
        </div>
      </div>

     
      <div
        className={`
          ml-2
          flex items-center gap-2
          ${/* show actions on small screens */ ""} 
          opacity-100
          sm:opacity-0 sm:group-hover:opacity-100
          transition
          whitespace-nowrap
        `}
      >
       
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex"
          aria-label={`View ${bookmark.title || domain}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Button size="icon" variant="ghost" title="View">
            <Eye size={16} />
            <span className="sr-only">View</span>
          </Button>
        </a>

        
        <Button
          size="icon"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation()
            onEdit()
          }}
          title="Edit"
        >
          <Pencil size={16} />
          <span className="sr-only">Edit</span>
        </Button>

      
        <Button
          size="icon"
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          title="Delete"
        >
          <Trash2 size={16} />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    </MotionDiv>
  )
}
