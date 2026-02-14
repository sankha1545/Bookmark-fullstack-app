"use client"

import { useState, useMemo } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

import { Button } from "@/src/components/ui/button"

type ViewMode = "daily" | "monthly" | "yearly"
type DailyRange = 7 | 30 | 60

type ChartData = {
  date: string
  bookmarks: number
}

type Props = {
  data: ChartData[]
}

export default function BookmarksLineChart({ data }: Props) {
  const [view, setView] = useState<ViewMode>("daily")
  const [dailyRange, setDailyRange] = useState<DailyRange>(7)

  /* =====================================
     FILTER + GROUPING LOGIC (SAFE)
  ===================================== */

  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return []

    const sorted = [...data].sort((a, b) =>
      a.date.localeCompare(b.date)
    )

    const now = new Date()

    if (view === "daily") {
      const cutoff = new Date()
      cutoff.setDate(now.getDate() - dailyRange)

      return sorted.filter((item) => {
        const d = new Date(item.date)
        return d >= cutoff
      })
    }

    if (view === "monthly") {
      const grouped: Record<string, number> = {}

      sorted.forEach((item) => {
        const d = new Date(item.date)

        const key = `${d.getFullYear()}-${String(
          d.getMonth() + 1
        ).padStart(2, "0")}`

        grouped[key] = (grouped[key] || 0) + item.bookmarks
      })

      return Object.entries(grouped)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, bookmarks]) => ({
          date,
          bookmarks,
        }))
    }

    if (view === "yearly") {
      const grouped: Record<string, number> = {}

      sorted.forEach((item) => {
        const year = new Date(item.date).getFullYear().toString()
        grouped[year] = (grouped[year] || 0) + item.bookmarks
      })

      return Object.entries(grouped)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, bookmarks]) => ({
          date,
          bookmarks,
        }))
    }

    return sorted
  }, [data, view, dailyRange])

  /* =====================================
     RENDER
  ===================================== */

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h3 className="text-lg font-semibold">
          Bookmarks Added Over Time
        </h3>

        {/* Main Filters */}
        <div className="flex gap-2 flex-wrap">
          {["daily", "monthly", "yearly"].map((mode) => (
            <Button
              key={mode}
              size="sm"
              variant={view === mode ? "default" : "outline"}
              onClick={() => setView(mode as ViewMode)}
            >
              {mode}
            </Button>
          ))}
        </div>
      </div>

      {/* Daily Sub Filters */}
      {view === "daily" && (
        <div className="flex gap-2">
          {[7, 30, 60].map((range) => (
            <Button
              key={range}
              size="sm"
              variant={dailyRange === range ? "default" : "outline"}
              onClick={() => setDailyRange(range as DailyRange)}
            >
              Last {range} days
            </Button>
          ))}
        </div>
      )}

      {/* Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
          />

          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12 }}
          />

          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e5e5e5",
            }}
          />

          <Line
            type="monotone"
            dataKey="bookmarks"
            stroke="#000"
            strokeWidth={3}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
            animationDuration={500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
