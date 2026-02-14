import AdminShell from "@/src/components/layout/AdminShell"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminShell>{children}</AdminShell>
}
