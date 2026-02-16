"use client"
import { MotionDiv } from "@/components/motion/motion"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Lock, Database, Globe, Mail } from "lucide-react"
import Navbar from "@/modules/landing/components/LandingNavbar"
import Footer from "@/modules/landing/components/Footer"

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

export default function PrivacyPolicyPage() {
  return (
    <section className="relative min-h-screen px-6 py-24 overflow-hidden">
<Navbar />
      
      <div className="absolute left-[-250px] top-0 w-[600px] h-[600px] bg-yellow-300/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute right-[-250px] bottom-0 w-[600px] h-[600px] bg-pink-400/30 rounded-full blur-3xl animate-pulse" />

      <MotionDiv
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto space-y-16"
      >
        {/* Header */}
        <MotionDiv variants={fadeUp} className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Privacy Policy
            <span className="block text-primary mt-3">
              Your Data. Your Control.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            At Smart Bookmark, privacy is not an afterthought.
            We are committed to transparency, security, and
            protecting your personal information at every level.
          </p>

          <div className="flex justify-center gap-6 text-sm text-muted-foreground flex-wrap">
            <span className="flex items-center gap-2">
              <ShieldCheck size={16} />
              End-to-End Security
            </span>
            <span className="flex items-center gap-2">
              <Lock size={16} />
              OAuth Authentication
            </span>
            <span className="flex items-center gap-2">
              <Database size={16} />
              Encrypted Storage
            </span>
          </div>
        </MotionDiv>

       
        <MotionDiv variants={fadeUp} className="space-y-12">

         
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              <Database size={20} className="text-primary" />
              Information We Collect
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We only collect the minimum data required to provide our service.
              This includes your authenticated account information (such as name and email)
              and the bookmarks you intentionally store within your account.
              We do not collect browsing history outside of bookmarks you save.
            </p>
          </div>

        
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              <Lock size={20} className="text-primary" />
              Authentication & Security
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Authentication is securely handled through Google OAuth.
              We never store your passwords. All communication between
              your browser and our servers is encrypted using HTTPS.
              Access tokens are securely managed and protected.
            </p>
          </div>

       
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              <ShieldCheck size={20} className="text-primary" />
              How We Use Your Data
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Your data is used solely to provide core functionality —
              syncing bookmarks, enabling account access, and improving performance.
              We do not sell, rent, or share your data with advertisers.
            </p>
          </div>

          
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              <Globe size={20} className="text-primary" />
              Data Storage & Infrastructure
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Smart Bookmark is built using secure cloud infrastructure.
              Data is stored in encrypted databases with strict access controls.
              Regular monitoring ensures high availability and protection
              against unauthorized access.
            </p>
          </div>

       
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              <Mail size={20} className="text-primary" />
              Your Rights
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              You have the right to access, update, or delete your data at any time.
              If you wish to permanently remove your account, you may do so from
              your account settings or by contacting support.
            </p>
          </div>

          
          <div>
            <h2 className="text-2xl font-semibold">
              Updates to This Policy
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We may update this Privacy Policy occasionally to reflect
              improvements or regulatory requirements. When updates occur,
              we will revise the “Last Updated” date and notify users when appropriate.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Last Updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </MotionDiv>

        {/* CTA Section */}
        <MotionDiv
          variants={fadeUp}
          className="pt-12 text-center space-y-6"
        >
          <p className="text-muted-foreground">
            Have questions about our privacy practices?
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/contact">
              <Button size="lg" className="px-10 shadow-lg">
                Contact Us
              </Button>
            </Link>

            <Link href="/login">
              <Button size="lg" variant="outline" className="px-10">
                Get Started Free
              </Button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground pt-4">
            No credit card required · Free forever plan · Built with Next.js & Supabase
          </p>
        </MotionDiv>

      </MotionDiv>
      <br/>
      <Footer />
    </section>
  )
}
