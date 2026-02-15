import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Sidebar from "@/modules/dashboard/components/Sidebar"
import Topbar from "@/modules/dashboard/components/Topbar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  /* ======================================
     AUTH (UNCHANGED)
  ====================================== */
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string) {
          cookieStore.delete(name)
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  /* ======================================
     RESPONSIVE LAYOUT
  ====================================== */
  return (
    <div className="flex min-h-dvh w-full bg-muted/30 overflow-hidden">

      {/* SIDEBAR */}
      <Sidebar user={user} />

      {/* MAIN WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* TOPBAR */}
        <Topbar />

        {/* PAGE CONTENT */}
        <main
          className="
            flex-1
            overflow-y-auto
            overflow-x-hidden
            px-4
            sm:px-6
            lg:px-8
            py-6
          "
        >
          <div className="w-full max-w-7xl mx-auto">
            {children}
          </div>
        </main>

      </div>
    </div>
  )
}
