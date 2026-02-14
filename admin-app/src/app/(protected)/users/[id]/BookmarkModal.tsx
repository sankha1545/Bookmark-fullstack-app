"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog"

import { ExternalLink } from "lucide-react"

interface Props {
  bookmark: any | null
  onClose: () => void
}

export default function BookmarkModal({
  bookmark,
  onClose,
}: Props) {
  return (
    <Dialog open={!!bookmark} onOpenChange={onClose}>
      {bookmark && (
        <DialogContent
          className="
            w-[95vw]
            sm:max-w-lg
            md:max-w-xl
            rounded-2xl
            border
            bg-background/80
            backdrop-blur-xl
            shadow-2xl
            p-6
            sm:p-8
          "
        >
          {/* ================= HEADER ================= */}
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-lg sm:text-xl md:text-2xl font-semibold break-words">
              {bookmark.title ?? "Bookmark"}
            </DialogTitle>
          </DialogHeader>

          {/* ================= CONTENT ================= */}
          <div className="mt-6 space-y-6">

            {/* URL SECTION */}
            {bookmark.url && (
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Website
                </p>

                <div
                  className="
                    flex items-start justify-between
                    gap-4
                    p-4
                    rounded-xl
                    bg-muted/40
                    border
                  "
                >
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      text-primary
                      underline
                      break-all
                      text-sm
                      sm:text-base
                    "
                  >
                    {bookmark.url}
                  </a>

                  <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                </div>
              </div>
            )}

            {/* CREATED DATE SECTION */}
            {bookmark.created_at && (
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Created At
                </p>

                <div className="p-4 rounded-xl bg-muted/40 border text-sm sm:text-base">
                  {new Date(
                    bookmark.created_at
                  ).toLocaleString()}
                </div>
              </div>
            )}

          </div>
        </DialogContent>
      )}
    </Dialog>
  )
}
