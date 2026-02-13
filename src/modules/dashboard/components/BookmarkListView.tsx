"use client"

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

/* =========================================
   Individual List Row Component
========================================= */

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

  /* FORMAT DATE */
  const formattedDate = format(
    new Date(bookmark.created_at),
    "PPP p"
  )

  /* DOMAIN EXTRACTION */
  const domain = useMemo(() => {
    try {
      return new URL(bookmark.url).hostname.replace("www.", "")
    } catch {
      return ""
    }
  }, [bookmark.url])

  const faviconUrl = domain
    ? `https://www.google.com/s2/favicons?sz=64&domain=${domain}`
    : null

  const [faviconError, setFaviconError] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="
        group
        flex items-center justify-between
        px-6 py-4
        border-b last:border-none
        hover:bg-muted/40
        transition-all duration-200
      "
    >

      {/* LEFT SECTION */}
      <div className="flex items-center gap-4 min-w-0">

        {/* Favourite */}
        <button
          onClick={onToggleFavourite}
          className="text-muted-foreground hover:text-yellow-500 transition-colors"
        >
          <Star
            size={18}
            className={
              bookmark.favourite
                ? "fill-yellow-400 text-yellow-500"
                : ""
            }
          />
        </button>

        {/* Favicon */}
        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center overflow-hidden border">
          {faviconUrl && !faviconError ? (
            <img
              src={faviconUrl}
              alt="favicon"
              className="w-5 h-5"
              onError={() => setFaviconError(true)}
            />
          ) : (
            <Globe size={18} className="text-muted-foreground" />
          )}
        </div>

        {/* Text */}
        <div className="min-w-0">

          <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
            {bookmark.title}
          </h3>

          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">

            <span>{domain}</span>

            <span className="opacity-40">•</span>

            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {formattedDate}
            </span>

          </div>

        </div>
      </div>

      {/* RIGHT SECTION ACTIONS */}
      <div className="
        flex items-center gap-2
        opacity-0 group-hover:opacity-100
        transition
      ">

        {/* VIEW */}
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button size="icon" variant="ghost">
            <Eye size={16} />
          </Button>
        </a>

        {/* EDIT */}
        <Button
          size="icon"
          variant="outline"
          onClick={onEdit}
        >
          <Pencil size={16} />
        </Button>

        {/* DELETE */}
        <Button
          size="icon"
          variant="destructive"
          onClick={onDelete}
        >
          <Trash2 size={16} />
        </Button>

      </div>

    </motion.div>
  )
}
