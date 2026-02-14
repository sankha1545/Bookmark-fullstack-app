import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

import {
  LandingNavbar,
  HeroSection,
  SecuritySection,
  AccessSection,
  PricingSection,
  CTASection,
  FooterSection,
} from "@/modules/landing"

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (session) redirect("/dashboard")

  return (
    <main className="relative">
      <LandingNavbar />
      <HeroSection />
      <SecuritySection />
      <AccessSection />
      <PricingSection />
      <CTASection />
      <FooterSection />
    </main>
  )
}
