"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Star, User as UserIcon, Building2, ShieldCheck, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BookCard from "@/components/books/BookCard";
import { useApp } from "@/lib/context/AppContext";

export default function SellerProfilePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { books, booksLoading, booksError, refreshBooks } = useApp();

  // Find seller books and seller details
  const sellerBooks = useMemo(() => {
    return books.filter((b) => b.sellerId === id);
  }, [books, id]);

  const sellerInfo = useMemo(() => {
    if (sellerBooks.length > 0) {
      return {
        name: sellerBooks[0].sellerName,
        rating: sellerBooks[0].sellerRating || 5.0,
        university: sellerBooks[0].university,
      };
    }
    return {
      name: "Campus Correspondent",
      rating: 5.0,
      university: "Unknown Campus",
    };
  }, [sellerBooks]);

  return (
    <main className="min-h-screen bg-paper flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Section Header */}
        <section className="border-b border-vintage py-8 bg-beige/25">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <button
              onClick={() => router.back()}
              className="mb-3 flex items-center gap-1 font-serif text-[10px] font-bold uppercase tracking-wider text-ink/75 hover:underline"
            >
              <ArrowLeft className="h-3 w-3" /> Back
            </button>
            <h1 className="font-serif text-3xl font-extrabold text-ink uppercase tracking-tight">
              Seller Press Profile
            </h1>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-8 md:px-8">
          <div className="grid gap-8 md:grid-cols-[240px_1fr]">
            {/* Sidebar: Seller profile stats */}
            <aside className="space-y-6 border-r border-vintage border-dashed pr-6">
              <div className="border border-vintage bg-card p-5 text-center space-y-4">
                <div className="mx-auto border border-vintage p-3 bg-paper w-16 h-16 flex items-center justify-center">
                  <UserIcon className="h-10 w-10 text-vintage" />
                </div>
                
                <h3 className="font-serif text-lg font-bold uppercase tracking-tight text-ink">
                  {sellerInfo.name}
                </h3>

                <div className="space-y-2 border-t border-vintage border-dashed pt-4 font-serif text-xs text-left">
                  <div className="flex justify-between py-1">
                    <span className="text-ink/60 uppercase">Campus:</span>
                    <strong className="font-bold flex items-center gap-0.5"><Building2 className="h-3 w-3" /> {sellerInfo.university}</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-ink/60 uppercase">Seller Score:</span>
                    <strong className="font-bold flex items-center gap-0.5"><Star className="h-3 w-3 fill-vintage text-vintage" /> {sellerInfo.rating} / 5.0</strong>
                  </div>
                  <div className="flex justify-between py-1 border-t border-vintage border-dashed mt-2 pt-2">
                    <span className="text-ink/60 uppercase">Credentials:</span>
                    <strong className="font-bold text-[10px] uppercase text-vintage flex items-center gap-0.5"><ShieldCheck className="h-3 w-3" /> Verified Student</strong>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main: Seller listings */}
            <div>
              <h2 className="font-serif text-xl font-bold text-ink uppercase tracking-tight border-b border-vintage pb-2 mb-6">
                Active Circulars Listed ({sellerBooks.length})
              </h2>

              {booksLoading ? (
                <div className="border border-dashed border-vintage p-10 text-center font-serif bg-card animate-pulse">
                  <h4 className="font-bold uppercase text-vintage mb-2">Loading Circulars</h4>
                  <p className="text-xs text-ink/75">
                    Reading this seller's active catalogues from the database.
                  </p>
                </div>
              ) : booksError ? (
                <div className="border border-dashed border-vintage p-10 text-center font-serif bg-card">
                  <h4 className="font-bold uppercase text-vintage mb-2">Seller Shelf Unavailable</h4>
                  <p className="text-xs text-ink/75 mb-4">{booksError}</p>
                  <button
                    onClick={() => refreshBooks()}
                    className="border border-vintage bg-vintage px-4 py-2 font-serif text-xs font-bold uppercase text-paper hover:bg-paper hover:text-vintage"
                  >
                    Retry
                  </button>
                </div>
              ) : sellerBooks.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
                  {sellerBooks.map((b) => (
                    <BookCard key={b.id} book={b} />
                  ))}
                </div>
              ) : (
                <div className="border border-dashed border-vintage p-10 text-center font-serif bg-card">
                  <h4 className="font-bold uppercase text-vintage mb-2">No Active circulars</h4>
                  <p className="text-xs text-ink/75">
                    This seller has no academic catalogs active at the moment.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
