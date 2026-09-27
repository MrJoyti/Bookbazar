"use client";

import BookCard from "@/components/books/BookCard";
import { useApp } from "@/lib/context/AppContext";

export default function FeaturedBooks() {
  const { books, booksLoading, booksError, refreshBooks } = useApp();
  const featured = books.slice(0, 4);

  return (
    <section className="bg-paper py-14 border-b border-vintage">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <span className="inline-block border border-vintage bg-beige px-2 py-0.5 font-serif text-[10px] font-bold uppercase tracking-wider text-vintage mb-3">
          FEATURED THIS WEEK
        </span>
        <h2 className="font-serif text-3xl font-extrabold text-ink uppercase tracking-tight border-b border-vintage pb-2">
          Worth a second read
        </h2>

        {booksLoading ? (
          <div className="mt-8 border border-dashed border-vintage p-10 text-center font-serif bg-card animate-pulse">
            <h4 className="font-bold uppercase text-vintage mb-2">Loading Bulletins</h4>
            <p className="text-sm text-ink/75">Reading featured listings from the database.</p>
          </div>
        ) : booksError ? (
          <div className="mt-8 border border-dashed border-vintage p-10 text-center font-serif bg-card">
            <h4 className="font-bold uppercase text-vintage mb-2">Featured Shelf Unavailable</h4>
            <p className="text-sm text-ink/75 mb-4">{booksError}</p>
            <button
              onClick={() => refreshBooks()}
              className="border border-vintage bg-vintage px-4 py-2 font-serif text-xs font-bold uppercase text-paper hover:bg-paper hover:text-vintage"
            >
              Retry
            </button>
          </div>
        ) : featured.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
            {featured.map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        ) : (
          <div className="mt-8 border border-dashed border-vintage p-10 text-center font-serif bg-card">
            <h4 className="font-bold uppercase text-vintage mb-2">No Active Bulletins</h4>
            <p className="text-sm text-ink/75">The database catalogue is empty right now.</p>
          </div>
        )}
      </div>
    </section>
  );
}
