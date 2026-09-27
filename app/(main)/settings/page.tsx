"use client";

import { useState } from "react";
import { Settings, Eye, Volume2, Shield } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";

export default function SettingsPage() {
  // Settings states
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [soundCues, setSoundCues] = useState(false);
  const [themeMode, setThemeMode] = useState("monochrome");

  return (
    <main className="min-h-screen bg-paper flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Section Header */}
        <section className="border-b border-vintage py-8 bg-beige/25">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <h1 className="font-serif text-3xl font-extrabold text-ink uppercase tracking-tight flex items-center gap-2">
              <Settings className="h-7 w-7 text-vintage" /> Preferences desk
            </h1>
            <p className="font-serif text-sm italic text-ink/75 mt-1">
              Configure system alerts, print layouts, and reading templates.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-2xl px-5 py-8">
          <div className="border-2 border-vintage bg-card divide-y divide-vintage shadow-stack">
            {/* Theme configuration */}
            <div className="p-6 space-y-4">
              <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-vintage flex items-center gap-1.5 border-b border-vintage border-dashed pb-1.5">
                <Eye className="h-4 w-4" /> Editorial Print layout
              </h4>
              <div className="space-y-2">
                {[
                  { value: "monochrome", name: "High Contrast B&W (90s Newsprint)" },
                  { value: "amber", name: "Amber Halftone (Aged Parchment)" },
                  { value: "clean", name: "Clean Grayscale (Modern Press)" },
                ].map((th) => (
                  <label key={th.value} className="flex items-center gap-2 font-serif text-xs text-ink cursor-pointer">
                    <input
                      type="radio"
                      name="theme"
                      value={th.value}
                      checked={themeMode === th.value}
                      onChange={() => setThemeMode(th.value)}
                      className="rounded-full border border-vintage accent-vintage text-paper focus:ring-0"
                    />
                    <span className="font-bold uppercase tracking-wide">{th.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notification triggers */}
            <div className="p-6 space-y-4">
              <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-vintage flex items-center gap-1.5 border-b border-vintage border-dashed pb-1.5">
                <Volume2 className="h-4 w-4" /> Bulletin Alerts
              </h4>

              <div className="space-y-3 font-serif text-xs">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-bold uppercase">Dispatch Email Bulletins</span>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="border border-vintage accent-vintage rounded-none"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-bold uppercase">Enable System Sound Cues</span>
                  <input
                    type="checkbox"
                    checked={soundCues}
                    onChange={(e) => setSoundCues(e.target.checked)}
                    className="border border-vintage accent-vintage rounded-none"
                  />
                </label>
              </div>
            </div>

            {/* Account authentication security details */}
            <div className="p-6 space-y-4">
              <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-vintage flex items-center gap-1.5 border-b border-vintage border-dashed pb-1.5">
                <Shield className="h-4 w-4" /> Reader Security
              </h4>
              <p className="font-serif text-xs text-ink/75 leading-relaxed">
                Auth sessions terminate automatically on browser close. Clear local caches below to purge credentials.
              </p>
              <button
                onClick={() => {
                  localStorage.clear();
                  alert("Session logs purged. Please reload.");
                  window.location.reload();
                }}
                className="border border-vintage bg-paper text-vintage px-4 py-2 font-serif text-[10px] font-bold uppercase hover:bg-vintage hover:text-paper shadow-sm"
              >
                Clear Cache Database
              </button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
