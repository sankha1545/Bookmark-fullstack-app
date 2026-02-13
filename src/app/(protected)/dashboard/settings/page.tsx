// src/app/(protected)/dashboard/settings/page.tsx
"use client"

import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"
import { Loader2, Trash2, LogOut, Edit2 } from "lucide-react"

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const [user, setUser] = useState<any>(null)
  const [openEdit, setOpenEdit] = useState(false)

  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [country, setCountry] = useState("")
  const [stateName, setStateName] = useState("")
  const [dialCode, setDialCode] = useState("+91")
  const [phone, setPhone] = useState("")

  const [countries, setCountries] = useState<
    { name: string; cca2: string; dialCode?: string }[]
  >([])
  const [states, setStates] = useState<{ name: string }[]>([])
  const [saving, setSaving] = useState(false)

  /* ===============================
     FETCH USER
  =============================== */

  useEffect(() => {
    fetchUser()
  }, [])

  async function fetchUser() {
    const { data } = await supabase.auth.getUser()
    if (data?.user) {
      setUser(data.user)
      setEmail(data.user.email || "")
      setDisplayName(data.user.user_metadata?.display_name || "")
      setCountry(data.user.user_metadata?.country || "")
      setStateName(data.user.user_metadata?.state || "")
      setDialCode(data.user.user_metadata?.dialCode || "+91")
      setPhone(data.user.user_metadata?.phone || "")
    }
  }

  /* ===============================
     LOAD COUNTRIES
  =============================== */

  useEffect(() => {
    async function loadCountries() {
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca2,idd"
        )
        const raw = await res.json()

        const mapped = raw
          .map((c: any) => {
            let dial = undefined
            if (c?.idd?.root) {
              dial =
                c.idd.root +
                (c?.idd?.suffixes?.[0] ? c.idd.suffixes[0] : "")
            }
            return {
              name: c?.name?.common,
              cca2: c?.cca2,
              dialCode: dial,
            }
          })
          .filter((c: any) => c.name && c.cca2)
          .sort((a: any, b: any) =>
            a.name.localeCompare(b.name)
          )

        setCountries(mapped)
      } catch {
        setCountries([
          { name: "India", cca2: "IN", dialCode: "+91" },
          { name: "United States", cca2: "US", dialCode: "+1" },
        ])
      }
    }

    loadCountries()
  }, [])

  /* ===============================
     LOAD STATES
  =============================== */

  useEffect(() => {
    if (!country) return

    async function loadStates() {
      try {
        const res = await fetch(
          "https://countriesnow.space/api/v0.1/countries/states",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              country:
                countries.find((c) => c.cca2 === country)?.name ||
                "",
            }),
          }
        )
        const json = await res.json()
        if (json?.data?.states) {
          setStates(
            json.data.states.map((s: any) => ({
              name: s.name,
            }))
          )
        }
      } catch {
        setStates([])
      }
    }

    loadStates()

    const pick = countries.find((c) => c.cca2 === country)
    if (pick?.dialCode) setDialCode(pick.dialCode)
  }, [country, countries])

  const dialCodes = useMemo(() => {
    const map = new Map<string, string>()
    countries.forEach((c) => {
      if (c.dialCode) map.set(c.dialCode, c.dialCode)
    })
    return Array.from(map.values())
  }, [countries])

  /* ===============================
     SAVE PROFILE
  =============================== */

  async function saveProfile() {
    setSaving(true)
    await supabase.auth.updateUser({
      data: {
        display_name: displayName,
        country,
        state: stateName,
        dialCode,
        phone,
      },
    })
    setSaving(false)
    setOpenEdit(false)
    fetchUser()
  }

  /* ===============================
     LOGOUT + DELETE
  =============================== */

  async function logout() {
    await fetch("/api/logout", { method: "POST" })
    window.location.replace("/login")
  }

  async function deleteAccount() {
    if (!confirm("Delete account permanently?")) return
    await fetch("/api/delete-account", { method: "POST" })
    window.location.replace("/")
  }

  const themeValue = mounted ? theme ?? resolvedTheme : "system"

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-8">
      <h1 className="text-3xl font-semibold">
        Settings
      </h1>

      {/* PROFILE CARD */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>

        <CardContent className="flex justify-between items-center">
          <div>
            <div className="text-sm text-muted-foreground">
              Signed in as
            </div>
            <div className="font-medium">{email}</div>
            <div className="text-sm text-muted-foreground">
              {displayName || "No display name"}
            </div>
          </div>

          <Button onClick={() => setOpenEdit(true)}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </CardContent>
      </Card>

      {/* APPEARANCE */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>

        <CardContent className="flex justify-between items-center">
          <span>Dark Mode</span>
          <Switch
            checked={themeValue === "dark"}
            onCheckedChange={(v) =>
              setTheme(v ? "dark" : "light")
            }
          />
        </CardContent>
      </Card>

      {/* DANGER */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">
            Danger Zone
          </CardTitle>
        </CardHeader>

        <CardContent className="flex gap-4">
          <Button variant="outline" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>

          <Button
            variant="destructive"
            onClick={deleteAccount}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Account
          </Button>
        </CardContent>
      </Card>

      {/* MODAL */}
      {openEdit && (
        <ProfileModal
          displayName={displayName}
          setDisplayName={setDisplayName}
          email={email}
          country={country}
          setCountry={setCountry}
          stateName={stateName}
          setStateName={setStateName}
          dialCode={dialCode}
          setDialCode={setDialCode}
          phone={phone}
          setPhone={setPhone}
          countries={countries}
          states={states}
          dialCodes={dialCodes}
          saving={saving}
          onSave={saveProfile}
          onClose={() => setOpenEdit(false)}
        />
      )}
    </div>
  )
}

/* ===============================
   PROFILE MODAL
=============================== */

function ProfileModal({
  displayName,
  setDisplayName,
  email,
  country,
  setCountry,
  stateName,
  setStateName,
  dialCode,
  setDialCode,
  phone,
  setPhone,
  countries,
  states,
  dialCodes,
  saving,
  onSave,
  onClose,
}: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-black rounded-2xl w-full max-w-2xl shadow-xl p-6 space-y-4">

        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            Edit Profile
          </h3>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <Label>Display Name</Label>
            <Input
              value={displayName}
              onChange={(e) =>
                setDisplayName(e.target.value)
              }
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input value={email} disabled />
          </div>

          <div>
            <Label>Country</Label>
            <Select
              value={country}
              onValueChange={setCountry}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((c: any) => (
                  <SelectItem
                    key={c.cca2}
                    value={c.cca2}
                  >
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>State</Label>
            <Select
              value={stateName}
              onValueChange={setStateName}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {states.map((s: any) => (
                  <SelectItem
                    key={s.name}
                    value={s.name}
                  >
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Dial Code</Label>
            <Select
              value={dialCode}
              onValueChange={setDialCode}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dialCodes.map((d: string) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Phone</Label>
            <Input
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, ""))
              }
            />
          </div>

        </div>

        <div className="flex justify-end">
          <Button onClick={onSave} disabled={saving}>
            {saving && (
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
