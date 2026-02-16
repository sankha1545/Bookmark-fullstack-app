"use client"
import { MotionDiv } from "@/components/motion/motion"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  Scale,
  Globe,
  Ban,
} from "lucide-react"
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

export default function TermsPage() {
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
     
        <MotionDiv variants={fadeUp} className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Terms of Service
            <span className="block text-primary mt-3">
              Fair & Transparent Usage
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            By accessing or using Smart Bookmark, you agree to the
            following terms and conditions. Please read them carefully.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <FileText size={16} />
              Transparent Policies
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck size={16} />
              Secure Platform
            </span>
            <span className="flex items-center gap-2">
              <Scale size={16} />
              Fair Usage
            </span>
          </div>
        </MotionDiv>

        {/* Content Sections */}
        <MotionDiv variants={fadeUp} className="space-y-12">

         
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              <FileText size={20} className="text-primary" />
              Acceptance of Terms
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              By creating an account or using Smart Bookmark,
              you agree to comply with these Terms of Service.
              If you do not agree with any part of these terms,
              you should discontinue use of the platform.
            </p>
          </div>

        
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              <ShieldCheck size={20} className="text-primary" />
              User Responsibilities
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              You agree to use the platform responsibly and lawfully.
              You must not attempt to exploit, disrupt, reverse engineer,
              or misuse the service in any way.
              Any violation may result in suspension or termination of access.
            </p>
          </div>

        
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              <Ban size={20} className="text-primary" />
              Prohibited Activities
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              You may not use Smart Bookmark for unlawful activities,
              distributing malicious content, or storing prohibited material.
              The platform must not be used to infringe on intellectual property
              or violate third-party rights.
            </p>
          </div>

          {/* Data & Privacy */}
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              <Globe size={20} className="text-primary" />
              Data & Privacy
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Your use of the platform is also governed by our Privacy Policy.
              We implement security measures to protect your data,
              but you are responsible for safeguarding your account credentials.
            </p>
          </div>

          {/* Limitation of Liability */}
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              <AlertTriangle size={20} className="text-primary" />
              Limitation of Liability
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Smart Bookmark is provided “as is” without warranties of any kind.
              While we strive for reliability and uptime,
              we are not liable for indirect damages,
              data loss, or interruptions beyond our control.
            </p>
          </div>

          {/* Governing Law */}
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              <Scale size={20} className="text-primary" />
              Governing Law
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              These terms shall be governed in accordance with applicable laws.
              Any disputes arising from the use of this service
              shall be resolved under the jurisdiction of the appropriate courts.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Last Updated: {new Date().toLocaleDateString()}
            </p>
          </div>

        </MotionDiv>

        {/* CTA Section */}
        <MotionDiv
          variants={fadeUp}
          className="pt-16 text-center space-y-6"
        >
          <p className="text-muted-foreground">
            Questions about our Terms?
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
            Built with Next.js · Supabase · Secure Cloud Infrastructure
          </p>
        </MotionDiv>

      </MotionDiv>
      <br/>
      <Footer />
    </section>
  )
}
