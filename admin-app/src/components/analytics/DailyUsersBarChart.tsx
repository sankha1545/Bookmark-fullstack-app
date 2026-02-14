"use client"

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
  users: number
}

type Props = {
  data: ChartData[]
}

export default function DailyUsersBarChart({ data }: Props) {
  /* =====================================
     FORMAT DATE FOR X-AXIS
  ===================================== */
  const formatXAxis = (value: string) => {
    const d = new Date(value)
    if (isNaN(d.getTime())) return value
    return `${d.getDate()}/${d.getMonth() + 1}`
  }

  /* =====================================
     EMPTY STATE SAFETY
  ===================================== */
  const safeData = Array.isArray(data) ? data : []

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
              />

              <Bar
                dataKey="users"
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
