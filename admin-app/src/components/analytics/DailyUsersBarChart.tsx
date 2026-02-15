"use client"

import { useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

type ChartData = {
  date: string
  value: number   // ✅ match analytics.ts
}

type Props = {
  data: ChartData[]
}

export default function DailyUsersBarChart({ data }: Props) {

  /* =====================================
     SAFE NORMALIZATION
  ===================================== */
  const safeData = useMemo(() => {
    if (!Array.isArray(data)) return []

    return data
      .map((d) => ({
        date: d.date,
        value: Number(d.value) || 0,
      }))
      .filter((d) => !!d.date)
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [data])

  /* =====================================
     PROFESSIONAL DATE FORMAT
  ===================================== */
  const formatXAxis = (value: string) => {
    const d = new Date(value)
    if (isNaN(d.getTime())) return value

    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    }) // 13 Feb
  }

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm w-full space-y-4">

      {/* Header */}
      <h3 className="text-base sm:text-lg font-semibold">
        Daily User Registrations
      </h3>

      {/* Chart Wrapper */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[320px] sm:min-w-0">

          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={safeData}
              margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />

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
                formatter={(value: any) =>
                  Number.isFinite(Number(value))
                    ? Number(value)
                    : 0
                }
              />

              <Bar
                dataKey="value"   // ✅ FIXED HERE
                fill="#000"
                radius={[8, 8, 0, 0]}
                animationDuration={400}
              />

            </BarChart>
          </ResponsiveContainer>

        </div>
      </div>
    </div>
  )
}
