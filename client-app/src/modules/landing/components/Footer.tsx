"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { fadeUp } from "../animations"
import { Github, Twitter, Linkedin, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function FooterSection() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error")
      return
    }

    try {
      setStatus("sending")
      // Replace with your real subscription API / Supabase call
      await new Promise((r) => setTimeout(r, 700))
      setStatus("sent")
      setEmail("")
      setTimeout(() => setStatus("idle"), 1800)
    } catch {
      setStatus("error")
    }
  }

  return (
    <footer role="contentinfo" className="w-full border-t bg-muted/40 py-12 sm:py-16">
      {/* Outer animation wrapper is full width */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="w-full"
      >
        {/* Inner centered container — this fixes the mobile compression */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top grid: stacks on small screens, 5 columns on md+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 mb-12 md:mb-16">
            {/* Brand + newsletter (spans 2 cols on md+) */}
            <div className="md:col-span-2 space-y-6">
              <h3 className="text-xl font-semibold tracking-tight">Smart Bookmark</h3>

              <p className="text-sm text-muted-foreground max-w-md">
                A modern, real-time bookmark manager built with Next.js and Supabase. Secure. Fast. Minimal.
              </p>

              <div className="space-y-3">
                <p className="text-sm font-medium">Stay updated</p>

                <form
                  onSubmit={handleSubscribe}
                  className="flex flex-col sm:flex-row items-stretch gap-3 w-full"
                  aria-label="Subscribe to Smart Bookmark newsletter"
                >
                  <label htmlFor="footer-newsletter" className="sr-only">
                    Email address
                  </label>

                  <Input
                    id="footer-newsletter"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 min-w-0"
                    inputMode="email"
                    aria-invalid={status === "error"}
                  />

                  <Button
                    size="sm"
                    type="submit"
                    className="w-full sm:w-auto flex-shrink-0 whitespace-nowrap"
                    aria-label="Subscribe"
                  >
                    {status === "sending" ? "Subscribing..." : status === "sent" ? "Subscribed" : "Subscribe"}
                  </Button>
                </form>

                <div aria-live="polite" className="min-h-[1.25rem]">
                  {status === "error" && <p className="text-xs text-red-500">Please enter a valid email.</p>}
                  {status === "sent" && <p className="text-xs text-green-500">Thanks — you are subscribed!</p>}
                </div>
              </div>
            </div>

            {/* Product */}
            <FooterColumn
              title="Product"
              links={[
                { label: "Security", href: "/#security", internal: true },
                { label: "Access", href: "/#access", internal: true },
                { label: "Pricing", href: "/#pricing", internal: true },
                { label: "Login", href: "/login", internal: true },
              ]}
            />

            {/* Company */}
            <FooterColumn
              title="Company"
              links={[
                { label: "About", href: "/footer/about", internal: true },
                { label: "Blog", href: "/footer/blog", internal: true },
                { label: "FAQ", href: "/footer/faq", internal: true },
                { label: "Contact", href: "/footer/contact", internal: true },
              ]}
            />

            {/* Legal */}
            <FooterColumn
              title="Legal"
              links={[
                { label: "Privacy Policy", href: "/footer/privacy-policy", internal: true },
                { label: "Terms of Service", href: "/footer/terms-of-service", internal: true },
                { label: "Cookies", href: "/footer/cookies", internal: true },
                { label: "Security", href: "/footer/security", internal: true },
              ]}
            />
          </div>

          {/* Bottom bar */}
          <div className="border-t pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} Smart Bookmark. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              {/* If these are external, replace Link with <a href="https://..."> and target="_blank" rel="noopener noreferrer" */}
              <a href="#" aria-label="GitHub" className="inline-flex items-center hover:opacity-90">
                <Github size={18} />
              </a>

              <a href="#" aria-label="Twitter" className="inline-flex items-center hover:opacity-90">
                <Twitter size={18} />
              </a>

              <a href="#" aria-label="LinkedIn" className="inline-flex items-center hover:opacity-90">
                <Linkedin size={18} />
              </a>

              <a href="#" aria-label="Email" className="inline-flex items-center hover:opacity-90">
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}

/* --- FooterColumn: helper subcomponent --- */
function FooterColumn({
  title,
  links,
}: {
  title: string
  links: { label: string; href: string; internal?: boolean }[]
}) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold uppercase tracking-wider">{title}</h4>
      <ul className="space-y-3 text-sm text-muted-foreground">
        {links.map((l) => (
          <li key={l.href}>
            {l.internal ? (
              <Link href={l.href} className="hover:underline">
                {l.label}
              </Link>
            ) : (
              <a href={l.href} className="hover:underline" target="_blank" rel="noopener noreferrer">
                {l.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
