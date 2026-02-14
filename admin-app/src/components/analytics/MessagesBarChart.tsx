import StatsCard from "@/src/components/analytics/StatsCard"
import DailyUsersBarChart from "@/src/components/analytics/DailyUsersBarChart"
import BookmarksLineChart from "@/src/components/analytics/BookmarksLineChart"

import {
  getDashboardStats,
  getDailyUsers,
  getBookmarksAnalytics,
} from "@/src/lib/analytics"

export default async function DashboardPage() {
  const stats = await getDashboardStats()
  const dailyUsers = await getDailyUsers()
  const bookmarksData = await getBookmarksAnalytics()

  return (
    <div className="space-y-10">

      <h2 className="text-3xl font-bold">Dashboard Overview</h2>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatsCard title="Total Users" value={stats.totalUsers} />
        <StatsCard title="Active Users (24h)" value={stats.activeUsers} />
        <StatsCard title="Total Messages" value={stats.totalMessages} />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        <DailyUsersBarChart data={dailyUsers} />
        <BookmarksLineChart data={bookmarksData} />
      </div>

    </div>
  )
}
