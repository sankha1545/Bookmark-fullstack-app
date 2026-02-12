"use client"

import { Button } from "@/components/ui/button"
import { signOut } from "../services/auth.service"
import { useRouter } from "next/navigation"

export const LogoutButton = () => {
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
    router.push("/login")
  }

  return (
    <Button variant="outline" onClick={handleLogout}>
      Logout
    </Button>
  )
}
