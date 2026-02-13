"use client"

import { motion } from "framer-motion"
import {
  Calendar,
  Eye,
  Pencil,
  Trash2,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { useMemo, useState } from "react"

type Bookmark = {
  id: string
  title: string
  url: string
  created_at?: string
  tags?: string[]
  note?: string
}

type Props = {
  bookmarks: Bookmark[]
  onEdit: (b: Bookmark) => void
  onDelete: (b: Bookmark) => void
}

export default function BookmarkHeadlineView({
  bookmarks,
  onEdit,
  onDelete,
}: Props) {

  return (
    <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">

      {bookmarks.map((bookmark, index) => (
        <HeadlineRow
          key={bookmark.id}
          bookmark={bookmark}
          index={index}
          onEdit={() => onEdit(bookmark)}
          onDelete={() => onDelete(bookmark)}
        />
      ))}

    </div>
  )
}

/* ==================================================
   INDIVIDUAL HEADLINE ROW COMPONENT
================================================== */

function HeadlineRow({
  bookmark,
  index,
  onEdit,
  onDelete,
}: {
  bookmark: Bookmark
  index: number
  onEdit: () => void
  onDelete: () => void
}) {

  /* FORMAT DATE */
  const formattedDate = bookmark.created_at
    ? format(new Date(bookmark.created_at), "PPP p")
    : null

  /* EXTRACT DOMAIN */
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
        group flex items-center justify-between
        px-6 py-4
        border-b last:border-none
        hover:bg-muted/40
        transition-all duration-200
      "
    >

      {/* LEFT SIDE */}
      <div className="flex items-center gap-4 min-w-0">

        {/* Favicon */}
        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center overflow-hidden border shrink-0">

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

        {/* TEXT CONTENT */}
        <div className="min-w-0">

          <h3 className="
            text-base font-semibold truncate
            group-hover:text-primary transition-colors
          ">
            {bookmark.title}
          </h3>

          {domain && (
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {domain}
            </p>
          )}

          {formattedDate && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <Calendar size={12} />
              {formattedDate}
            </div>
          )}

        </div>

      </div>

      {/* RIGHT ACTIONS */}
      <div className="
        flex items-center gap-2
        opacity-0 group-hover:opacity-100
        transition
      ">

        {/* VIEW BUTTON */}
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
          >
            <Eye size={14} />
          </Button>
        </a>

        {/* EDIT BUTTON */}
        <Button
          size="sm"
          variant="outline"
          onClick={onEdit}
          className="flex items-center gap-2"
        >
          <Pencil size={14} />
        </Button>

        {/* DELETE BUTTON */}
        <Button
          size="sm"
          variant="destructive"
          onClick={onDelete}
          className="flex items-center gap-2"
        >
          <Trash2 size={14} />
        </Button>

      </div>

    </motion.div>
  )
}
