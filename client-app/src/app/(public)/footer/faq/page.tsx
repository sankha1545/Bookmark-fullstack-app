"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ChevronDown, ShieldCheck, Zap, Cloud } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { fadeUp, staggerContainer } from "@/modules/landing/animations"
import Link from "next/link"
import Navbar from "@/modules/landing/components/LandingNavbar"
import Footer from "@/modules/landing/components/Footer"

type FAQItem = {
  question: string
  answer: string
  category: string
}

const faqs: FAQItem[] = [
  {
    category: "Product",
    question: "Is Smart Bookmark free?",
    answer:
      "Yes. Smart Bookmark offers a free forever plan with unlimited bookmarks. Premium features may be introduced in the future for advanced collaboration and AI tools.",
  },
  {
    category: "Security",
    question: "How secure is my data?",
    answer:
      "We use Google OAuth authentication, encrypted HTTPS connections, and database-level Row-Level Security (RLS) to ensure your bookmarks remain private and protected.",
  },
  {
    category: "Security",
    question: "Do you store passwords?",
    answer:
      "No. Authentication is handled securely via Google OAuth. We never store or manage user passwords.",
  },
  {
    category: "Technical",
    question: "Does it support real-time sync?",
    answer:
      "Yes. Smart Bookmark is powered by Supabase Realtime, ensuring instant synchronization across multiple tabs and devices.",
  },
  {
    category: "Product",
    question: "Can I organize bookmarks with tags?",
    answer:
      "Absolutely. You can organize bookmarks using smart tags, metadata, and structured collections for better discoverability.",
  },
  {
    category: "Billing",
    question: "Will there be premium plans?",
    answer:
      "Future premium plans may include AI-powered categorization, team collaboration workspaces, and advanced analytics.",
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [search, setSearch] = useState("")

  // Live filtering (trimmed + case insensitive)
  const filteredFAQs = useMemo(() => {
    const value = search.trim().toLowerCase()
    if (!value) return faqs

    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(value) ||
        faq.answer.toLowerCase().includes(value) ||
        faq.category.toLowerCase().includes(value)
    )
  }, [search])

  // Reset open accordion if filtering removes it
  useEffect(() => {
    if (openIndex !== null && !filteredFAQs[openIndex]) {
      setOpenIndex(null)
    }
  }, [filteredFAQs, openIndex])

  return (
    <>
      <Navbar />

      <section className="relative min-h-screen px-6 py-24 overflow-hidden">

        {/* Hero Gradient Background */}
        <div className="absolute left-[-250px] top-0 w-[600px] h-[600px] bg-yellow-300/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute right-[-250px] bottom-0 w-[600px] h-[600px] bg-pink-400/30 rounded-full blur-3xl animate-pulse" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-5xl mx-auto space-y-20"
        >

          {/* HERO HEADER */}
          <motion.div variants={fadeUp} className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Frequently Asked
              <span className="block text-primary mt-2">Questions</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Everything you need to know about Smart Bookmark —
              from architecture and security to pricing and product roadmap.
            </p>

            {/* Feature Badges */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground pt-4">
              <span className="flex items-center gap-2">
                <ShieldCheck size={16} />
                Google OAuth Secure
              </span>
              <span className="flex items-center gap-2">
                <Zap size={16} />
                Real-Time Sync
              </span>
              <span className="flex items-center gap-2">
                <Cloud size={16} />
                Cloud Infrastructure
              </span>
            </div>
          </motion.div>

          {/* SEARCH BAR */}
          <motion.div variants={fadeUp} className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
            <Input
              placeholder="Search questions..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </motion.div>

          {/* FAQ LIST */}
          <motion.div variants={staggerContainer} className="space-y-4">

            {filteredFAQs.length === 0 && (
              <motion.p variants={fadeUp} className="text-center text-muted-foreground">
                No matching results found.
              </motion.p>
            )}

            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={faq.question}
                variants={fadeUp}
                className="border rounded-xl bg-card shadow-sm overflow-hidden"
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full flex justify-between items-center p-6 text-left"
                >
                  <div>
                    <p className="text-xs text-primary mb-1">
                      {faq.category}
                    </p>
                    <h3 className="font-semibold text-lg">
                      {faq.question}
                    </h3>
                  </div>

                  <ChevronDown
                    className={`transition-transform ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6 text-muted-foreground leading-relaxed"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA SECTION */}
          <motion.div
            variants={fadeUp}
            className="text-center space-y-6 pt-16 border-t"
          >
            <h2 className="text-2xl font-semibold">
              Still have questions?
            </h2>

            <p className="text-muted-foreground">
              Our team is happy to help you.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link href="/login">
                <Button size="lg" className="px-10 shadow-lg">
                  Get Started Free
                </Button>
              </Link>

              <Link href="/footer/contact">
                <Button size="lg" variant="outline" className="px-10">
                  Contact Support
                </Button>
              </Link>
            </div>

            <p className="text-xs text-muted-foreground pt-4">
              No credit card required · Free forever plan · Built with Next.js & Supabase
            </p>
          </motion.div>

        </motion.div>
      </section>

      <Footer />
    </>
  )
}
