import {
  getDashboardStats,
  getDailyUsers,
  getBookmarksAnalytics,
} from "@/src/lib/analytics"

import DashboardClient from "@/src/components/dashboard/DashboardClient"

export default async function DashboardPage() {
  const stats = await getDashboardStats()
  const dailyUsers = await getDailyUsers()
  const bookmarksData = await getBookmarksAnalytics()

  return (
    <DashboardClient
      initialStats={stats}
      initialDailyUsers={dailyUsers}
      initialBookmarks={bookmarksData}
    />
  )
}
