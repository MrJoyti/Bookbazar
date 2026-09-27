"use client";

import { ShieldCheck, ArrowLeft, History } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useApp } from "@/lib/context/AppContext";

export default function AdminModerationPage() {
  const { currentUser } = useApp();

  // Mock moderation logs
  const logs = [
    { id: "mod_1", action: "Flag Resolved", target: "Intro to Algorithms", details: "Dispute dismissed: price verified with student book index.", date: "06/27/2026", auditor: "Chief Editor" },
    { id: "mod_2", action: "Member Audited", target: "Sajid Hasan (sajid@iut.edu)", details: "Account suspended due to repetitive off-campus payment solicitation.", date: "06/26/2026", auditor: "Chief Editor" },
    { id: "mod_3", action: "Circular Deleted", target: "Concepts of Thermodynamics", details: "Listing deleted by request of seller (trade completed).", date: "06/25/2026", auditor: "Chief Editor" },
  ];

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <main className="min-h-screen bg-paper flex flex-col justify-between">
        <div>
          <Navbar />
          <div className="mx-auto max-w-md px-5 py-24 text-center font-serif">
            <h2 className="text-2xl font-extrabold uppercase text-vintage mb-2">Access Restricted</h2>
            <p className="text-ink/80">Only Editorial Board can audit moderation logs.</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Section Header */}
        <section className="border-b border-vintage py-8 bg-beige/25">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <a
              href="/admin"
              className="mb-3 inline-flex items-center gap-1 font-serif text-[10px] font-bold uppercase tracking-wider text-ink/75 hover:underline"
            >
              <ArrowLeft className="h-3 w-3" /> Return to board
            </a>
            <h1 className="font-serif text-3xl font-extrabold text-ink uppercase tracking-tight flex items-center gap-2">
              <History className="h-7 w-7 text-vintage" /> Moderation Log Registers
            </h1>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-8 md:px-8">
          <div className="border border-vintage bg-card overflow-x-auto shadow-sm">
            <table className="w-full text-left font-serif border-collapse">
              <thead>
                <tr className="border-b border-vintage bg-beige/35 uppercase text-[10px] tracking-wider text-vintage">
                  <th className="p-3 font-bold">Log ID</th>
                  <th className="p-3 font-bold">Action</th>
                  <th className="p-3 font-bold">Target</th>
                  <th className="p-3 font-bold">Details</th>
                  <th className="p-3 font-bold">Date</th>
                  <th className="p-3 font-bold">Auditor</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {logs.map((l) => (
                  <tr key={l.id} className="border-b border-vintage/35 hover:bg-beige/10">
                    <td className="p-3 font-bold uppercase text-[10px] text-ink/65">{l.id}</td>
                    <td className="p-3 font-bold text-vintage uppercase tracking-wide">{l.action}</td>
                    <td className="p-3 font-bold text-ink/80">{l.target}</td>
                    <td className="p-3 text-ink/75 font-sans italic">{l.details}</td>
                    <td className="p-3 text-[10px] font-bold text-ink/50 uppercase">{l.date}</td>
                    <td className="p-3 font-bold text-ink/70">{l.auditor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
