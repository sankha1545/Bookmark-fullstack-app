// src/app/(protected)/dashboard/settings/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { Loader2, Trash2, LogOut, Edit2 } from "lucide-react";
import { format } from "date-fns";

type Country = { name: string; cca2: string; dialCode?: string };
type StateItem = { name: string };

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  // local editable state (mirrors profile fields)
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState<string | null>(null); // store cca2 or null
  const [stateName, setStateName] = useState<string | null>(null);
  const [dialCode, setDialCode] = useState("+91");
  const [phone, setPhone] = useState("");

  // lists
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<StateItem[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(false);
  const [statesLoading, setStatesLoading] = useState(false);

  /* -------------------------
     Fetch current user and profile
  ------------------------- */
  useEffect(() => {
    fetchUserAndProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchUserAndProfile() {
    setLoadingProfile(true);
    try {
      const { data } = await supabase.auth.getUser();
      const currentUser = data?.user ?? null;
      setUser(currentUser);

      if (!currentUser) {
        setLoadingProfile(false);
        return;
      }

      setEmail(currentUser.email || "");

      // fetch profile row from profiles table (assuming RLS allows)
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", currentUser.id)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 is "No rows" (in some setups) - ignore if not found
        console.warn("fetch profile error:", error);
      }

      if (profileData) {
        setProfile(profileData);
        // populate editable state with profile table data
        setDisplayName(profileData.display_name ?? "");
        setCountry(profileData.country ?? null);
        setStateName(profileData.state ?? null);
        setDialCode(profileData.dial_code ?? "+91");
        setPhone(profileData.phone ?? "");
      } else {
        // if no profile row exists, keep defaults. You may want to create one on first save.
      }
    } catch (err) {
      console.error("fetchUserAndProfile", err);
    } finally {
      setLoadingProfile(false);
    }
  }

  /* -------------------------
     Load countries list (restcountries) with dial codes
  ------------------------- */
  useEffect(() => {
    let cancelled = false;

    async function loadCountries() {
      setCountriesLoading(true);
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca2,idd"
        );
        if (!res.ok) throw new Error("restcountries failed");
        const raw = await res.json();

        const mapped: Country[] = raw
          .map((c: any) => {
            let dial: string | undefined;
            try {
              if (c?.idd?.root) {
                const root: string = c.idd.root;
                const suffixes: string[] = c?.idd?.suffixes ?? [];
                dial = suffixes.length > 0 ? `${root}${suffixes[0]}` : root;
                if (dial && !dial.startsWith("+")) dial = `+${dial}`;
              }
            } catch {
              dial = undefined;
            }
            return {
              name: c?.name?.common ?? c?.name ?? "Unknown",
              cca2: c?.cca2 ?? "",
              dialCode: dial,
            };
          })
          .filter((x: Country) => x.name && x.cca2)
          .sort((a: Country, b: Country) => a.name.localeCompare(b.name));

        if (!cancelled) setCountries(mapped);
      } catch (err) {
        console.warn("loadCountries failed, using fallback", err);
        if (!cancelled) {
          setCountries([
            { name: "India", cca2: "IN", dialCode: "+91" },
            { name: "United States", cca2: "US", dialCode: "+1" },
            { name: "United Kingdom", cca2: "GB", dialCode: "+44" },
          ]);
        }
      } finally {
        if (!cancelled) setCountriesLoading(false);
      }
    }

    loadCountries();
    return () => {
      cancelled = true;
    };
  }, []);

  /* -------------------------
     Load states for chosen country (uses countriesnow API)
  ------------------------- */
  useEffect(() => {
    if (!country) {
      setStates([]);
      setStateName(null);
      return;
    }

    let cancelled = false;

    async function loadStates() {
      setStatesLoading(true);
      setStates([]);
      setStateName(null);
      try {
        // find the country name from the cca2
        const cObj = countries.find((c) => c.cca2 === country);
        const countryName = cObj?.name ?? "";
        if (!countryName) {
          setStates([]);
          return;
        }

        const res = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: countryName }),
        });
        if (!res.ok) throw new Error("states fetch failed");
        const json = await res.json();
        if (json?.data?.states && Array.isArray(json.data.states)) {
          const mapped = json.data.states.map((s: any) => ({ name: s.name ?? s }));
          if (!cancelled) setStates(mapped);
        } else {
          if (!cancelled) setStates([]);
        }
      } catch (err) {
        console.warn("loadStates error", err);
        if (!cancelled) setStates([]);
      } finally {
        if (!cancelled) setStatesLoading(false);
      }
    }

    // set dial code when country selected (if available)
    const pick = countries.find((c) => c.cca2 === country);
    if (pick?.dialCode) setDialCode(pick.dialCode);

    loadStates();
    return () => {
      cancelled = true;
    };
  }, [country, countries]);

  const dialCodes = useMemo(() => {
    const map = new Map<string, string>();
    countries.forEach((c) => {
      if (c.dialCode) map.set(c.dialCode, c.dialCode);
    });
    return Array.from(map.values());
  }, [countries]);

  /* -------------------------
     Save profile -> upsert into 'profiles' table
  ------------------------- */
  async function saveProfile() {
    if (!user) {
      console.warn("no user");
      return;
    }
    setSaving(true);

    const payload = {
      user_id: user.id,
      display_name: displayName || null,
      country: country || null,
      state: stateName || null,
      dial_code: dialCode || null,
      phone: phone || null,
      updated_at: new Date().toISOString(),
    };

    try {
      // upsert into profiles table (RLS should allow user to upsert their own row)
      const { data: upserted, error: upsertErr } = await supabase
        .from("profiles")
        .upsert(payload, { onConflict: "user_id", returning: "representation" })
        .select()
        .single();

      if (upsertErr) {
        console.error("upsert profile error", upsertErr);
        alert("Failed to save profile.");
      } else {
        // keep local profile state refreshed
        setProfile(upserted);
      }

      // optional: update auth user display name so pre-existing auth-based UX sees name
      if (displayName) {
        const { error: authErr } = await supabase.auth.updateUser({
          data: { display_name: displayName },
        });
        if (authErr) console.warn("auth updateUser error", authErr);
      }

      setOpenEdit(false);
    } catch (err) {
      console.error("saveProfile unexpected", err);
      alert("Unexpected error while saving.");
    } finally {
      setSaving(false);
      // refresh to be safe
      fetchUserAndProfile();
    }
  }

  /* -------------------------
     Logout & Delete
  ------------------------- */
  async function logout() {
    try {
      await fetch("/api/logout", { method: "POST" });
      window.location.replace("/login");
    } catch (err) {
      console.error(err);
      alert("Logout failed");
    }
  }

  async function deleteAccount() {
    if (!confirm("Permanently delete account?")) return;
    try {
      await fetch("/api/delete-account", { method: "POST" });
      window.location.replace("/");
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  }

  const themeValue = mounted ? theme ?? resolvedTheme : "system";

  /* -------------------------
     Render
  ------------------------- */
  return (
    <div className="max-w-5xl mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and profile</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>

        <CardContent className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Signed in as</div>
            <div className="font-medium">{email || "—"}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {profile?.display_name ?? displayName ?? "No display name"}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Profile updated:{" "}
              {profile?.updated_at ? format(new Date(profile.updated_at), "PPP p") : "—"}
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setOpenEdit(true)}>
              <Edit2 className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>

            <Button onClick={fetchUserAndProfile} variant="outline">
              {loadingProfile ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>

        <CardContent className="flex justify-between items-center">
          <div>
            <div className="text-sm font-medium">Dark Mode</div>
            <p className="text-xs text-muted-foreground">Toggle site appearance</p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">Light</span>
            <Switch checked={themeValue === "dark"} onCheckedChange={(v) => setTheme(v ? "dark" : "light")} />
            <span className="text-xs text-muted-foreground">Dark</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-100">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
        </CardHeader>

        <CardContent className="flex gap-4">
          <Button variant="outline" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>

          <Button variant="destructive" onClick={deleteAccount}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Account
          </Button>
        </CardContent>
      </Card>

      {/* Profile Modal */}
      {openEdit && (
        <ProfileModal
          displayName={displayName}
          setDisplayName={setDisplayName}
          email={email}
          country={country}
          setCountry={(v: string | null) => setCountry(v)}
          stateName={stateName}
          setStateName={(v: string | null) => setStateName(v)}
          dialCode={dialCode}
          setDialCode={setDialCode}
          phone={phone}
          setPhone={setPhone}
          countries={countries}
          countriesLoading={countriesLoading}
          states={states}
          statesLoading={statesLoading}
          dialCodes={dialCodes}
          saving={saving}
          onSave={saveProfile}
          onClose={() => setOpenEdit(false)}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ProfileModal - inline modal implementation (keeps compatibility)          */
/* -------------------------------------------------------------------------- */
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
  countriesLoading,
  states,
  statesLoading,
  dialCodes,
  saving,
  onSave,
  onClose,
}: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0b1220] rounded-2xl shadow-2xl overflow-hidden border">
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Edit profile</h3>
            <p className="text-xs text-muted-foreground">Update name, contact and location</p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onSave} disabled={saving}>
              {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
              Save
            </Button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Display name</Label>
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Jane Doe" />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={email} disabled />
          </div>

          <div className="space-y-2">
            <Label>Country</Label>
            <Select value={country ?? ""} onValueChange={(v: string) => setCountry(v || null)}>
              <SelectTrigger>
                <SelectValue placeholder={countriesLoading ? "Loading countries..." : "Select country"} />
              </SelectTrigger>
              <SelectContent>
                {countries.map((c) => (
                  <SelectItem key={c.cca2} value={c.cca2}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>State / Region</Label>
            {/* If there are no states, show a disabled input instead of empty select */}
            {statesLoading ? (
              <Input value="Loading..." disabled />
            ) : states.length === 0 ? (
              <Input value="No states available" disabled />
            ) : (
              <Select value={stateName ?? ""} onValueChange={(v: string) => setStateName(v || null)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((s) => (
                    <SelectItem key={s.name} value={s.name}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Label>Dial code</Label>
            <Select value={dialCode ?? ""} onValueChange={(v: string) => setDialCode(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Dial code" />
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

          <div className="space-y-2 md:col-span-2">
            <Label>Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} placeholder="9876543210" />
            <p className="text-xs text-muted-foreground">Used for verification and recovery.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
