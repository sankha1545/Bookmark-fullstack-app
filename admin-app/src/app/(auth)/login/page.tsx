"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, ShieldCheck, Zap, Cloud } from "lucide-react"
import { toast } from "sonner"

export default function AdminLoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()

    if (!email || !password) {
      toast.error("Please fill all fields")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Login failed")
        return
      }

      toast.success("Welcome back, Admin")
      router.push("/dashboard")
    } catch {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-100 via-neutral-50 to-pink-50 flex items-center justify-center px-6">

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-16 items-center">

        {/* LEFT SIDE — MARKETING SECTION */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
              Welcome to
              <br />
              <span className="text-black">Smart Bookmark</span>
            </h1>

            <p className="text-neutral-600 text-lg max-w-md">
              Organize, sync, and manage your entire user ecosystem securely
              across devices — in real time.
            </p>
          </div>

          <div className="space-y-4 text-neutral-600 text-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5" />
              Secure Admin Authentication
            </div>

            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5" />
              Real-Time Platform Monitoring
            </div>

            <div className="flex items-center gap-3">
              <Cloud className="w-5 h-5" />
              Cloud-Native Infrastructure
            </div>
          </div>

          <p className="text-xs text-neutral-500 pt-6">
            Built with Next.js App Router and Supabase.
          </p>
        </motion.div>

        {/* RIGHT SIDE — LOGIN CARD */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="rounded-2xl shadow-xl border bg-white">
            <CardContent className="p-10 space-y-6">

              <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold text-neutral-900">
                  Sign in to continue
                </h2>
                <p className="text-sm text-neutral-500">
                  Secure access to admin control panel.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">

                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="admin@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black hover:bg-neutral-800 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="text-center text-xs text-neutral-500 pt-4">
                This portal is restricted to authorized company officials.
              </div>

            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  )
}
