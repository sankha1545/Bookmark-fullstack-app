"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { Loader2, Trash2, LogOut, Edit2 } from "lucide-react";
import { format } from "date-fns";

import ProfileModal from "@/components/settings/ProfileModal";
import ConfirmDialog from "@/components/settings/ConfirmDialog";

type Country = { name: string; cca2: string; dialCode?: string };
type StateItem = { name: string };

export default function SettingsPage() {

  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const themeValue = mounted ? theme ?? resolvedTheme : "system";

 
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [saving, setSaving] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /* Editable Fields */
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState<string | null>(null);
  const [stateName, setStateName] = useState<string | null>(null);
  const [dialCode, setDialCode] = useState("+91");
  const [phone, setPhone] = useState("");

  /* Lookup Data */
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<StateItem[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(false);
  const [statesLoading, setStatesLoading] = useState(false);

 
  const didFetchRef = useRef(false);


  const fetchUserAndProfile = useCallback(async () => {
    setLoadingProfile(true);

    try {
      const { data } = await supabase.auth.getUser();
      const currentUser = data?.user ?? null;
      setUser(currentUser);

      if (!currentUser) return;

      setEmail(currentUser.email || "");

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", currentUser.id)
        .single();

      if (error && (error as any).code !== "PGRST116") {
        console.warn("fetch profile error:", error);
      }

      if (profileData) {
        setProfile(profileData);
        setDisplayName(profileData.display_name ?? "");
        setCountry(profileData.country ?? null);
        setStateName(profileData.state ?? null);
        setDialCode(profileData.dial_code ?? "+91");
        setPhone(profileData.phone ?? "");
      }
    } catch (err) {
      console.error("fetchUserAndProfile", err);
    } finally {
      setLoadingProfile(false);
    }
  }, []);

  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;
    fetchUserAndProfile();
  }, [fetchUserAndProfile]);


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

            if (c?.idd?.root) {
              const root = c.idd.root;
              const suffix = c?.idd?.suffixes?.[0];
              dial = suffix ? `${root}${suffix}` : root;
              if (dial && !dial.startsWith("+")) dial = `+${dial}`;
            }

            return {
              name: c?.name?.common ?? "Unknown",
              cca2: c?.cca2 ?? "",
              dialCode: dial,
            };
          })
          .filter((x: Country) => x.name && x.cca2)
          .sort((a: Country, b: Country) =>
            a.name.localeCompare(b.name)
          );

        if (!cancelled) setCountries(mapped);
      } catch {
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
        const cObj = countries.find((c) => c.cca2 === country);
        if (!cObj?.name) return;

        if (cObj.dialCode) setDialCode(cObj.dialCode);

        const res = await fetch(
          "https://countriesnow.space/api/v0.1/countries/states",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ country: cObj.name }),
          }
        );

        if (!res.ok) throw new Error("states fetch failed");

        const json = await res.json();
        const mapped =
          json?.data?.states?.map((s: any) => ({
            name: s.name ?? s,
          })) ?? [];

        if (!cancelled) setStates(mapped);
      } catch {
        if (!cancelled) setStates([]);
      } finally {
        if (!cancelled) setStatesLoading(false);
      }
    }

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


  const saveProfile = useCallback(async () => {
    if (!user) return;

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
      const { data, error } = await supabase
        .from("profiles")
        .upsert(payload, { onConflict: "user_id" })
        .select()
        .single();

      if (error) throw error;

      setProfile(data);

      if (displayName) {
        await supabase.auth.updateUser({
          data: { display_name: displayName },
        });
      }

      setOpenEdit(false);
    } catch (err) {
      console.error("saveProfile error:", err);
      alert("Failed to save profile.");
    } finally {
      setSaving(false);
      fetchUserAndProfile();
    }
  }, [user, displayName, country, stateName, dialCode, phone, fetchUserAndProfile]);


  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.replace("/login");
  }

  async function handleDeleteConfirmed() {
    setDeleting(true);
    try {
      const res = await fetch("/api/delete-account", { method: "POST" });
      if (!res.ok) throw new Error("delete failed");
      window.location.replace("/");
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  }


  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and profile
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <div className="text-sm text-muted-foreground">
              Signed in as
            </div>
            <div className="font-medium truncate max-w-md">
              {email || "—"}
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              {profile?.display_name ?? "No display name"}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Profile updated:{" "}
              {profile?.updated_at
                ? format(new Date(profile.updated_at), "PPP p")
                : "—"}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => setOpenEdit(true)}
            >
              <Edit2 className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>

            <Button
              onClick={fetchUserAndProfile}
              variant="outline"
            >
              {loadingProfile && (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              )}
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      

   <Card className="border-red-200">
  <CardHeader>
    <CardTitle className="text-red-600">
      Danger Zone
    </CardTitle>
  </CardHeader>

  <CardContent className="flex flex-col sm:flex-row gap-4 w-full">
    <Button
      variant="outline"
      onClick={logout}
      className="w-full sm:w-auto sm:flex-1"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>

    <Button
      variant="destructive"
      onClick={() => setShowDeleteConfirm(true)}
      className="w-full sm:w-auto sm:flex-1"
    >
      <Trash2 className="mr-2 h-4 w-4" />
      Delete Account
    </Button>
  </CardContent>
</Card>


      <ProfileModal
        open={openEdit}
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
        countriesLoading={countriesLoading}
        states={states}
        statesLoading={statesLoading}
        dialCodes={dialCodes}
        saving={saving}
        onSave={saveProfile}
        onClose={() => setOpenEdit(false)}
      />

      {showDeleteConfirm && (
        <ConfirmDialog
          title="Permanently delete your account?"
          description="This action is irreversible."
          confirmLabel="Delete Account"
          cancelLabel="Cancel"
          loading={deleting}
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteConfirmed}
        />
      )}
    </div>
  );
}
