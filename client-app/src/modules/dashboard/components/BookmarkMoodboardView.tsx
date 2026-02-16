"use client"
import { MotionDiv } from "@/components/motion/motion"
import { format } from "date-fns"
import { motion } from "framer-motion"
import {
  Calendar,
  ExternalLink,
  Pencil,
  Trash2,
  Eye,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMemo, useState } from "react"
import { Bookmark } from "@/types/bookmark"


type Props = {
  bookmarks: Bookmark[]
  onEdit: (b: Bookmark) => void
  onDelete: (b: Bookmark) => void
}

export default function BookmarkMoodboardView({
  bookmarks,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">

      {bookmarks.map((bookmark, index) => (
        <MoodboardCard
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



function MoodboardCard({
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
  const formattedDate = format(
    new Date(bookmark.created_at),
    "PPP p"
  )

  /* DOMAIN EXTRACTION */
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
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="
        break-inside-avoid
        group
        relative
        p-6
        rounded-3xl
        border
        bg-gradient-to-br
        from-card
        to-muted/20
        backdrop-blur
        shadow-sm
        hover:shadow-2xl
        hover:-translate-y-1
        transition-all duration-300
      "
    >

    
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-primary/5 to-transparent transition pointer-events-none" />

    
      <div className="flex items-start justify-between mb-4 relative z-10">

        <div className="flex items-start gap-3">

         
          <div className="w-10 h-10 rounded-xl bg-white border flex items-center justify-center shadow-sm overflow-hidden">
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

         
          <div>
            <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
              {bookmark.title}
            </h3>

            <p className="text-xs text-muted-foreground mt-1">
              {domain}
            </p>
          </div>

        </div>

        
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition"
        >
          <Eye size={18} />
        </a>

      </div>

    
      {bookmark.note && (
        <p className="
          text-sm
          text-muted-foreground
          leading-relaxed
          mb-6
          relative z-10
        ">
          {bookmark.note}
        </p>
      )}

     
      {bookmark.tags && bookmark.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6 relative z-10">
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

  
      <div className="
        flex items-center justify-between
        text-xs text-muted-foreground
        border-t pt-4
        relative z-10
      ">

       
        <div className="flex items-center gap-2">
          <Calendar size={14} />
          {formattedDate}
        </div>

     
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">

          <Button
            size="sm"
            variant="outline"
            onClick={onEdit}
            className="flex items-center gap-2"
          >
            <Pencil size={14} />
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={onDelete}
            className="flex items-center gap-2"
          >
            <Trash2 size={14} />
          </Button>

        </div>

      </div>

    </MotionDiv>
  )
}
