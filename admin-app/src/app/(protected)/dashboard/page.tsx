// app/dashboard/page.tsx
import {
  getDashboardStats,
  getDailyUsers,
  getBookmarksAnalytics,
} from "@/src/lib/analytics"

import DashboardClient from "@/src/components/dashboard/DashboardClient"

export const revalidate = 60

export default async function DashboardPage() {
  const [stats, dailyUsers, bookmarksData] = await Promise.all([
    getDashboardStats(),
    getDailyUsers(),
    getBookmarksAnalytics(),
  ])

  return (
    <main className="min-h-screen px-6 py-8 lg:px-12 bg-gradient-to-b from-neutral-50 to-white dark:from-black dark:to-neutral-900 transition-colors">
      <div className="mx-auto max-w-7xl">
        <DashboardClient
          initialStats={stats}
          initialDailyUsers={dailyUsers}
          initialBookmarks={bookmarksData}
        />
      </div>
    </main>
  )
}
