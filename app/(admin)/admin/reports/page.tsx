"use client";

import { AlertTriangle, ArrowLeft, CheckCircle2, Trash2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useApp } from "@/lib/context/AppContext";

export default function AdminReportsPage() {
  const { currentUser, reports, resolveReport, deleteBookAdmin } = useApp();

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <main className="min-h-screen bg-paper flex flex-col justify-between">
        <div>
          <Navbar />
          <div className="mx-auto max-w-md px-5 py-24 text-center font-serif">
            <AlertTriangle className="h-10 w-10 mx-auto text-vintage mb-3" />
            <h2 className="text-2xl font-extrabold uppercase text-vintage mb-2">Access Restricted</h2>
            <p className="text-ink/80">Only Editorial Board can audit reports database.</p>
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
              <AlertTriangle className="h-7 w-7 text-vintage" /> Circular Dispute Desk
            </h1>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-8 md:px-8">
          {reports.length > 0 ? (
            <div className="border border-vintage bg-card overflow-x-auto shadow-sm">
              <table className="w-full text-left font-serif border-collapse">
                <thead>
                  <tr className="border-b border-vintage bg-beige/35 uppercase text-[10px] tracking-wider text-vintage">
                    <th className="p-3 font-bold">Dispute ID</th>
                    <th className="p-3 font-bold">Book Title</th>
                    <th className="p-3 font-bold">Reported By</th>
                    <th className="p-3 font-bold">Reason Notes</th>
                    <th className="p-3 font-bold">State</th>
                    <th className="p-3 font-bold text-right">Audit Actions</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {reports.map((r) => (
                    <tr key={r.id} className="border-b border-vintage/35 hover:bg-beige/10">
                      <td className="p-3 font-bold uppercase text-[10px] text-ink/65">{r.id}</td>
                      <td className="p-3">
                        <span className="font-bold text-ink uppercase block text-xs">{r.bookTitle}</span>
                        <span className="text-[9px] text-ink/50 block">ID: {r.bookId} · {r.date}</span>
                      </td>
                      <td className="p-3 font-bold text-ink/75">{r.reportedBy}</td>
                      <td className="p-3 italic text-ink/80 leading-relaxed font-sans">{r.reason}</td>
                      <td className="p-3">
                        <span className={`inline-flex items-center gap-0.5 font-bold uppercase tracking-wider text-[9px] px-1.5 py-0.5 border ${
                          r.status === "Pending" ? "border-vintage bg-card text-vintage animate-pulse" : "border-vintage bg-beige text-ink/50"
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        {r.status === "Pending" && (
                          <>
                            <button
                              onClick={() => resolveReport(r.id)}
                              className="border border-vintage bg-vintage text-paper px-2.5 py-1 text-[10px] font-bold uppercase hover:bg-paper hover:text-vintage transition-colors"
                              title="Resolve / Dismiss"
                            >
                              Dismiss
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Remove violating book listed in report "${r.bookTitle}" permanently?`)) {
                                  deleteBookAdmin(r.bookId);
                                }
                              }}
                              className="border border-vintage bg-paper text-vintage p-1 hover:bg-vintage hover:text-paper shadow-sm inline-flex items-center"
                              title="Delete Book Listing"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="border border-dashed border-vintage p-10 text-center font-serif bg-card">
              <p className="text-xs text-ink/75 italic">
                No active disputations or flags filed by readers.
              </p>
            </div>
          )}
        </section>
      </div>
      <Footer />
    </main>
  );
}
