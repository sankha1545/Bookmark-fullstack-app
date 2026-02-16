"use client"

import React, { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Eye, Pencil, Trash2, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Bookmark } from "@/types/bookmark"



type Props = {
  bookmarks: Bookmark[]
  onEdit: (b: Bookmark) => void
  onDelete: (b: Bookmark) => void
}

export default function BookmarkHeadlineView({ bookmarks, onEdit, onDelete }: Props) {
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

  const faviconUrl = domain ? `https://www.google.com/s2/favicons?sz=64&domain=${domain}` : null

  const [faviconError, setFaviconError] = useState(false)

 
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={
        `group flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b last:border-none hover:bg-muted/40 transition-all duration-200 focus-within:outline-none`
      }
      tabIndex={-1}
      role="listitem"
      aria-labelledby={`bookmark-title-${bookmark.id}`}
    >
      
      <div className="flex items-center gap-3 min-w-0">
        
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-muted flex items-center justify-center overflow-hidden border shrink-0 flex-shrink-0">
          {faviconUrl && !faviconError ? (
            <img
              src={faviconUrl}
              alt={`${domain || 'site'} favicon`}
              className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
              onError={() => setFaviconError(true)}
            />
          ) : (
            <Globe size={18} className="text-muted-foreground" aria-hidden />
          )}
        </div>

       
        <div className="min-w-0 flex-1">
          <h3
            id={`bookmark-title-${bookmark.id}`}
            className="text-sm sm:text-base font-semibold truncate group-hover:text-primary transition-colors"
            title={bookmark.title}
          >
            {bookmark.title}
          </h3>

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 mt-1 text-xs text-muted-foreground">
            {domain && (
              <p className="truncate">{domain}</p>
            )}

            {formattedDate && (
              <div className="flex items-center gap-2 mt-1 sm:mt-0">
                <Calendar size={12} aria-hidden />
                <span className="truncate">{formattedDate}</span>
              </div>
            )}
          </div>
        </div>
      </div>

     
      <div
        className={
          `flex items-center gap-2
          opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100
          transition-all duration-150
          `
        }
      >
       
        <a href={bookmark.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${bookmark.title}`}>
          <Button size="sm" variant="outline" className="flex items-center gap-2">
            <Eye size={14} aria-hidden />
            <span className="sr-only">View</span>
          </Button>
        </a>

       
        <Button size="sm" variant="outline" onClick={onEdit} aria-label={`Edit ${bookmark.title}`} className="flex items-center gap-2">
          <Pencil size={14} aria-hidden />
          <span className="sr-only">Edit</span>
        </Button>

     
        <Button size="sm" variant="destructive" onClick={onDelete} aria-label={`Delete ${bookmark.title}`} className="flex items-center gap-2">
          <Trash2 size={14} aria-hidden />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    </motion.div>
  )
}
