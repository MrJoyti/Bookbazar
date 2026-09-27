"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, AlertCircle, Sparkles } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import { useApp } from "@/lib/context/AppContext";

export default function UploadBookPage() {
  const { currentUser, addBook } = useApp();
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [edition, setEdition] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Computer Science");
  const [condition, setCondition] = useState<"Like New" | "Good" | "Fair" | "Worn">("Good");
  const [isbn, setIsbn] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!currentUser) {
      setError("You must be logged in to upload a book.");
      return;
    }

    if (!title || !author || !price || !description) {
      setError("Please fill in all required fields marked with *.");
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError("Please provide a valid price.");
      return;
    }

    // Colors list to choose from for cover mockup
    const colors = [
      "linear-gradient(135deg, #111, #333)",
      "linear-gradient(135deg, #333, #666)",
      "linear-gradient(135deg, #222, #555)",
      "linear-gradient(135deg, #000, #222)",
      "linear-gradient(135deg, #444, #777)",
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    setSubmitting(true);
    const result = await addBook({
      title,
      author,
      edition: edition || undefined,
      price: Math.round(priceNum),
      category,
      condition,
      isbn: isbn || undefined,
      description,
      coverColor: randomColor,
    });
    setSubmitting(false);

    if (!result.success) {
      setError(result.error || "Unable to publish this listing.");
      return;
    }

    setSubmitted(true);
    setTimeout(() => {
      router.push("/my-listings");
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-paper flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Header */}
        <section className="border-b border-vintage py-8 bg-beige/25">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <h1 className="font-serif text-3xl font-extrabold text-ink uppercase tracking-tight">
              Classified Circular Submission
            </h1>
            <p className="font-serif text-sm italic text-ink/75 mt-1">
              List your academic literature. Your listing will publish instantly to your campus bulletin grid.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-2xl px-5 py-8">
          {!currentUser ? (
            <div className="border-2 border-vintage p-8 text-center font-serif bg-card">
              <AlertCircle className="h-10 w-10 mx-auto text-vintage mb-3 animate-pulse" />
              <h3 className="font-bold uppercase mb-2">Editor Clearence Required</h3>
              <p className="text-sm text-ink/75 mb-6">
                You must sign in to dispatch book listings to the circular networks.
              </p>
              <a href="/login">
                <Button variant="primary" className="border-2 border-vintage font-bold uppercase">Sign In to Continue</Button>
              </a>
            </div>
          ) : submitted ? (
            <div className="border-4 border-double border-vintage p-8 text-center font-serif bg-card">
              <Sparkles className="h-10 w-10 mx-auto text-vintage mb-3" />
              <h3 className="font-bold uppercase text-vintage mb-2">Bulletin Received</h3>
              <p className="text-sm text-ink/75">
                Classified item <strong>"{title}"</strong> has been successfully printed.
              </p>
              <p className="text-xs text-ink/50 italic mt-4 animate-pulse">
                Redirecting to listings desk...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="border-2 border-vintage bg-card p-6 shadow-stack space-y-5">
              <h3 className="font-serif text-lg font-bold uppercase tracking-wide text-ink border-b border-vintage pb-2">
                Submit Ad Details
              </h3>

              {error && (
                <div className="border border-dashed border-vintage bg-beige/30 p-3 text-center font-serif text-xs font-bold uppercase text-vintage">
                  Error: {error}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Book Title */}
                <div className="sm:col-span-2">
                  <label className="block font-serif text-xs font-bold uppercase tracking-wider text-ink">
                    Book Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Fundamental of Electrical Engineering"
                    className="mt-1 w-full rounded-none border border-vintage bg-paper p-2.5 font-serif text-xs text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-vintage"
                    required
                  />
                </div>

                {/* Author */}
                <div>
                  <label className="block font-serif text-xs font-bold uppercase tracking-wider text-ink">
                    Author Name *
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Theraja & Theraja"
                    className="mt-1 w-full rounded-none border border-vintage bg-paper p-2.5 font-serif text-xs text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-vintage"
                    required
                  />
                </div>

                {/* Edition */}
                <div>
                  <label className="block font-serif text-xs font-bold uppercase tracking-wider text-ink">
                    Edition / Printing year
                  </label>
                  <input
                    type="text"
                    value={edition}
                    onChange={(e) => setEdition(e.target.value)}
                    placeholder="e.g. 21st Edition"
                    className="mt-1 w-full rounded-none border border-vintage bg-paper p-2.5 font-serif text-xs text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-vintage"
                  />
                </div>

                {/* Subject Category */}
                <div>
                  <label className="block font-serif text-xs font-bold uppercase tracking-wider text-ink">
                    Classified Subject *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 w-full rounded-none border border-vintage bg-paper p-2.5 font-serif text-xs font-bold uppercase text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-vintage"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Economics">Economics</option>
                    <option value="Literature">Literature</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Business">Business</option>
                    <option value="Law">Law</option>
                  </select>
                </div>

                {/* Condition */}
                <div>
                  <label className="block font-serif text-xs font-bold uppercase tracking-wider text-ink">
                    Condition Grade *
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as any)}
                    className="mt-1 w-full rounded-none border border-vintage bg-paper p-2.5 font-serif text-xs font-bold uppercase text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-vintage"
                  >
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Worn">Worn</option>
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block font-serif text-xs font-bold uppercase tracking-wider text-ink">
                    Price (৳ BDT) *
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 350"
                    min="1"
                    className="mt-1 w-full rounded-none border border-vintage bg-paper p-2.5 font-serif text-xs text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-vintage"
                    required
                  />
                </div>

                {/* ISBN */}
                <div>
                  <label className="block font-serif text-xs font-bold uppercase tracking-wider text-ink">
                    ISBN Number (optional)
                  </label>
                  <input
                    type="text"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    placeholder="e.g. 978-0123456789"
                    className="mt-1 w-full rounded-none border border-vintage bg-paper p-2.5 font-serif text-xs text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-vintage"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-serif text-xs font-bold uppercase tracking-wider text-ink">
                  Condition Details & Notes *
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Includes lecture guides, page 40 has highlights. Meet at BUET cafeteria for delivery."
                  className="mt-1 w-full rounded-none border border-vintage bg-paper p-2.5 font-serif text-xs text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-vintage"
                  required
                />
              </div>

              <div className="border-t border-vintage border-dashed pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => router.push("/home")}
                  className="font-serif text-xs font-bold uppercase text-ink/60 hover:underline"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="border-2 border-vintage bg-vintage text-paper py-2 px-6 font-bold uppercase hover:bg-paper hover:text-vintage transition-all duration-200"
                >
                  {submitting ? "Dispatching..." : "Dispatch to Circulars"}
                </Button>
              </div>
            </form>
          )}
        </section>
      </div>
      <Footer />
    </main>
  );
}
