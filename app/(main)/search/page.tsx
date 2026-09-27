"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search as SearchIcon, Filter, ArrowUpDown } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BookCard from "@/components/books/BookCard";
import { useApp } from "@/lib/context/AppContext";

function SearchPageContent() {
  const { books, booksLoading, booksError, refreshBooks } = useApp();
  const searchParams = useSearchParams();

  // Search and filter states
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedUniversity, setSelectedUniversity] = useState("All");
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState("default");

  // Read URL search params
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setSelectedCategory(cat);
    }
    const q = searchParams.get("query");
    if (q) {
      setQuery(q);
    }
  }, [searchParams]);

  const categories = useMemo(() => {
    const list = new Set(books.map((b) => b.category));
    return ["All", ...Array.from(list)];
  }, [books]);

  const universities = useMemo(() => {
    const list = new Set(books.map((b) => b.university));
    return ["All", ...Array.from(list)];
  }, [books]);

  const handleConditionChange = (condition: string) => {
    if (selectedConditions.includes(condition)) {
      setSelectedConditions(selectedConditions.filter((c) => c !== condition));
    } else {
      setSelectedConditions([...selectedConditions, condition]);
    }
  };

  // Filtered books
  const filteredBooks = useMemo(() => {
    let result = [...books];

    // Filter by search query
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          (b.isbn && b.isbn.includes(q))
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter((b) => b.category === selectedCategory);
    }

    // Filter by university
    if (selectedUniversity !== "All") {
      result = result.filter((b) => b.university === selectedUniversity);
    }

    // Filter by price
    result = result.filter((b) => b.price <= maxPrice);

    // Filter by condition
    if (selectedConditions.length > 0) {
      result = result.filter((b) => selectedConditions.includes(b.condition));
    }

    // Sorting
    if (sortBy === "priceAsc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "priceDesc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [books, query, selectedCategory, selectedUniversity, selectedConditions, maxPrice, sortBy]);

  return (
    <main className="min-h-screen bg-paper flex flex-col justify-between">
      <div>
        <Navbar />
        
        {/* Library Catalog Header */}
        <section className="border-b border-gold/30 py-10 bg-beige/15 relative">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <h1 className="font-serif text-3xl font-extrabold text-vintage uppercase tracking-tight">
              Library Card Catalogue
            </h1>
            <p className="font-serif text-sm italic text-ink/85 mt-1.5">
              Pull open a drawer and search the active indices of student literature across campus.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-8 md:px-8">
          {/* Main search bar styled like a card catalog drawer */}
          <div className="relative mb-8 border-4 border-walnut bg-[#FAF5ED] p-3 shadow-[5px_6px_16px_rgba(59,42,34,0.35)] rounded-[3px]">
            {/* Brass side rivets */}
            <div className="absolute top-1/2 left-[-6px] -translate-y-1/2 w-1.5 h-6 bg-gold border border-walnut/30 rounded-full" />
            <div className="absolute top-1/2 right-[-6px] -translate-y-1/2 w-1.5 h-6 bg-gold border border-walnut/30 rounded-full" />

            <div className="relative flex items-center bg-[#FAF5ED] border border-dashed border-vintage/35 p-1 rounded-[1px]">
              <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-vintage/70" />
              <input
                type="text"
                placeholder="Search catalog index by title, author, or keyword..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent py-3 pl-12 pr-4 font-serif text-base text-ink focus-visible:outline-none focus:outline-none placeholder:text-ink/40 tracking-wide"
                style={{
                  backgroundImage: "linear-gradient(rgba(200, 169, 106, 0.08) 1px, transparent 1px)",
                  backgroundSize: "100% 28px",
                  lineHeight: "28px"
                }}
              />
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-[240px_1fr]">
            {/* Sidebar Filters */}
            <aside className="space-y-6 border-r border-gold/30 border-dashed pr-6">
              <div className="flex items-center justify-between border-b-2 border-gold pb-2">
                <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-vintage flex items-center gap-1.5">
                  <Filter className="h-4 w-4" /> Filter Index
                </h3>
                <button
                  onClick={() => {
                    setQuery("");
                    setSelectedCategory("All");
                    setSelectedUniversity("All");
                    setSelectedConditions([]);
                    setMaxPrice(1000);
                    setSortBy("default");
                  }}
                  className="font-serif text-[10px] font-bold uppercase text-ink/70 hover:underline hover:text-vintage"
                >
                  Clear Index
                </button>
              </div>

              {/* Subject */}
              <div className="border border-gold/45 p-3.5 bg-card shadow-sm rounded-[2px]">
                <label className="block font-serif text-xs font-bold uppercase tracking-wider text-vintage mb-2">
                  Category / Subject
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-[2px] border border-gold bg-[#FAF5ED] p-2 font-serif text-xs font-bold uppercase text-ink focus-visible:outline-gold focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Campus */}
              <div className="border border-gold/45 p-3.5 bg-card shadow-sm rounded-[2px]">
                <label className="block font-serif text-xs font-bold uppercase tracking-wider text-vintage mb-2">
                  Campus Shelf
                </label>
                <select
                  value={selectedUniversity}
                  onChange={(e) => setSelectedUniversity(e.target.value)}
                  className="w-full rounded-[2px] border border-gold bg-[#FAF5ED] p-2 font-serif text-xs font-bold uppercase text-ink focus-visible:outline-gold focus:outline-none"
                >
                  {universities.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="border border-gold/45 p-3.5 bg-card shadow-sm rounded-[2px]">
                <div className="flex justify-between font-serif text-xs font-bold uppercase tracking-wider text-vintage mb-2">
                  <span>Max Budget</span>
                  <span>৳{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1500"
                  step="25"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-vintage cursor-pointer"
                />
              </div>

              {/* Condition */}
              <div className="border border-gold/45 p-3.5 bg-card shadow-sm rounded-[2px]">
                <label className="block font-serif text-xs font-bold uppercase tracking-wider text-vintage mb-2">
                  Volume Condition
                </label>
                <div className="space-y-2">
                  {["Like New", "Good", "Fair", "Worn"].map((c) => (
                    <label key={c} className="flex items-center gap-2.5 font-serif text-xs text-ink cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedConditions.includes(c)}
                        onChange={() => handleConditionChange(c)}
                        className="rounded-[2px] border-gold text-vintage accent-vintage focus:ring-0 focus:ring-offset-0"
                      />
                      <span className="font-serif font-bold uppercase tracking-wide text-xs">{c}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div className="border border-gold/45 p-3.5 bg-card shadow-sm rounded-[2px]">
                <label className="block font-serif text-xs font-bold uppercase tracking-wider text-vintage mb-2 flex items-center gap-1">
                  <ArrowUpDown className="h-3 w-3" /> Catalog Order
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full rounded-[2px] border border-gold bg-[#FAF5ED] p-2 font-serif text-xs font-bold uppercase text-ink focus-visible:outline-gold focus:outline-none"
                >
                  <option value="default">Standard Order</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="rating">Seller Rating</option>
                </select>
              </div>
            </aside>

            {/* Book listings grid */}
            <div>
              <div className="flex items-center justify-between border-b border-vintage pb-2 mb-6">
                <span className="font-serif text-xs font-bold uppercase tracking-wider text-ink/65">
                  Circulars Found: {booksLoading ? "..." : filteredBooks.length}
                </span>
              </div>

              {booksLoading ? (
                <div className="border border-dashed border-vintage p-10 text-center font-serif bg-card animate-pulse">
                  <h4 className="font-bold uppercase text-vintage mb-2">Loading Bulletins</h4>
                  <p className="text-sm text-ink/75">Reading the active catalogue from the database.</p>
                </div>
              ) : booksError ? (
                <div className="border border-dashed border-vintage p-10 text-center font-serif bg-card">
                  <h4 className="font-bold uppercase text-vintage mb-2">Catalogue Unavailable</h4>
                  <p className="text-sm text-ink/75 mb-4">{booksError}</p>
                  <button
                    onClick={() => refreshBooks()}
                    className="border border-vintage bg-vintage px-4 py-2 font-serif text-xs font-bold uppercase text-paper hover:bg-paper hover:text-vintage"
                  >
                    Retry
                  </button>
                </div>
              ) : filteredBooks.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
                  {filteredBooks.map((b) => (
                    <BookCard key={b.id} book={b} />
                  ))}
                </div>
              ) : (
                <div className="border border-dashed border-vintage p-10 text-center font-serif bg-card">
                  <h4 className="font-bold uppercase text-vintage mb-2">No Matching Bulletins</h4>
                  <p className="text-sm text-ink/75">
                    Adjust your classification search parameters or query keywords to locate listings.
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

export default function SearchPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-paper flex flex-col justify-between">
        <Navbar />
        <div className="flex items-center justify-center p-20 font-serif text-lg animate-pulse uppercase">
          Loading Bulletins...
        </div>
        <Footer />
      </main>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
