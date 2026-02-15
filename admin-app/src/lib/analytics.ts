import { createClient } from "@supabase/supabase-js"

/* ======================================================
   🔐 SERVER-ONLY SUPABASE ADMIN CLIENT
====================================================== */

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { persistSession: false },
  }
)

/* ======================================================
   🧮 DASHBOARD STATS
====================================================== */

export async function getDashboardStats(): Promise<{
  totalUsers: number
  activeUsers: number
  totalMessages: number
}> {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers()

  if (error) {
    console.error("User fetch error:", error)
    return {
      totalUsers: 0,
      activeUsers: 0,
      totalMessages: 0,
    }
  }

  const users = data?.users ?? []
  const totalUsers = users.length

  // 24 hour active window (safe time calc)
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)

  const activeUsers = users.filter((user) => {
    if (!user.last_sign_in_at) return false
    return new Date(user.last_sign_in_at) >= yesterday
  }).length

  const { count: totalMessages, error: messageError } =
    await supabaseAdmin
      .from("contact_messages")
      .select("*", { count: "exact", head: true })

  if (messageError) {
    console.error("Message count error:", messageError)
  }

  return {
    totalUsers,
    activeUsers,
    totalMessages: totalMessages ?? 0,
  }
}

/* ======================================================
   📊 DAILY USER REGISTRATIONS (ISO SAFE)
====================================================== */

export async function getDailyUsers(): Promise<
  { date: string; value: number }[]
> {
  const { data, error } =
    await supabaseAdmin.auth.admin.listUsers()

  if (error) {
    console.error("Daily users fetch error:", error)
    return []
  }

  const users = data?.users ?? []

  const grouped: Record<string, number> = {}

  users.forEach((user) => {
    if (!user.created_at) return

    const date = new Date(user.created_at)
      .toISOString()
      .split("T")[0]

    grouped[date] = (grouped[date] || 0) + 1
  })

  return Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({
      date,
      value: count,
    }))
}

/* ======================================================
   📈 BOOKMARK ANALYTICS (FIXED RANGE + SAFE GROUPING)
====================================================== */

export async function getBookmarksAnalytics(
  {
    type = "daily",
    range = 7,
  }: {
    type?: "daily" | "monthly" | "yearly"
    range?: number
  } = {}
): Promise<{ date: string; value: number }[]> {

  let query = supabaseAdmin
    .from("bookmarks")
    .select("created_at")

  const now = Date.now()

  /* ✅ FIXED: Stable millisecond subtraction (no timezone mutation) */
  if (type === "daily") {
    const startDate = new Date(
      now - range * 24 * 60 * 60 * 1000
    )

    query = query.gte(
      "created_at",
      startDate.toISOString()
    )
  }

  const { data, error } = await query

  if (error) {
    console.error("Bookmark analytics error:", error)
    return []
  }

  const grouped: Record<string, number> = {}

  data?.forEach((bookmark) => {
    if (!bookmark.created_at) return

    const dateObj = new Date(bookmark.created_at)
    let key = ""

    if (type === "daily") {
      key = dateObj.toISOString().split("T")[0]
    }

    if (type === "monthly") {
      key = `${dateObj.getFullYear()}-${String(
        dateObj.getMonth() + 1
      ).padStart(2, "0")}`
    }

    if (type === "yearly") {
      key = `${dateObj.getFullYear()}`
    }

    if (!key) return

    grouped[key] = (grouped[key] || 0) + 1
  })

  return Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({
      date,
      value: count,
    }))
}
