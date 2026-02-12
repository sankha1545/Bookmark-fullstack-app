"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { fadeUp, staggerContainer } from "@/modules/landing/animations"
import Link from "next/link"

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

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen px-6 py-24 max-w-5xl mx-auto space-y-20">

      {/* HERO HEADER */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-center space-y-6"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Frequently Asked Questions
        </h1>

        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Everything you need to know about Smart Bookmark —
          from security and architecture to pricing and features.
        </p>
      </motion.div>

      {/* SEARCH BAR */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="relative max-w-xl mx-auto"
      >
        <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
        <Input
          placeholder="Search questions..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </motion.div>

      {/* FAQ LIST */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {filteredFAQs.length === 0 && (
          <p className="text-center text-muted-foreground">
            No matching results found.
          </p>
        )}

        {filteredFAQs.map((faq, index) => (
          <motion.div
            key={index}
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
                  className="px-6 pb-6 text-muted-foreground"
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
        initial="hidden"
        animate="visible"
        className="text-center space-y-6 pt-16 border-t"
      >
        <h2 className="text-2xl font-semibold">
          Still have questions?
        </h2>

        <p className="text-muted-foreground">
          Our team is happy to help you.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/login"
            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
          >
            Get Started
          </Link>

          <Link
            href="/footer/contact"
            className="px-6 py-3 rounded-lg border font-medium hover:bg-muted transition"
          >
            Contact Support
          </Link>
        </div>
      </motion.div>

    </div>
  )
}
