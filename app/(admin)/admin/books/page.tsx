"use client";

import { Trash2, AlertTriangle, ArrowLeft, BookOpen } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useApp } from "@/lib/context/AppContext";

export default function AdminBooksPage() {
  const { currentUser, books, deleteBookAdmin } = useApp();

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <main className="min-h-screen bg-paper flex flex-col justify-between">
        <div>
          <Navbar />
          <div className="mx-auto max-w-md px-5 py-24 text-center font-serif">
            <AlertTriangle className="h-10 w-10 mx-auto text-vintage mb-3" />
            <h2 className="text-2xl font-extrabold uppercase text-vintage mb-2">Access Restricted</h2>
            <p className="text-ink/80">Only Editorial Board can audit active publications database.</p>
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
              <BookOpen className="h-7 w-7 text-vintage" /> Active Publication Ledger
            </h1>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-8 md:px-8">
          {books.length > 0 ? (
            <div className="border border-vintage bg-card overflow-x-auto shadow-sm">
              <table className="w-full text-left font-serif border-collapse">
                <thead>
                  <tr className="border-b border-vintage bg-beige/35 uppercase text-[10px] tracking-wider text-vintage">
                    <th className="p-3 font-bold">Listing Title</th>
                    <th className="p-3 font-bold">Category</th>
                    <th className="p-3 font-bold">Seller</th>
                    <th className="p-3 font-bold">Campus</th>
                    <th className="p-3 font-bold">Price</th>
                    <th className="p-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {books.map((b) => (
                    <tr key={b.id} className="border-b border-vintage/35 hover:bg-beige/10">
                      <td className="p-3">
                        <a href={`/books/${b.id}`} className="font-bold text-vintage hover:underline uppercase block text-xs">
                          {b.title}
                        </a>
                        <span className="text-[9px] text-ink/50 block">By {b.author} (ID: {b.id})</span>
                      </td>
                      <td className="p-3 font-bold uppercase text-ink/80">{b.category}</td>
                      <td className="p-3 text-ink/70">{b.sellerName}</td>
                      <td className="p-3 font-bold text-ink/80">{b.university}</td>
                      <td className="p-3 font-bold">৳{b.price}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            if (confirm(`Admin action: Remove listing for "${b.title}" permanently?`)) {
                              deleteBookAdmin(b.id);
                            }
                          }}
                          className="border border-vintage bg-paper p-1.5 text-vintage hover:bg-vintage hover:text-paper shadow-sm"
                          title="Delete Listing"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="border border-dashed border-vintage p-10 text-center font-serif bg-card">
              <p className="text-xs text-ink/75 italic">
                No active publications listed in the circular ledger.
              </p>
            </div>
          )}
        </section>
      </div>
      <Footer />
    </main>
  );
}
