"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Navbar from "@/modules/landing/components/LandingNavbar"
import Footer from "@/modules/landing/components/Footer"
import { toast } from "sonner"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

type CountryItem = {
  name: string
  dialCode: string
}

type StateItem = {
  name: string
}

export default function ContactPage() {
  
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [country, setCountry] = useState("")
  const [stateName, setStateName] = useState("")
  const [dialCode, setDialCode] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const [countries, setCountries] = useState<CountryItem[]>([])
  const [states, setStates] = useState<StateItem[]>([])
  const [loadingCountries, setLoadingCountries] = useState(true)
  const [loadingStates, setLoadingStates] = useState(false)

 
  useEffect(() => {
    async function loadCountries() {
      try {
        const res = await fetch("/api/geo/countries")
        if (!res.ok) throw new Error()

        const data = await res.json()
        if (Array.isArray(data)) {
          setCountries(data)
        }
      } catch {
        toast.error("Failed to load countries")
      } finally {
        setLoadingCountries(false)
      }
    }

    loadCountries()
  }, [])

  useEffect(() => {
    if (!country) {
      setStates([])
      setDialCode("")
      return
    }

    async function loadStates() {
      setLoadingStates(true)
      try {
        const res = await fetch("/api/geo/states", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country }),
        })

        if (!res.ok) throw new Error()

        const data = await res.json()
        if (Array.isArray(data)) {
          setStates(data)
        }
      } catch {
        setStates([])
      } finally {
        setLoadingStates(false)
      }
    }

    loadStates()

    const selected = countries.find((c) => c.name === country)
    if (selected) setDialCode(selected.dialCode)
  }, [country, countries])

 
  function validateForm() {
    if (
      !name.trim() ||
      !email.trim() ||
      !country ||
      !stateName ||
      !dialCode ||
      !phone.trim() ||
      !message.trim()
    ) {
      toast.error("Fill up all the fields")
      return false
    }

    const emailRegex = /^\S+@\S+\.\S+$/
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email")
      return false
    }

    return true
  }


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!validateForm()) return

    setSubmitting(true)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          country,
          state: stateName,
          dialCode,
          phone,
          message,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data?.error || "Message failed to send")
        return
      }

      toast.success("Your message has been sent successfully")

      // Reset form
      setName("")
      setEmail("")
      setCountry("")
      setStateName("")
      setDialCode("")
      setPhone("")
      setMessage("")
    } catch {
      toast.error("Message failed to send")
    } finally {
      setSubmitting(false)
    }
  }

 
  return (
    <>
      <Navbar />

      <section className="min-h-screen px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          className="max-w-6xl mx-auto space-y-12"
        >
          <motion.div variants={fadeUp} className="text-center space-y-4">
            <h1 className="text-4xl sm:text-6xl font-bold">
              Get in Touch
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We'd love to hear from you.
            </p>
          </motion.div>

          <motion.form
            variants={fadeUp}
            onSubmit={handleSubmit}
            className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-xl space-y-5"
          >
            <Input
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="border rounded px-3 py-2 w-full"
                disabled={loadingCountries}
              >
                <option value="">
                  {loadingCountries ? "Loading..." : "Select Country"}
                </option>
                {countries.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                className="border rounded px-3 py-2 w-full"
                disabled={!country || loadingStates}
              >
                <option value="">
                  {loadingStates ? "Loading..." : "Select State"}
                </option>
                {states.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <Input value={dialCode} readOnly />
              <Input
                className="sm:col-span-2"
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

            <Button
              type="submit"
              disabled={submitting}
              className="w-full"
            >
              {submitting ? "Sending..." : "Send Message"}
            </Button>
          </motion.form>
        </motion.div>
      </section>

      <Footer />
    </>
  )
}
