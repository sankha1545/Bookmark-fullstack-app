"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
        <div className="font-semibold tracking-tight">
          Smart Bookmark
        </div>

        <nav className="hidden md:flex gap-8 text-sm">
          <a href="#security">Security</a>
          <a href="#access">Access</a>
          <a href="#pricing">Pricing</a>
          <a href="#cta">Get Started</a>
        </nav>

        <Link href="/login">
          <Button size="sm">Login</Button>
        </Link>
      </div>
    </header>
  )
}
