"use client";

import { useMemo, useState } from "react";
import { Trash2, AlertCircle, FileText, Plus } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import { useApp } from "@/lib/context/AppContext";

export default function MyListingsPage() {
  const { currentUser, books, booksLoading, booksError, refreshBooks, deleteBook } = useApp();
  const [deletingId, setDeletingId] = useState("");
  const [actionError, setActionError] = useState("");

  // Find user books
  const userBooks = useMemo(() => {
    if (!currentUser) return [];
    return books.filter((b) => b.sellerId === currentUser.id);
  }, [books, currentUser]);

  if (!currentUser) {
    return (
      <main className="min-h-screen bg-paper flex flex-col justify-between">
        <div>
          <Navbar />
          <div className="mx-auto max-w-md px-5 py-24 text-center font-serif">
            <AlertCircle className="h-10 w-10 mx-auto text-vintage mb-3" />
            <h2 className="text-2xl font-extrabold uppercase text-vintage mb-2">Access Denied</h2>
            <p className="text-ink/80 mb-6">Please sign in to access your listings ledger.</p>
            <a href="/login">
              <Button variant="primary" className="border-2 border-vintage font-bold uppercase">Sign In</Button>
            </a>
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
          <div className="mx-auto max-w-6xl px-5 md:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl font-extrabold text-ink uppercase tracking-tight flex items-center gap-2">
                <FileText className="h-7 w-7 text-vintage" /> Classified Listings Desk
              </h1>
              <p className="font-serif text-sm italic text-ink/75 mt-1">
                Ledger logs of your dispatched publications.
              </p>
            </div>
            <a href="/upload">
              <Button className="border-2 border-vintage bg-vintage text-paper px-4 py-2 font-bold uppercase hover:bg-paper hover:text-vintage flex items-center gap-1">
                <Plus className="h-4 w-4" /> Submit Classified
              </Button>
            </a>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-8 md:px-8">
          {booksLoading ? (
            <div className="max-w-md mx-auto border border-dashed border-vintage p-10 text-center font-serif bg-card mt-6 animate-pulse">
              <h4 className="font-bold uppercase text-vintage mb-2">Loading Listings</h4>
              <p className="text-xs text-ink/75 leading-relaxed">
                Reading your active classified ads from the database.
              </p>
            </div>
          ) : booksError ? (
            <div className="max-w-md mx-auto border border-dashed border-vintage p-10 text-center font-serif bg-card mt-6">
              <h4 className="font-bold uppercase text-vintage mb-2">Listings Unavailable</h4>
              <p className="text-xs text-ink/75 leading-relaxed mb-4">{booksError}</p>
              <button
                onClick={() => refreshBooks()}
                className="border border-vintage bg-vintage px-4 py-2 font-serif text-xs font-bold uppercase text-paper hover:bg-paper hover:text-vintage"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {actionError && (
                <div className="mb-4 border border-dashed border-vintage bg-beige/30 p-3 text-center font-serif text-xs font-bold uppercase text-vintage">
                  Error: {actionError}
                </div>
              )}
              {userBooks.length > 0 ? (
            <div className="border border-vintage bg-card overflow-x-auto shadow-sm">
              <table className="w-full text-left font-serif border-collapse">
                <thead>
                  <tr className="border-b-2 border-vintage bg-beige/35 uppercase text-xs tracking-wider text-vintage">
                    <th className="p-4 font-bold">Catalog details</th>
                    <th className="p-4 font-bold">Subject</th>
                    <th className="p-4 font-bold">Grade</th>
                    <th className="p-4 font-bold">Rate</th>
                    <th className="p-4 font-bold text-right">Ledger actions</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {userBooks.map((b) => (
                    <tr key={b.id} className="border-b border-vintage/35 hover:bg-beige/10">
                      <td className="p-4">
                        <a href={`/books/${b.id}`} className="font-bold text-vintage hover:underline uppercase block text-sm">
                          {b.title}
                        </a>
                        <span className="text-ink/60 text-[10px] italic">By {b.author} {b.edition ? `(${b.edition})` : ""}</span>
                      </td>
                      <td className="p-4 font-bold uppercase tracking-wider text-ink/80">{b.category}</td>
                      <td className="p-4 font-bold uppercase text-ink/70">{b.condition}</td>
                      <td className="p-4 font-bold text-sm">৳{b.price}</td>
                      <td className="p-4 text-right">
                        <button
                          disabled={deletingId === b.id}
                          onClick={async () => {
                            if (confirm(`Remove circular listing for "${b.title}"?`)) {
                              setActionError("");
                              setDeletingId(b.id);
                              const result = await deleteBook(b.id);
                              setDeletingId("");
                              if (!result.success) {
                                setActionError(result.error || "Unable to remove listing.");
                              }
                            }
                          }}
                          className="border border-vintage bg-paper p-2 text-vintage hover:bg-vintage hover:text-paper shadow-sm"
                          title="Remove Listing"
                        >
                          <Trash2 className={deletingId === b.id ? "h-4 w-4 animate-pulse" : "h-4 w-4"} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="max-w-md mx-auto border border-dashed border-vintage p-10 text-center font-serif bg-card mt-6">
              <h4 className="font-bold uppercase text-vintage mb-2">No Active Listings</h4>
              <p className="text-xs text-ink/75 leading-relaxed">
                You haven't dispatched any academic classified ads yet. Press the "Submit Classified" button above to publish your first book.
              </p>
            </div>
              )}
            </>
          )}
        </section>
      </div>
      <Footer />
    </main>
  );
}
