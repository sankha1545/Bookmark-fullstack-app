"use client"

import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { fadeUp, staggerContainer } from "@/modules/landing/animations"
import MarketingPageWrapper from "@/modules/shared/components/MarketingPageWrapper"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Mail, Phone, Globe, MapPin } from "lucide-react"

/* ---------------- Types ---------------- */

type Country = {
  name: string
  iso2?: string
  dial_code?: string
}

type StateItem = {
  name: string
}

/* ---------------- Geo API ---------------- */

async function fetchCountries(): Promise<Country[]> {
  const res = await fetch("https://restcountries.com/v3.1/all")
  if (!res.ok) return []
  const json = await res.json()

  return json
    .map((c: any) => {
      const name = c?.name?.common ?? c?.name
      const iso2 = c?.cca2
      let dial_code = undefined

      if (c?.idd?.root) {
        const suffix = (c?.idd?.suffixes && c.idd.suffixes[0]) || ""
        dial_code = `${c.idd.root}${suffix}`
      }

      return { name, iso2, dial_code }
    })
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name))
}

async function fetchStatesForCountry(countryName: string): Promise<StateItem[]> {
  try {
    const res = await fetch(
      "https://countriesnow.space/api/v0.1/countries/states",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: countryName }),
      }
    )

    const json = await res.json()
    if (!json?.data?.states) return []
    return json.data.states.map((s: any) => ({ name: s.name }))
  } catch {
    return []
  }
}

/* ---------------- Component ---------------- */

export default function ContactPage() {
  /* ------------ State ------------ */

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [gender, setGender] = useState("")
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [countryCode, setCountryCode] = useState<string | null>(null)
  const [dialCode, setDialCode] = useState<string | null>(null)
  const [phone, setPhone] = useState("")
  const [showPhone, setShowPhone] = useState(false)
  const [states, setStates] = useState<StateItem[]>([])
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [countries, setCountries] = useState<Country[]>([])
  const [loadingCountries, setLoadingCountries] = useState(true)
  const [loadingStates, setLoadingStates] = useState(false)
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [resultMsg, setResultMsg] = useState<
    { type: "success" | "error"; text: string } | null
  >(null)

  /* ------------ Load Countries ------------ */

  useEffect(() => {
    fetchCountries()
      .then(setCountries)
      .finally(() => setLoadingCountries(false))
  }, [])

  /* ------------ Country Change Logic ------------ */

  useEffect(() => {
    if (!selectedCountry) {
      setStates([])
      setSelectedState(null)
      setDialCode(null)
      setCountryCode(null)
      setShowPhone(false)
      return
    }

    const c = countries.find((x) => x.name === selectedCountry)

    if (c) {
      setDialCode(c.dial_code ?? null)
      setCountryCode(c.iso2 ?? null)
      setShowPhone(Boolean(c.dial_code))
    }

    setLoadingStates(true)
    fetchStatesForCountry(selectedCountry)
      .then((s) => {
        setStates(s)
        setSelectedState(s.length ? s[0].name : null)
      })
      .finally(() => setLoadingStates(false))
  }, [selectedCountry, countries])

  /* ------------ Submit ------------ */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setResultMsg(null)

    if (!name || !email || !selectedCountry) {
      setResultMsg({
        type: "error",
        text: "Please complete required fields.",
      })
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          gender,
          country: selectedCountry,
          countryCode,
          state: selectedState,
          dialCode,
          phone,
          message,
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        setResultMsg({ type: "error", text: json?.error })
      } else {
        setResultMsg({
          type: "success",
          text: "Message sent successfully. We'll contact you soon.",
        })

        setName("")
        setEmail("")
        setGender("")
        setSelectedCountry(null)
        setDialCode(null)
        setPhone("")
        setMessage("")
      }
    } catch {
      setResultMsg({ type: "error", text: "Submission failed." })
    } finally {
      setSubmitting(false)
    }
  }

  /* ------------ UI ------------ */

  return (
    <MarketingPageWrapper
      title="Contact Us"
      description="Reach out for support, partnerships or inquiries."
    >
      <div className="relative overflow-hidden">

        {/* Animated Gradient Blobs */}
        <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-3xl animate-pulse" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative grid lg:grid-cols-2 gap-16 py-16"
        >
          {/* LEFT INFO */}
          <motion.div variants={fadeUp} className="space-y-8">
            <h2 className="text-4xl font-bold tracking-tight">
              Let’s start a conversation
            </h2>

            <p className="text-muted-foreground text-lg">
              We’re here to help. Whether you have a question,
              partnership proposal, or feedback — we’d love to hear from you.
            </p>

            <div className="space-y-6 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="text-primary" />
                support@smartbookmark.app
              </div>
              <div className="flex items-center gap-3">
                <Globe className="text-primary" />
                Remote-first global team
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="text-primary" />
                Worldwide availability
              </div>
            </div>
          </motion.div>

          {/* FORM */}
          <motion.form
            variants={fadeUp}
            onSubmit={handleSubmit}
            className="bg-card/60 backdrop-blur-lg border rounded-2xl p-8 space-y-6 shadow-xl"
          >
            <Input
              placeholder="Full Name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              type="email"
              placeholder="Email Address *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full border rounded-lg p-3 bg-transparent"
            >
              <option value="">Select Gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>

            {/* Country */}
            <select
              value={selectedCountry ?? ""}
              onChange={(e) =>
                setSelectedCountry(e.target.value || null)
              }
              className="w-full border rounded-lg p-3 bg-transparent"
            >
              <option value="">Select Country *</option>
              {countries.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* State */}
            {states.length > 0 && (
              <select
                value={selectedState ?? ""}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full border rounded-lg p-3 bg-transparent"
              >
                {states.map((s) => (
                  <option key={s.name}>{s.name}</option>
                ))}
              </select>
            )}

            {/* Dial + Phone */}
            {dialCode && (
              <div className="flex gap-2">
                <div className="px-4 py-3 border rounded-lg bg-muted">
                  {dialCode}
                </div>
                <Input
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            )}

            <textarea
              rows={5}
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border rounded-lg p-3 bg-transparent"
            />

            <Button
              type="submit"
              disabled={submitting}
              className="w-full"
            >
              {submitting ? (
                <Loader2 className="animate-spin mr-2" />
              ) : null}
              Send Message
            </Button>

            <AnimatePresence>
              {resultMsg && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`p-3 rounded-lg text-sm ${
                    resultMsg.type === "success"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {resultMsg.text}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>
        </motion.div>
      </div>
    </MarketingPageWrapper>
  )
}
