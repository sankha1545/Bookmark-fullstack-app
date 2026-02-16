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
  value: number
}

type Props = {
  data: ChartData[]
}

export default function BookmarksLineChart({ data }: Props) {
  const [view, setView] = useState<ViewMode>("daily")
  const [dailyRange, setDailyRange] = useState<DailyRange>(7)

 

  const normalizedData = useMemo(() => {
    if (!Array.isArray(data)) return []

    return data
      .map((d) => ({
        date: d.date,
        value: Number(d.value) || 0,
      }))
      .filter((d) => !!d.date)
      .sort((a, b) => a.date.localeCompare(b.date)) // ISO-safe
  }, [data])



  const filteredData = useMemo(() => {
    if (normalizedData.length === 0) return []

    const now = Date.now()

 
    if (view === "daily") {
      const cutoff = new Date(
        now - dailyRange * 24 * 60 * 60 * 1000
      ).toISOString().split("T")[0]

      return normalizedData.filter(
        (item) => item.date >= cutoff
      )
    }

  
    if (view === "monthly") {
      const grouped: Record<string, number> = {}

      normalizedData.forEach((item) => {
        const d = new Date(item.date)
        const key = `${d.getFullYear()}-${String(
          d.getMonth() + 1
        ).padStart(2, "0")}`

        grouped[key] = (grouped[key] || 0) + item.value
      })

      return Object.entries(grouped)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, value]) => ({
          date,
          value,
        }))
    }

   
    if (view === "yearly") {
      const grouped: Record<string, number> = {}

      normalizedData.forEach((item) => {
        const year = new Date(item.date)
          .getFullYear()
          .toString()

        grouped[year] =
          (grouped[year] || 0) + item.value
      })

      return Object.entries(grouped)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, value]) => ({
          date,
          value,
        }))
    }

    return normalizedData
  }, [normalizedData, view, dailyRange])



  const formatXAxis = (value: string) => {
    if (!value) return ""

    if (view === "daily") {
      const d = new Date(value)
      if (isNaN(d.getTime())) return value

      return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }) 
    }

    if (view === "monthly") {
      const [year, month] = value.split("-")
      const date = new Date(
        Number(year),
        Number(month) - 1
      )

      return date.toLocaleDateString("en-IN", {
        month: "short",
        year: "2-digit",
      }) // Feb 26
    }

    return value
  }

  const chartHeight = 260

 

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm space-y-6 w-full">

    
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h3 className="text-base sm:text-lg font-semibold">
          Bookmarks Added Over Time
        </h3>

        <div className="flex gap-2 flex-wrap">
          {(["daily", "monthly", "yearly"] as ViewMode[]).map(
            (mode) => (
              <Button
                key={mode}
                size="sm"
                variant={
                  view === mode
                    ? "default"
                    : "outline"
                }
                onClick={() => setView(mode)}
                className="capitalize"
              >
                {mode}
              </Button>
            )
          )}
        </div>
      </div>

    
      {view === "daily" && (
        <div className="flex gap-2 flex-wrap">
          {[7, 30, 60].map((range) => (
            <Button
              key={range}
              size="sm"
              variant={
                dailyRange === range
                  ? "default"
                  : "outline"
              }
              onClick={() =>
                setDailyRange(range as DailyRange)
              }
            >
              Last {range} days
            </Button>
          ))}
        </div>
      )}

     
      <div className="w-full overflow-x-auto">
        <div className="min-w-[320px] sm:min-w-0">
          <ResponsiveContainer
            width="100%"
            height={chartHeight}
          >
            <LineChart
              data={filteredData}
              margin={{
                top: 10,
                right: 20,
                left: 0,
                bottom: 10,
              }}
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
                labelFormatter={(label) =>
                  formatXAxis(label)
                }
                formatter={(value: any) =>
                  Number.isFinite(Number(value))
                    ? Number(value)
                    : 0
                }
              />

              <Line
                type="monotone"
                dataKey="value"
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
