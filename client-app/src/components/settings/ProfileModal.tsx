"use client";
import { MotionDiv } from "@/components/motion/motion"

import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Country = { name: string; cca2: string; dialCode?: string };
type StateItem = { name: string };

interface ProfileModalProps {
  open: boolean;
  displayName: string;
  setDisplayName: (v: string) => void;
  email: string;
  country: string | null;
  setCountry: (v: string | null) => void;
  stateName: string | null;
  setStateName: (v: string | null) => void;
  dialCode: string;
  setDialCode: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  countries: Country[];
  countriesLoading: boolean;
  states: StateItem[];
  statesLoading: boolean;
  dialCodes: string[];
  saving: boolean;
  onSave: () => void;
  onClose: () => void;
}

export default function ProfileModal({
  open,
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
}: ProfileModalProps) {
  const firstInputRef = useRef<HTMLInputElement | null>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);
  const hasAutoFocused = useRef(false);

  
  useEffect(() => {
    if (!open) return;

   
    previouslyFocusedElement.current =
      document.activeElement as HTMLElement;

   
    if (!hasAutoFocused.current) {
      requestAnimationFrame(() => {
        firstInputRef.current?.focus();
      });
      hasAutoFocused.current = true;
    }

    return () => {
      hasAutoFocused.current = false;

      // Restore focus back when modal closes
      previouslyFocusedElement.current?.focus?.();
    };
  }, [open]);

  
  useEffect(() => {
    if (!open) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;

    document.body.style.overflow = "hidden";

    
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
    };
  }, [open]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <MotionDiv
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onMouseDown={onClose}
      >
        <MotionDiv
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-modal-title"
          aria-describedby="profile-modal-description"
          className="relative w-full max-w-2xl bg-white dark:bg-[#0b1220] rounded-2xl shadow-2xl border overflow-hidden"
          initial={{ scale: 0.96, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.96, y: 30 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
         onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}

        >
          {/* ========================= Header ========================= */}
          <div className="p-5 sm:p-6 border-b flex items-start justify-between gap-4">
            <div>
              <h3
                id="profile-modal-title"
                className="text-lg sm:text-xl font-semibold"
              >
                Edit Profile
              </h3>
              <p
                id="profile-modal-description"
                className="text-xs sm:text-sm text-muted-foreground"
              >
                Update your personal information
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={onClose}
                disabled={saving}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>

              <Button onClick={onSave} disabled={saving}>
                {saving && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Save
              </Button>
            </div>
          </div>

          {/* ========================= Body ========================= */}
          <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
         
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                ref={firstInputRef}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Jane Doe"
              />
            </div>

           
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={email} disabled />
            </div>

        
            <div className="space-y-2">
              <Label>Country</Label>
              <Select
                value={country ?? ""}
                onValueChange={(v) => setCountry(v || null)}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      countriesLoading
                        ? "Loading countries..."
                        : "Select country"
                    }
                  />
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
              {statesLoading ? (
                <Input value="Loading..." disabled />
              ) : states.length === 0 ? (
                <Input value="No states available" disabled />
              ) : (
                <Select
                  value={stateName ?? ""}
                  onValueChange={(v) => setStateName(v || null)}
                >
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
              <Label>Dial Code</Label>
              <Select
                value={dialCode}
                onValueChange={(v) => setDialCode(v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Dial code" />
                </SelectTrigger>
                <SelectContent>
                  {dialCodes.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          
            <div className="space-y-2 md:col-span-2">
              <Label>Phone</Label>
              <Input
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, ""))
                }
                placeholder="9876543210"
                inputMode="numeric"
                autoComplete="tel"
              />
              <p className="text-xs text-muted-foreground">
                Used for verification and account recovery.
              </p>
            </div>
          </div>
        </MotionDiv>
      </MotionDiv>
    </AnimatePresence>
  );
}
