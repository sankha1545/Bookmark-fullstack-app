"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ShieldCheck,
  Lock,
  Database,
  Cloud,
  Server,
  KeyRound,
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

export default function SecurityPage() {
  return (
    <section className="relative min-h-screen px-6 py-24 overflow-hidden">
<Navbar/>
      {/* Same Gradient Background as Hero */}
      <div className="absolute left-[-250px] top-0 w-[600px] h-[600px] bg-yellow-300/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute right-[-250px] bottom-0 w-[600px] h-[600px] bg-pink-400/30 rounded-full blur-3xl animate-pulse" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto space-y-16"
      >
        {/* Header Section */}
        <motion.div variants={fadeUp} className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Enterprise-Grade
            <span className="block text-primary mt-3">
              Security & Protection
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Smart Bookmark is built with security-first architecture.
            From authentication to infrastructure, every layer is designed
            to protect your data.
          </p>

          {/* Security Highlights */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <ShieldCheck size={16} />
              Row-Level Security
            </span>
            <span className="flex items-center gap-2">
              <Lock size={16} />
              SSL Encryption
            </span>
            <span className="flex items-center gap-2">
              <Cloud size={16} />
              Secure Cloud Hosting
            </span>
          </div>
        </motion.div>

        {/* Security Content Sections */}
        <motion.div variants={fadeUp} className="space-y-12">

          {/* Authentication */}
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              <KeyRound size={20} className="text-primary" />
              Secure Authentication
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Authentication is handled using Google OAuth.
              We never store passwords on our servers.
              Access tokens are securely managed and transmitted
              via encrypted HTTPS connections.
            </p>
          </div>

          {/* Encryption */}
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              <Lock size={20} className="text-primary" />
              End-to-End Encryption
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              All data transmitted between your browser and our
              servers is encrypted using SSL/TLS protocols.
              This prevents unauthorized interception and ensures
              data integrity at all times.
            </p>
          </div>

          {/* Database Security */}
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              <Database size={20} className="text-primary" />
              Database Protection
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Smart Bookmark uses row-level security policies
              to ensure users can only access their own data.
              Strict database access controls and audit logs
              protect against unauthorized access.
            </p>
          </div>

          {/* Infrastructure */}
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              <Server size={20} className="text-primary" />
              Cloud Infrastructure
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Our platform is hosted on reliable cloud infrastructure
              with high availability and real-time synchronization.
              Automated backups and monitoring ensure resilience
              against downtime and data loss.
            </p>
          </div>

          {/* Monitoring */}
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              <ShieldCheck size={20} className="text-primary" />
              Continuous Monitoring
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We continuously monitor system performance,
              access patterns, and security metrics to detect
              anomalies and protect against threats.
              Security updates and patches are applied promptly.
            </p>
          </div>

        </motion.div>

        {/* CTA Section */}
        <motion.div
          variants={fadeUp}
          className="pt-16 text-center space-y-6"
        >
          <p className="text-muted-foreground">
            Your security is our responsibility.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/contact">
              <Button size="lg" className="px-10 shadow-lg">
                Contact Security Team
              </Button>
            </Link>

            <Link href="/login">
              <Button size="lg" variant="outline" className="px-10">
                Get Started Free
              </Button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground pt-4">
            Built with Next.js · Supabase · Secure Cloud Infrastructure
          </p>
        </motion.div>

      </motion.div>
      <br/>
      <Footer />
    </section>
  )
}
