import { createClient } from "@supabase/supabase-js"
import UserProfileClient from "./UserProfileClient"

interface Props {
  params: Promise<{ id: string }>
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

export default async function UserDetailsPage({ params }: Props) {
  const { id } = await params  // ✅ Required in Next 16

  console.log("ROUTE ID:", id) // Debug

  const { data: user, error } = await supabase
    .from("admin_user_overview")
    .select("*")
    .eq("auth_user_id", id)
    .single()

  console.log("USER FOUND:", user)

  if (!user) {
    return (
      <div className="p-10 text-center text-muted-foreground">
        User not found.
      </div>
    )
  }

  const { data: bookmarkData } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", id)
    .order("created_at", { ascending: false })

  console.log("BOOKMARKS:", bookmarkData)

  return (
    <div className="p-8">
      <UserProfileClient
        user={user}
        bookmarks={bookmarkData ?? []}
      />
    </div>
  )
}
