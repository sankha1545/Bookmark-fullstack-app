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



  const formatXAxis = (value: string) => {
    if (view === "daily") {
      const d = new Date(value)
      return `${d.getDate()}/${d.getMonth() + 1}`
    }

    if (view === "monthly") {
      const [year, month] = value.split("-")
      return `${month}/${year.slice(2)}`
    }

    return value
  }

 

  const chartHeight = 280

 

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm space-y-6 w-full">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h3 className="text-base sm:text-lg font-semibold">
          Bookmarks Added Over Time
        </h3>

        {/* Main Filters */}
        <div className="flex gap-2 flex-wrap">
          {(["daily", "monthly", "yearly"] as ViewMode[]).map((mode) => (
            <Button
              key={mode}
              size="sm"
              variant={view === mode ? "default" : "outline"}
              onClick={() => setView(mode)}
              className="capitalize"
            >
              {mode}
            </Button>
          ))}
        </div>
      </div>

      {/* Daily Sub Filters */}
      {view === "daily" && (
        <div className="flex gap-2 flex-wrap">
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

      {/* Chart Wrapper (handles small screens safely) */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[320px] sm:min-w-0">

          <ResponsiveContainer width="100%" height={chartHeight}>
            <LineChart
              data={filteredData}
              margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                tickFormatter={formatXAxis}
                interval="preserveStartEnd"
              />

              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11 }}
              />

              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e5e5e5",
                  fontSize: "12px",
                }}
                labelFormatter={(label) => formatXAxis(label)}
              />

              <Line
                type="monotone"
                dataKey="bookmarks"
                stroke="#000"
                strokeWidth={3}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
                animationDuration={400}
              />
            </LineChart>
          </ResponsiveContainer>

        </div>
      </div>
    </div>
  )
}
