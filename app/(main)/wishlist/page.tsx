"use client";

import { Heart, HelpCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BookCard from "@/components/books/BookCard";
import { useApp } from "@/lib/context/AppContext";

export default function WishlistPage() {
  const { currentUser, wishlistBooks, wishlistLoading, wishlistError } = useApp();

  return (
    <main className="min-h-screen bg-paper flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Section Header */}
        <section className="border-b border-vintage py-8 bg-beige/25">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <h1 className="font-serif text-3xl font-extrabold text-ink uppercase tracking-tight flex items-center gap-2">
              <Heart className="h-7 w-7 text-vintage fill-vintage" /> Bookmarks Circular Shelf
            </h1>
            <p className="font-serif text-sm italic text-ink/75 mt-1">
              Classified lists you are tracking this semester.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-8 md:px-8">
          {!currentUser ? (
            <div className="max-w-md mx-auto border border-dashed border-vintage p-10 text-center font-serif bg-card mt-6">
              <HelpCircle className="h-10 w-10 mx-auto text-vintage mb-3" />
              <h4 className="font-bold uppercase text-vintage mb-2">Sign In Required</h4>
              <p className="text-xs text-ink/75 leading-relaxed">
                Sign in to load your personal bookmarks from the BookBazar records.
              </p>
            </div>
          ) : wishlistLoading ? (
            <div className="max-w-md mx-auto border border-dashed border-vintage p-10 text-center font-serif bg-card mt-6 animate-pulse">
              <Heart className="h-10 w-10 mx-auto text-vintage mb-3" />
              <h4 className="font-bold uppercase text-vintage mb-2">Loading Shelf</h4>
              <p className="text-xs text-ink/75 leading-relaxed">
                Checking your saved classified listings.
              </p>
            </div>
          ) : wishlistError ? (
            <div className="max-w-md mx-auto border border-dashed border-vintage p-10 text-center font-serif bg-card mt-6">
              <HelpCircle className="h-10 w-10 mx-auto text-vintage mb-3" />
              <h4 className="font-bold uppercase text-vintage mb-2">Shelf Unavailable</h4>
              <p className="text-xs text-ink/75 leading-relaxed">
                {wishlistError}
              </p>
            </div>
          ) : wishlistBooks.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
              {wishlistBooks.map((b) => (
                <BookCard key={b.id} book={b} />
              ))}
            </div>
          ) : (
            <div className="max-w-md mx-auto border border-dashed border-vintage p-10 text-center font-serif bg-card mt-6">
              <HelpCircle className="h-10 w-10 mx-auto text-vintage mb-3" />
              <h4 className="font-bold uppercase text-vintage mb-2">Shelf is Empty</h4>
              <p className="text-xs text-ink/75 leading-relaxed">
                You haven't bookmarked any bulletins yet. Browse listings and press the heart icon on any ad cards to save them.
              </p>
            </div>
          )}
        </section>
      </div>
      <Footer />
    </main>
  );
}
