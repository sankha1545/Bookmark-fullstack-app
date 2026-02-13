"use client"

import React, { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ShieldCheck, Zap, Cloud } from "lucide-react"
import Navbar from "@/modules/landing/components/LandingNavbar"
import Footer from "@/modules/landing/components/Footer"
import { toast } from "react-hot-toast"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

type CountryItem = {
  name: string
  dialCode?: string
}

type StateItem = {
  name: string
}

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [country, setCountry] = useState("")
  const [stateName, setStateName] = useState("")
  const [dialCode, setDialCode] = useState("+91")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [gender, setGender] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const [countries, setCountries] = useState<CountryItem[]>([])
  const [states, setStates] = useState<StateItem[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  /* ---------------- FETCH COUNTRIES ---------------- */
  useEffect(() => {
    async function loadCountries() {
      try {
        const res = await fetch("https://restcountries.com/v3.1/all")
        const data = await res.json()

        const mapped = data
          .map((c: any) => {
            let dial = c?.idd?.root
              ? c.idd.root + (c?.idd?.suffixes?.[0] ?? "")
              : undefined
            return {
              name: c?.name?.common,
              dialCode: dial,
            }
          })
          .filter((c: CountryItem) => c.name)
          .sort((a: CountryItem, b: CountryItem) =>
            a.name.localeCompare(b.name)
          )

        setCountries(mapped)
      } catch (err) {
        console.error(err)
      }
    }
    loadCountries()
  }, [])

  /* ---------------- FETCH STATES ---------------- */
  useEffect(() => {
    if (!country) return
    async function loadStates() {
      try {
        const res = await fetch(
          "https://countriesnow.space/api/v0.1/countries/states",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ country }),
          }
        )
        const json = await res.json()
        setStates(json?.data?.states || [])
      } catch {
        setStates([])
      }
    }

    loadStates()

    const pick = countries.find((c) => c.name === country)
    if (pick?.dialCode) setDialCode(pick.dialCode)
  }, [country, countries])

  /* ---------------- VALIDATION ---------------- */
  function validate() {
    const e: Record<string, string> = {}
    if (!name) e.name = "Name required"
    if (!email || !/^\S+@\S+\.\S+$/.test(email))
      e.email = "Valid email required"
    if (!phone) e.phone = "Phone required"
    if (!message) e.message = "Message required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  /* ---------------- SUBMIT ---------------- */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          country,
          state: stateName,
          dialCode,
          phone,
          gender,
          message,
        }),
      })
      toast.success("Message sent successfully!")
      setName("")
      setEmail("")
      setPhone("")
      setMessage("")
    } catch {
      toast.error("Submission failed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />

      <section className="relative min-h-screen px-6 py-24 overflow-hidden">

        {/* Hero Gradient */}
        <div className="absolute left-[-250px] top-0 w-[600px] h-[600px] bg-yellow-300/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute right-[-250px] bottom-0 w-[600px] h-[600px] bg-pink-400/30 rounded-full blur-3xl animate-pulse" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          className="relative z-10 max-w-7xl mx-auto space-y-16"
        >

          {/* HEADER */}
          <motion.div variants={fadeUp} className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold">
              Get in Touch
              <span className="block text-primary mt-2">
                We'd Love to Hear From You
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Whether you have a question, partnership inquiry,
              or need product support — our team is here to help.
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <ShieldCheck size={16} />
                Secure Communication
              </span>
              <span className="flex items-center gap-2">
                <Zap size={16} />
                Fast Response
              </span>
              <span className="flex items-center gap-2">
                <Cloud size={16} />
                Cloud Infrastructure
              </span>
            </div>
          </motion.div>

          {/* TWO PANEL */}
          <div className="grid lg:grid-cols-2 gap-12">

            {/* LEFT */}
            <motion.div variants={fadeUp} className="space-y-6">
              <h2 className="text-2xl font-semibold">Why Reach Out?</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li>• Product demos & onboarding</li>
                <li>• Enterprise partnerships</li>
                <li>• Bug reports & feature suggestions</li>
                <li>• Billing & account questions</li>
              </ul>

              <div className="pt-6 border-t">
                <p className="text-sm text-muted-foreground">
                  We typically respond within 1 business day.
                </p>
              </div>
            </motion.div>

            {/* RIGHT FORM */}
            <motion.form
              variants={fadeUp}
              onSubmit={handleSubmit}
              className="bg-white p-8 rounded-2xl shadow-xl space-y-4"
            >
              <Input
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}

              <Input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}

              <div className="grid md:grid-cols-2 gap-4">
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="border rounded px-3 py-2"
                >
                  <option value="">Select Country</option>
                  {countries.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <select
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  className="border rounded px-3 py-2"
                >
                  <option value="">Select State</option>
                  {states.map((s: any) => (
                    <option key={s.name} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <select
                  value={dialCode}
                  onChange={(e) => setDialCode(e.target.value)}
                  className="border rounded px-3 py-2"
                >
                  {countries.map(
                    (c) =>
                      c.dialCode && (
                        <option key={c.dialCode} value={c.dialCode}>
                          {c.dialCode}
                        </option>
                      )
                  )}
                </select>

                <Input
                  className="md:col-span-2"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, ""))
                  }
                />
              </div>

              <Textarea
                placeholder="Your Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
              />
              {errors.message && (
                <p className="text-xs text-red-600">{errors.message}</p>
              )}

              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? "Sending..." : "Send Message"}
              </Button>
            </motion.form>
          </div>
        </motion.div>
      </section>
<br/>
      <Footer />
    </>
  )
}
