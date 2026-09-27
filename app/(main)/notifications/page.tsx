"use client";

import { useEffect } from "react";
import { Bell, Info, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useApp } from "@/lib/context/AppContext";

export default function NotificationsPage() {
  const { notifications, markNotificationsRead, currentUser } = useApp();

  // Mark notifications read on mount
  useEffect(() => {
    markNotificationsRead();
  }, []);

  return (
    <main className="min-h-screen bg-paper flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Section Header */}
        <section className="border-b border-vintage py-8 bg-beige/25">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <h1 className="font-serif text-3xl font-extrabold text-ink uppercase tracking-tight flex items-center gap-2">
              <Bell className="h-7 w-7 text-vintage" /> Editorial Bulletins
            </h1>
            <p className="font-serif text-sm italic text-ink/75 mt-1">
              System logs and transaction notifications.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-2xl px-5 py-8">
          {currentUser ? (
            notifications.length > 0 ? (
              <div className="border border-vintage bg-card divide-y divide-vintage">
                {notifications.map((n) => (
                  <div key={n.id} className="p-4 font-serif flex gap-3.5 items-start">
                    <div className="mt-0.5 border border-vintage p-1 bg-paper flex-shrink-0">
                      {n.type === "success" ? (
                        <CheckCircle2 className="h-4 w-4 text-vintage" />
                      ) : n.type === "alert" ? (
                        <AlertTriangle className="h-4 w-4 text-vintage animate-bounce" />
                      ) : (
                        <Info className="h-4 w-4 text-ink/70" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-ink leading-relaxed font-serif">{n.text}</p>
                      <span className="text-[10px] text-ink/50 block font-bold uppercase tracking-wider">{n.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-vintage p-8 text-center font-serif bg-card">
                <p className="text-xs text-ink/75 italic">
                  No editorial bulletins currently recorded.
                </p>
              </div>
            )
          ) : (
            <div className="border border-vintage p-8 text-center font-serif bg-card">
              <h3 className="font-bold uppercase mb-2">Access Denied</h3>
              <p className="text-xs text-ink/75 leading-relaxed">
                Please sign in to access notifications.
              </p>
            </div>
          )}
        </section>
      </div>
      <Footer />
    </main>
  );
}
