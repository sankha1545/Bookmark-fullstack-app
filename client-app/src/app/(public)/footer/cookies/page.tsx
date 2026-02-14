"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Cookie,
  ShieldCheck,
  Lock,
  Database,
  Globe,
  Settings,
} from "lucide-react"
import Navbar from "@/modules/landing/components/LandingNavbar"
import Footer from "@/modules/landing/components/Footer"
// Animation variants
// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

export default function CookiesPage() {
  return (
   
    <section className="relative min-h-screen px-6 py-24 overflow-hidden">
 <Navbar />
      {/* Same Animated Gradient as Hero */}
      <div className="absolute left-[-250px] top-0 w-[600px] h-[600px] bg-yellow-300/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute right-[-250px] bottom-0 w-[600px] h-[600px] bg-pink-400/30 rounded-full blur-3xl animate-pulse" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto space-y-16"
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Cookies Policy
            <span className="block text-primary mt-3">
              Transparent & Responsible Usage
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Learn how Smart Bookmark uses cookies and similar
            technologies to provide a secure and reliable experience.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <ShieldCheck size={16} />
              No Tracking Ads
            </span>
            <span className="flex items-center gap-2">
              <Lock size={16} />
              Secure Sessions
            </span>
            <span className="flex items-center gap-2">
              <Database size={16} />
              Minimal Data Usage
            </span>
          </div>

          <p className="text-sm text-muted-foreground pt-4">
            <strong>Last Updated:</strong> January 2026
          </p>
        </motion.div>

        {/* Content Sections */}
        <motion.div variants={fadeUp} className="space-y-14 text-muted-foreground leading-relaxed">

          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground flex items-center gap-3">
              <Cookie size={20} className="text-primary" />
              1. What Are Cookies?
            </h2>
            <p className="mt-4">
              Cookies are small text files stored on your device when you visit a website.
              They help applications remember your authentication state,
              preferences, and essential session data.
            </p>
            <p className="mt-3">
              Smart Bookmark uses cookies strictly for functionality and security —
              not for advertising or invasive tracking.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground flex items-center gap-3">
              <ShieldCheck size={20} className="text-primary" />
              2. How We Use Cookies
            </h2>
            <p className="mt-4">
              Cookies are essential for maintaining secure sessions and ensuring
              reliable synchronization across devices.
            </p>

            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Maintaining secure authentication sessions</li>
              <li>Preventing unauthorized access</li>
              <li>Improving platform performance</li>
              <li>Ensuring smooth real-time synchronization</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground flex items-center gap-3">
              <Lock size={20} className="text-primary" />
              3. Types of Cookies We Use
            </h2>

            <div className="space-y-6 mt-6">

              <div>
                <h3 className="font-semibold text-foreground">
                  Essential Cookies
                </h3>
                <p className="mt-2">
                  Required for authentication and session management.
                  Without these, Smart Bookmark cannot function properly.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground">
                  Authentication Cookies
                </h3>
                <p className="mt-2">
                  Secure HttpOnly cookies manage login sessions via Google OAuth.
                  These cookies are encrypted and inaccessible to client-side scripts.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground">
                  Performance Cookies
                </h3>
                <p className="mt-2">
                  Limited analytics may be used to monitor system health.
                  We do not use advertising or third-party tracking cookies.
                </p>
              </div>

            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground flex items-center gap-3">
              <Globe size={20} className="text-primary" />
              4. Third-Party Services
            </h2>

            <p className="mt-4">
              We integrate with trusted services such as:
            </p>

            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Google OAuth for secure authentication</li>
              <li>Supabase for database and infrastructure</li>
            </ul>

            <p className="mt-4">
              These providers may use cookies according to their own privacy policies.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground flex items-center gap-3">
              <Settings size={20} className="text-primary" />
              5. Managing Cookies
            </h2>

            <p className="mt-4">
              You can control cookies through your browser settings.
              However, disabling essential cookies may prevent the platform
              from functioning correctly.
            </p>

            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>View stored cookies</li>
              <li>Delete cookies</li>
              <li>Block cookies from specific sites</li>
              <li>Block all cookies entirely</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground flex items-center gap-3">
              <ShieldCheck size={20} className="text-primary" />
              6. Data Protection & Security
            </h2>

            <p className="mt-4">
              All cookies are transmitted securely over HTTPS.
              Industry-standard security measures protect session integrity.
            </p>

            <p className="mt-3">
              We do not use cookies for behavioral profiling,
              targeted advertising, or selling personal information.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground">
              7. Updates to This Policy
            </h2>

            <p className="mt-4">
              We may update this policy periodically.
              The "Last Updated" date will reflect revisions.
            </p>
          </section>

          {/* Contact */}
          <section className="border-t pt-10">
            <h2 className="text-2xl font-semibold text-foreground">
              8. Contact Us
            </h2>

            <p className="mt-4">
              If you have questions about cookies or data practices,
              please contact:
            </p>

            <p className="mt-3">
              <strong>Email:</strong> support@smartbookmark.app
            </p>
          </section>

        </motion.div>

        {/* CTA Section */}
        <motion.div
          variants={fadeUp}
          className="pt-16 text-center space-y-6"
        >
          <p className="text-muted-foreground">
            Need more clarity about our policies?
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/contact">
              <Button size="lg" className="px-10 shadow-lg">
                Contact Support
              </Button>
            </Link>

            <Link href="/login">
              <Button size="lg" variant="outline" className="px-10">
                Get Started Free
              </Button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground pt-4">
            No tracking ads · Privacy-first design · Built with Next.js & Supabase
          </p>
        </motion.div>

      </motion.div>
    <br/>
      <Footer />
    </section>
  )
}
