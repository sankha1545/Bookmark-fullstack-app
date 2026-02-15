"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { fadeUp, staggerContainer } from "@/modules/landing/animations"
import Link from "next/link"
import {
  BarChart2,
  Target,
  Users,
  ShieldCheck,
  Cloud,
  CloudLightning,
  Calendar,
  CheckCircle,
} from "lucide-react"
import Navbar from "@/modules/landing/components/LandingNavbar"
import Footer from "@/modules/landing/components/Footer"

/**
 * AboutPage
 *
 * - Fully responsive: sticky TOC on md+, horizontal scroll TOC on mobile
 * - Scroll-spy (center of viewport)
 * - Animated counters (runs once)
 * - Keyboard navigation (ArrowUp/ArrowDown)
 * - Accessible: skip link, proper landmarks, aria-current states
 * - Defensive parsing and throttled scroll for performance
 */

const sections = [
  { id: "introduction", label: "Introduction" },
  { id: "problem", label: "Problem" },
  { id: "solution", label: "Solution" },
  { id: "technology", label: "Technology" },
  { id: "security", label: "Security" },
  { id: "values", label: "Values" },
  { id: "roadmap", label: "Roadmap" },
  { id: "team", label: "Team" },
  { id: "cta", label: "Get Started" },
]

export default function AboutPage() {
  const [active, setActive] = useState<string>("introduction")
  const [counts, setCounts] = useState({ users: 0, bookmarks: 0, syncs: 0 })
  const countersStarted = useRef(false)

  const rafRef = useRef<number | null>(null)
  const lastScroll = useRef<number>(0)

  // Scroll spy: use requestAnimationFrame to throttle
  useEffect(() => {
    function check() {
      // center of viewport
      const center = window.innerHeight / 2
      for (const section of sections) {
        const el = document.getElementById(section.id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.top <= center && rect.bottom >= center) {
          if (active !== section.id) setActive(section.id)
          break
        }
      }
      rafRef.current = null
    }

    const onScroll = () => {
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(check)
      }
      lastScroll.current = Date.now()
    }

    // initial check
    if (typeof window !== "undefined") {
      check()
      window.addEventListener("scroll", onScroll, { passive: true })
      window.addEventListener("resize", onScroll)
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // run once

  // Counters animation on intersection (runs once)
  useEffect(() => {
    const metricsEl = document.getElementById("introduction")
    if (!metricsEl) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !countersStarted.current) {
            countersStarted.current = true
            const start = performance.now()
            const duration = 1500
            const from = { users: 0, bookmarks: 0, syncs: 0 }
            const to = { users: 18542, bookmarks: 1234567, syncs: 982341 }

            const step = (now: number) => {
              const t = Math.min(1, (now - start) / duration)
              const ease = 1 - Math.pow(1 - t, 3) // easeOut cubic
              setCounts({
                users: Math.floor(from.users + (to.users - from.users) * ease),
                bookmarks: Math.floor(
                  from.bookmarks + (to.bookmarks - from.bookmarks) * ease
                ),
                syncs: Math.floor(from.syncs + (to.syncs - from.syncs) * ease),
              })
              if (t < 1) requestAnimationFrame(step)
            }
            requestAnimationFrame(step)
          }
        })
      },
      { root: null, rootMargin: "0px", threshold: 0.3 }
    )

    observer.observe(metricsEl)
    return () => observer.disconnect()
  }, [])

  // Keyboard navigation between sections via ArrowUp / ArrowDown
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        const idx = sections.findIndex((s) => s.id === active)
        if (idx === -1) return
        const nextIdx =
          e.key === "ArrowDown"
            ? Math.min(sections.length - 1, idx + 1)
            : Math.max(0, idx - 1)
        const next = sections[nextIdx]
        const el = document.getElementById(next.id)
        if (el) {
          e.preventDefault()
          el.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }
    }

    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [active])

  // Utility: smooth scroll to id (used by mobile TOC)
  const scrollToId = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  // Defensive helpers
  const safeFormatDate = (input?: string | null) => {
    if (!input) return ""
    try {
      const d = new Date(input)
      if (isNaN(d.getTime())) return ""
      return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
    } catch {
      return ""
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-primary focus:text-primary-foreground px-3 py-2 rounded"
      >
        Skip to content
      </a>

      <header className="relative z-20">
        <Navbar />
      </header>

      {/* Hero background circles */}
      <div aria-hidden className="pointer-events-none fixed left-[-220px] top-0 w-[520px] h-[520px] bg-yellow-300/14 rounded-full blur-3xl animate-[pulse_8s_infinite] mix-blend-multiply" />
      <div aria-hidden className="pointer-events-none fixed right-[-220px] bottom-0 w-[520px] h-[520px] bg-pink-400/14 rounded-full blur-3xl animate-[pulse_8s_infinite] mix-blend-multiply" />

      <main id="main" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-[260px_1fr] gap-12">
          {/* Desktop TOC */}
          <aside className="hidden md:block sticky top-28 self-start">
            <nav aria-label="On page navigation" className="space-y-6">
              <motion.ul
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="space-y-3"
              >
                {sections.map((section) => (
                  <motion.li key={section.id} variants={fadeUp}>
                    <a
                      href={`#${section.id}`}
                      onClick={(e) => {
                        e.preventDefault()
                        scrollToId(section.id)
                      }}
                      className={`block text-sm transition px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                        active === section.id
                          ? "text-primary font-semibold bg-primary/5"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                      aria-current={active === section.id ? "true" : undefined}
                    >
                      {section.label}
                    </a>
                  </motion.li>
                ))}
              </motion.ul>
            </nav>

            {/* quick action */}
            <div className="mt-8 border rounded-lg p-4 bg-card">
              <h4 className="text-sm font-semibold mb-2">Quick Actions</h4>
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  className="text-sm px-3 py-2 rounded-md bg-primary text-primary-foreground text-center"
                >
                  Open App
                </Link>
                <a
                  href="#roadmap"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToId("roadmap")
                  }}
                  className="text-sm px-3 py-2 rounded-md border text-center hover:bg-muted"
                >
                  View Roadmap
                </a>
              </div>
            </div>
          </aside>

          {/* Content column */}
          <section className="relative z-10">
            {/* Mobile TOC / quick nav */}
            <div className="md:hidden mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">On this page</h2>
                <div className="text-xs text-muted-foreground">Tap to jump</div>
              </div>

              <div className="mt-3 -mx-2 overflow-x-auto">
                <div className="flex gap-2 px-2">
                  {sections.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => scrollToId(s.id)}
                      className={`whitespace-nowrap px-3 py-1 rounded-md text-sm transition ${
                        active === s.id
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "bg-card text-muted-foreground hover:bg-muted/60"
                      }`}
                      aria-current={active === s.id ? "true" : undefined}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* INTRODUCTION */}
            <section
              id="introduction"
              className="min-h-screen flex flex-col justify-center gap-8"
              aria-labelledby="intro-heading"
            >
              <motion.div variants={fadeUp} initial="hidden" animate="visible">
                <h1 id="intro-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                  About Smart Bookmark
                </h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-3xl leading-relaxed">
                  Smart Bookmark transforms disconnected bookmarks into an always-available,
                  searchable, and collaborative knowledge layer — syncing instantly across
                  your devices while keeping your data private and secure.
                </p>
              </motion.div>

              {/* Metrics */}
              <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
                <div className="p-6 sm:p-8 rounded-2xl bg-card border text-center">
                  <BarChart2 className="mx-auto mb-3 text-foreground/70" />
                  <div className="text-2xl sm:text-3xl font-bold">{counts.users.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground mt-1">active users</div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Rapidly growing community of knowledge workers and learners.
                  </p>
                </div>

                <div className="p-6 sm:p-8 rounded-2xl bg-card border text-center">
                  <Users className="mx-auto mb-3 text-foreground/70" />
                  <div className="text-2xl sm:text-3xl font-bold">{counts.bookmarks.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground mt-1">bookmarks saved</div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Millions of links organized with tags and metadata.
                  </p>
                </div>

                <div className="p-6 sm:p-8 rounded-2xl bg-card border text-center">
                  <CloudLightning className="mx-auto mb-3 text-foreground/70" />
                  <div className="text-2xl sm:text-3xl font-bold">{counts.syncs.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground mt-1">sync events</div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Fast, reliable synchronization across tabs and devices.
                  </p>
                </div>
              </motion.div>
            </section>

            {/* PROBLEM */}
            <section id="problem" className="min-h-screen flex flex-col justify-center gap-8">
              <motion.div variants={fadeUp}>
                <h2 className="text-2xl sm:text-3xl font-semibold">The Problem</h2>
                <p className="mt-4 text-muted-foreground max-w-3xl leading-relaxed">
                  Browser bookmarks are anachronistic: they belong to a single device, lack
                  metadata, and become out of sync. Teams struggle to keep shared resources
                  organized; individuals lose context when switching devices. These friction
                  points create wasted time and cognitive overload.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="p-6 rounded-lg bg-card border">
                  <h3 className="font-semibold mb-3">Scattered Discovery</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Links are scattered through browsers, notes, chat, and email. Searching
                    across these silos is slow or impossible.
                  </p>
                </div>
                <div className="p-6 rounded-lg bg-card border">
                  <h3 className="font-semibold mb-3">Hard to Share Context</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    When you share a link, recipients often lack the context (notes, tags,
                    related resources) needed to understand why it matters.
                  </p>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="mt-6 space-y-3">
                <h4 className="font-semibold">Consequences</h4>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Duplicate effort and rediscovery</li>
                  <li>Lost knowledge when people switch teams</li>
                  <li>Context is fragmented and ephemeral</li>
                </ul>
              </motion.div>
            </section>

            {/* SOLUTION */}
            <section id="solution" className="min-h-screen flex flex-col justify-center gap-8">
              <motion.div variants={fadeUp}>
                <h2 className="text-2xl sm:text-3xl font-semibold">Our Solution</h2>
                <p className="mt-4 text-muted-foreground max-w-3xl leading-relaxed">
                  We reimagined bookmarks as a lightweight knowledge platform:
                  searchable, taggable, real-time, and private by design. Users save links
                  with metadata, organize them into collections, add notes, and instantly
                  find what they need using full-text search and filters.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="p-6 rounded-lg bg-card border">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Target /> Find Faster
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Fast indexed search with filters, tags, and natural ordering.
                  </p>
                </div>

                <div className="p-6 rounded-lg bg-card border">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle /> Contextual Notes
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Add notes and highlights so links retain context for future readers.
                  </p>
                </div>

                <div className="p-6 rounded-lg bg-card border">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Users /> Team Workflows
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Share collections with teammates, comment, and collaborate in-line.
                  </p>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="mt-6">
                <p className="text-muted-foreground">
                  The result: less time spent searching, more time on work that matters.
                </p>
              </motion.div>
            </section>

            {/* TECHNOLOGY */}
            <section id="technology" className="min-h-screen flex flex-col justify-center gap-8">
              <motion.div variants={fadeUp}>
                <h2 className="text-2xl sm:text-3xl font-semibold">Technology & Architecture</h2>
                <p className="mt-4 text-muted-foreground max-w-3xl leading-relaxed">
                  Smart Bookmark is built on proven open technologies and modern patterns that
                  enable fast iteration and global scale.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="p-6 rounded-lg bg-card border">
                  <h4 className="font-semibold">Next.js (App Router)</h4>
                  <p className="text-sm text-muted-foreground">
                    Server components, streaming, and edge-ready routes for best-in-class performance.
                  </p>
                </div>

                <div className="p-6 rounded-lg bg-card border">
                  <h4 className="font-semibold">Supabase Postgres</h4>
                  <p className="text-sm text-muted-foreground">
                    A Postgres datastore with Realtime and Row-Level Security (RLS) powering data and sync.
                  </p>
                </div>

                <div className="p-6 rounded-lg bg-card border">
                  <h4 className="font-semibold">Cloud & CI/CD</h4>
                  <p className="text-sm text-muted-foreground">
                    Containerized deployments, observability, and automated testing ensure stable rollouts.
                  </p>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="mt-6">
                <p className="text-sm text-muted-foreground">
                  We design for reliability — gradual rollouts, monitoring, and careful RLS policies are core to our operations.
                </p>
              </motion.div>
            </section>

            {/* SECURITY */}
            <section id="security" className="min-h-screen flex flex-col justify-center gap-8">
              <motion.div variants={fadeUp}>
                <h2 className="text-2xl sm:text-3xl font-semibold">Security & Privacy</h2>
                <p className="mt-4 text-muted-foreground max-w-3xl leading-relaxed">
                  Security is non-negotiable. We combine best practices across the stack to keep your data safe.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="p-6 rounded-lg bg-card border">
                  <h4 className="font-semibold flex items-center gap-2">
                    <ShieldCheck /> Authentication
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Google OAuth for authentication — no passwords stored on our servers. Use of HttpOnly cookies and secure session handling.
                  </p>
                </div>

                <div className="p-6 rounded-lg bg-card border">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Cloud /> Data Protection
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    TLS everywhere, encryption in transit, and RLS policies so rows are only visible to the owner.
                  </p>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="mt-6">
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Regular security audits and dependency scanning</li>
                  <li>Least-privilege access for internal services</li>
                  <li>Detailed logging and rate limiting on sensitive endpoints</li>
                </ul>
              </motion.div>
            </section>

            {/* VALUES */}
            <section id="values" className="min-h-screen flex flex-col justify-center gap-8">
              <motion.div variants={fadeUp}>
                <h2 className="text-2xl sm:text-3xl font-semibold">Our Values</h2>
                <p className="mt-4 text-muted-foreground max-w-3xl leading-relaxed">
                  We build with a set of principles that guide product decisions and company culture.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="p-6 rounded-lg bg-card border">
                  <h4 className="font-semibold mb-2">Privacy First</h4>
                  <p className="text-sm text-muted-foreground">Design choices that respect user data and ownership.</p>
                </div>

                <div className="p-6 rounded-lg bg-card border">
                  <h4 className="font-semibold mb-2">Simplicity</h4>
                  <p className="text-sm text-muted-foreground">Minimal friction, powerful outcomes.</p>
                </div>

                <div className="p-6 rounded-lg bg-card border">
                  <h4 className="font-semibold mb-2">Reliability</h4>
                  <p className="text-sm text-muted-foreground">Predictable, available, and observable systems.</p>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="mt-6">
                <blockquote className="border-l-4 pl-4 text-muted-foreground">
                  “Privacy and utility are not mutually exclusive. We build products that honor both.”
                </blockquote>
              </motion.div>
            </section>

            {/* ROADMAP */}
            <section id="roadmap" className="min-h-screen flex flex-col justify-center gap-8">
              <motion.div variants={fadeUp}>
                <h2 className="text-2xl sm:text-3xl font-semibold">Product Roadmap</h2>
                <p className="mt-4 text-muted-foreground max-w-3xl leading-relaxed">
                  A lean, focused roadmap — transparent and outcome-oriented. We share high-level phases so users understand what's coming.
                </p>
              </motion.div>

              <motion.ol variants={staggerContainer} className="space-y-8 mt-8">
                {[
                  {
                    quarter: "Q1 — Core",
                    title: "Core Bookmark Engine",
                    details:
                      "Robust saving, tagging, full-text search, performant listing, and basic collections.",
                  },
                  {
                    quarter: "Q2 — Sync & UX",
                    title: "Realtime Sync & UX polish",
                    details:
                      "Deep multi-tab sync optimizations, offline resilience, improved mobile UI.",
                  },
                  {
                    quarter: "Q3 — AI & Organization",
                    title: "AI Categorization & Smart Collections",
                    details:
                      "Automatic categorization, suggested tags, smart folders, and bulk actions.",
                  },
                  {
                    quarter: "Q4 — Teams & Extensions",
                    title: "Team Workspaces & Browser Extension",
                    details:
                      "Shared collections, permissions, extension for fast save & annotate, and admin controls.",
                  },
                ].map((item, i) => (
                  <motion.li key={item.quarter} variants={fadeUp} className="relative pl-10">
                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white">
                      <Calendar size={14} />
                    </div>

                    <h3 className="font-semibold">{item.quarter} — {item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2 max-w-3xl">{item.details}</p>

                    <div className="mt-3">
                      <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                        <li>Deliverable: {i + 1}.0 — engineering milestones</li>
                        <li>Beta: invite-only testing with power users</li>
                        <li>Feedback loop: in-app feedback & surveys</li>
                      </ul>
                    </div>
                  </motion.li>
                ))}
              </motion.ol>
            </section>

            {/* TEAM */}
            <section id="team" className="min-h-screen flex flex-col justify-center gap-8">
              <motion.div variants={fadeUp}>
                <h2 className="text-2xl sm:text-3xl font-semibold">Founders & Team</h2>
                <p className="mt-4 text-muted-foreground max-w-3xl leading-relaxed">
                  Small, experienced team focused on product and reliability. We iterate quickly and ship carefully.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="p-6 rounded-lg bg-card border text-center">
                  <div className="h-24 w-24 rounded-full bg-muted mx-auto mb-3" />
                  <h4 className="font-semibold">Founder</h4>
                  <p className="text-sm text-muted-foreground">Product, strategy, and engineering leadership.</p>
                </div>

                <div className="p-6 rounded-lg bg-card border text-center">
                  <div className="h-24 w-24 rounded-full bg-muted mx-auto mb-3" />
                  <h4 className="font-semibold">Lead Engineer</h4>
                  <p className="text-sm text-muted-foreground">Systems, infra, and realtime architecture.</p>
                </div>

                <div className="p-6 rounded-lg bg-card border text-center">
                  <div className="h-24 w-24 rounded-full bg-muted mx-auto mb-3" />
                  <h4 className="font-semibold">Design</h4>
                  <p className="text-sm text-muted-foreground">UX, visual systems, and product polish.</p>
                </div>
              </motion.div>
            </section>

            {/* CTA / GET STARTED */}
            <section id="cta" className="min-h-screen flex flex-col justify-center gap-8 items-center text-center border-t pt-12">
              <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl font-semibold">Ready to try Smart Bookmark?</motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground max-w-xl">
                Sign up with Google and start organizing your web immediately. Free forever plan available.
              </motion.p>

              <motion.div variants={fadeUp} className="flex gap-3 mt-4 flex-wrap justify-center">
                <Link href="/login" className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium">
                  Get Started — Free
                </Link>

                <a href="#roadmap" onClick={(e) => { e.preventDefault(); scrollToId("roadmap") }} className="px-6 py-3 rounded-lg border hover:bg-muted">
                  View Roadmap
                </a>
              </motion.div>

              <motion.p variants={fadeUp} className="text-sm text-muted-foreground mt-6 max-w-2xl">
                Questions? Reach us at <a className="underline" href="mailto:support@smartbookmark.app">support@smartbookmark.app</a>.
              </motion.p>
            </section>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
