import { createClient } from "@supabase/supabase-js"
import UsersClient from "./UsersClient"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

export default async function UsersPage() {

  const { data: users, error } = await supabase
    .from("admin_user_overview")
    .select("*")

  if (error) {
    console.error(error)
    return <div>Error loading users</div>
  }

  const usersWithCounts = await Promise.all(
    (users ?? []).map(async (user) => {

      const { count } = await supabase
        .from("bookmarks")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.auth_user_id) // ✅ FIXED

      return {
        ...user,
        bookmarkCount: count ?? 0,
      }
    })
  )

  return <UsersClient initialUsers={usersWithCounts} />
}
