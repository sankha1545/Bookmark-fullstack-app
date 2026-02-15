"use client"

import { Card } from "@/src/components/ui/card"
import clsx from "clsx"

/* =========================================================
   TYPES
========================================================= */

interface Props {
  title: string
  value: number
  subtext?: string
  highlight?: boolean
}

/* =========================================================
   COMPONENT
========================================================= */

export default function StatsCard({
  title,
  value,
  subtext,
  highlight = false,
}: Props) {
  const safeValue = Number(value) || 0

  return (
    <Card
      className={clsx(
        "p-6 rounded-2xl shadow-sm transition",
        highlight
          ? "border-black bg-neutral-100 dark:bg-neutral-800"
          : "hover:shadow-md"
      )}
    >
      <div className="space-y-2">

        <p className="text-sm text-muted-foreground">
          {title}
        </p>

        <h3 className="text-3xl font-bold">
          {safeValue}
        </h3>

        {subtext && (
          <p className="text-xs text-muted-foreground">
            {subtext}
          </p>
        )}

      </div>
    </Card>
  )
}
