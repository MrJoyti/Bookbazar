"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Heart, Star, ShoppingCart, MessageSquare, Flag, ArrowLeft, Building2,
  Check, Smartphone, Wallet, AlertCircle, ShieldCheck, Package
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import { Book, useApp } from "@/lib/context/AppContext";
import { cn } from "@/lib/utils";

type PaymentMethod = "balance" | "bkash";

export default function BookDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { wishlist, toggleWishlist, placeOrder, sendChatMessage, reportBook, currentUser, addToCart, cart } = useApp();

  const [book, setBook] = useState<Book | null>(null);
  const [bookLoading, setBookLoading] = useState(true);
  const [bookError, setBookError] = useState("");
  const wishlisted = wishlist.includes(id);
  const inCart = cart.some((c) => c.bookId === id);

  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("balance");
  const [bkashNumber, setBkashNumber] = useState("");
  const [purchaseError, setPurchaseError] = useState("");
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [cartStatus, setCartStatus] = useState<"idle" | "added" | "error">("idle");
  const [cartMsg, setCartMsg] = useState("");

  const [reportReason, setReportReason] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadBook() {
      setBookLoading(true);
      setBookError("");
      try {
        const response = await fetch(`/api/books/${id}`, { cache: "no-store" });
        if (!response.ok) {
          const result = await response.json().catch(() => null);
          throw new Error(result?.error || "Book not found.");
        }
        const result = await response.json();
        const apiBook = result.data.book;
        if (!cancelled) {
          setBook({
            id: apiBook.id,
            title: apiBook.title,
            author: apiBook.author,
            edition: apiBook.edition || undefined,
            price: apiBook.price,
            condition: apiBook.condition,
            rating: apiBook.rating || undefined,
            coverColor: apiBook.coverColor || undefined,
            category: apiBook.category,
            sellerId: apiBook.sellerId,
            sellerName: apiBook.seller?.name || "Campus Correspondent",
            sellerRating: 5.0,
            description: apiBook.description,
            university: apiBook.university || apiBook.seller?.university || "",
            isbn: apiBook.isbn || undefined,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setBook(null);
          setBookError(error instanceof Error ? error.message : "Book not found.");
        }
      } finally {
        if (!cancelled) setBookLoading(false);
      }
    }

    loadBook();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (bookLoading) {
    return (
      <main className="min-h-screen bg-paper flex flex-col justify-between">
        <div>
          <Navbar />
          <div className="mx-auto max-w-md px-5 py-24 text-center font-serif animate-pulse">
            <h2 className="text-2xl font-extrabold uppercase text-vintage mb-2">Loading Bulletin</h2>
            <p className="text-ink/80 mb-6">Reading this classified listing from the database.</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!book) {
    return (
      <main className="min-h-screen bg-paper flex flex-col justify-between">
        <div>
          <Navbar />
          <div className="mx-auto max-w-md px-5 py-24 text-center font-serif animate-fade-up">
            <h2 className="text-2xl font-extrabold uppercase text-vintage mb-2">Bulletin Expired</h2>
            <p className="text-ink/80 mb-6">{bookError || "This classified listing is no longer active in the BookBazar records."}</p>
            <a href="/home">
              <Button variant="secondary" className="border-2 border-vintage font-bold uppercase">Return to Browse</Button>
            </a>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const handleAddToCart = async () => {
    setCartStatus("added");
    const res = await addToCart(book);
    if (res.success) {
      setTimeout(() => setCartStatus("idle"), 2500);
    } else {
      setCartStatus("error");
      setCartMsg(res.error || "Error");
      setTimeout(() => { setCartStatus("idle"); setCartMsg(""); }, 2500);
    }
  };

  const handleBuy = () => {
    setPurchaseError("");
    if (paymentMethod === "bkash" && (!bkashNumber || bkashNumber.replace(/\D/g, "").length < 11)) {
      setPurchaseError("Please enter a valid 11-digit bKash number.");
      return;
    }
    setIsProcessing(true);
    const delay = paymentMethod === "bkash" ? 1600 : 400;
    setTimeout(() => {
      const res = placeOrder(book.id, paymentMethod, bkashNumber || undefined);
      setIsProcessing(false);
      if (res.success) {
        setPurchaseSuccess(true);
        setTimeout(() => router.push("/orders"), 2000);
      } else {
        setPurchaseError(res.error || "Purchase failed.");
      }
    }, delay);
  };

  const handleContact = () => {
    if (!currentUser) { router.push("/login"); return; }
    const threadId = sendChatMessage(book.id, `Greetings! I am interested in purchasing your listing for "${book.title}". Is it still available?`);
    if (threadId) router.push("/messages");
  };

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason) return;
    reportBook(book.id, reportReason);
    setReportSubmitted(true);
    setTimeout(() => {
      setShowReport(false);
      setReportSubmitted(false);
      setReportReason("");
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-paper flex flex-col justify-between">
      <div>
        <Navbar />

        <div className="mx-auto max-w-6xl px-5 py-8 md:px-8">
          {/* Back link */}
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-1 font-serif text-xs font-bold uppercase tracking-wider text-ink/75 hover:underline transition-all group animate-fade-in"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Return to circulation
          </button>

          {/* Classified Details Layout */}
          <div className="grid gap-10 md:grid-cols-[1fr_1.3fr]">

            {/* Left Column */}
            <div className="space-y-6 animate-fade-up">
              {/* Book Cover */}
              <div
                className="flex aspect-[3/4] w-full flex-col items-center justify-between border-4 border-double border-vintage p-8 bg-paper shadow-stack transition-all duration-500 hover:shadow-lift hover:-translate-y-1 group overflow-hidden relative"
                style={{ background: book.coverColor ?? "linear-gradient(135deg, #e5e2da, #f6f4f0)" }}
              >
                {/* Scanning line on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background: "repeating-linear-gradient(transparent, transparent 3px, rgba(255,255,255,0.04) 3px, rgba(255,255,255,0.04) 4px)",
                  }}
                />
                <div className="w-full text-left font-serif text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40">
                  {book.category}
                </div>
                <div className="text-center">
                  <h1 className="font-serif text-2xl font-extrabold leading-tight tracking-tight text-ink uppercase">
                    {book.title}
                  </h1>
                  <p className="mt-2 font-serif text-sm italic text-ink/70">By {book.author}</p>
                </div>
                <div className="w-full text-right font-serif text-[10px] font-bold uppercase tracking-wider text-ink/50 flex items-center justify-end gap-1.5">
                  <Building2 className="h-3 w-3" /> Campus: {book.university}
                </div>
              </div>

              {/* Report section */}
              <div className="border border-dashed border-vintage p-4 bg-beige/10 animate-fade-up delay-200">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-[10px] font-bold uppercase tracking-wider text-ink/60">
                    Listing ID: {book.id}
                  </span>
                  <button
                    onClick={() => setShowReport(!showReport)}
                    className="font-serif text-[10px] font-bold uppercase text-vintage hover:underline flex items-center gap-1 transition-all"
                  >
                    <Flag className="h-3 w-3" /> Report Listing
                  </button>
                </div>

                {showReport && (
                  <form onSubmit={handleReport} className="mt-4 border-t border-dashed border-vintage pt-4 space-y-3 animate-fade-up">
                    {reportSubmitted ? (
                      <p className="font-serif text-xs text-vintage font-bold uppercase tracking-wide text-center">
                        Report filed with Editor board.
                      </p>
                    ) : (
                      <>
                        <label className="block font-serif text-[10px] font-bold uppercase tracking-wider text-ink">
                          Reason for Editorial Audit
                        </label>
                        <textarea
                          rows={2}
                          value={reportReason}
                          onChange={(e) => setReportReason(e.target.value)}
                          placeholder="e.g. Inappropriate price, wrong details, suspicious listing"
                          className="w-full rounded-none border border-vintage bg-card p-2 font-serif text-xs text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-vintage resize-none"
                          required
                        />
                        <div className="flex gap-2 justify-end">
                          <button type="button" onClick={() => setShowReport(false)} className="font-serif text-[10px] font-bold uppercase text-ink hover:underline">
                            Cancel
                          </button>
                          <button type="submit" className="border border-vintage bg-vintage text-paper px-2 py-1 font-serif text-[10px] font-bold uppercase hover:bg-paper hover:text-vintage transition-all">
                            File Report
                          </button>
                        </div>
                      </>
                    )}
                  </form>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col justify-between space-y-6 animate-fade-up delay-100">
              <div>
                <span className="inline-block border border-vintage bg-beige px-2 py-0.5 font-serif text-[10px] font-bold uppercase tracking-wider text-vintage mb-3">
                  {book.category}
                </span>

                <h1 className="font-serif text-4xl font-extrabold text-ink uppercase tracking-tight animate-ink-press">
                  {book.title}
                </h1>

                <p className="mt-2 font-serif text-lg text-ink/75 italic border-b border-dashed border-vintage pb-3">
                  By {book.author} {book.edition ? ` · ${book.edition}` : ""}
                </p>

                {/* Classification info */}
                <div className="grid grid-cols-2 gap-4 border-b border-dashed border-vintage py-4 font-serif text-xs uppercase tracking-wider text-ink">
                  {[
                    { label: "Condition Grade", val: book.condition, highlight: true },
                    { label: "Standard Price", val: `৳${book.price}`, highlight: true },
                    { label: "ISBN Register", val: book.isbn || "Not Registered" },
                    { label: "Campus Location", val: book.university },
                  ].map((item, i) => (
                    <div key={i} className="animate-stagger-in" style={{ animationDelay: `${200 + i * 80}ms` }}>
                      <span className="text-ink/50 block text-[10px]">{item.label}</span>
                      <strong className={cn("font-bold text-sm", item.highlight && "text-vintage")}>
                        {item.val}
                      </strong>
                    </div>
                  ))}
                </div>

                {/* Star Rating */}
                {book.rating && (
                  <div className="flex items-center gap-1 py-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn("h-4 w-4 transition-all", i < book.rating! ? "fill-vintage text-vintage" : "text-ink/20")}
                        strokeWidth={2}
                      />
                    ))}
                    <span className="font-serif text-xs text-ink/50 ml-1">{book.rating}.0 / 5.0</span>
                  </div>
                )}

                {/* Description */}
                <div className="mt-4 space-y-2 animate-fade-up delay-300">
                  <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-ink">Seller Description:</h4>
                  <p className="font-serif text-sm text-ink/80 leading-relaxed bg-card p-4 border border-vintage">
                    {book.description}
                  </p>
                </div>

                {/* Seller Bio */}
                <div className="mt-6 flex items-center justify-between border border-vintage p-4 bg-beige/20 animate-fade-up delay-400">
                  <div className="space-y-1">
                    <span className="font-serif text-[10px] font-bold uppercase tracking-wider text-ink/50 block">Listed By</span>
                    <a href={`/sellers/${book.sellerId}`} className="font-serif text-sm font-bold uppercase tracking-wide text-vintage hover:underline">
                      {book.sellerName}
                    </a>
                  </div>
                  {book.sellerRating && (
                    <div className="text-right">
                      <span className="font-serif text-[10px] font-bold uppercase tracking-wider text-ink/50 block">Seller Score</span>
                      <span className="font-serif text-xs font-bold uppercase text-ink flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-vintage text-vintage" /> {book.sellerRating} / 5.0
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action desk */}
              <div className="border-t-2 border-vintage pt-6 space-y-3 animate-fade-up delay-500">
                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={inCart || cartStatus === "added"}
                  className={cn(
                    "w-full border-2 py-3 font-serif font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]",
                    inCart || cartStatus === "added"
                      ? "border-vintage bg-vintage text-paper cursor-default"
                      : cartStatus === "error"
                      ? "border-vintage bg-beige text-vintage"
                      : "border-vintage bg-paper text-vintage hover:bg-vintage hover:text-paper"
                  )}
                >
                  {inCart || cartStatus === "added" ? (
                    <><Check className="h-4 w-4" strokeWidth={3} /> Added to Cart</>
                  ) : cartStatus === "error" ? (
                    <><AlertCircle className="h-4 w-4" /> {cartMsg}</>
                  ) : (
                    <><ShoppingCart className="h-4 w-4" /> Add to Cart</>
                  )}
                </button>

                <div className="flex gap-3">
                  {/* Buy Now */}
                  <Button
                    onClick={() => setShowCheckout(true)}
                    className="flex-1 border-2 border-vintage bg-vintage text-paper py-3 font-bold uppercase tracking-wider hover:bg-paper hover:text-vintage transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    Buy Now
                  </Button>

                  {/* Contact Seller */}
                  <Button
                    variant="secondary"
                    onClick={handleContact}
                    className="border-2 border-vintage py-3 font-bold uppercase tracking-wider hover:bg-beige flex items-center justify-center gap-2 transition-all duration-200"
                  >
                    <MessageSquare className="h-4 w-4" /> Contact
                  </Button>

                  {/* Wishlist */}
                  <button
                    onClick={() => toggleWishlist(book.id)}
                    className="border-2 border-vintage bg-card p-3 hover:bg-beige transition-all duration-200 hover:scale-105 active:scale-95"
                    title="Toggle Bookmark"
                  >
                    <Heart
                      className={cn("h-5 w-5 transition-all duration-300", wishlisted ? "fill-vintage text-vintage scale-110" : "text-ink")}
                      strokeWidth={2}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Checkout Modal ─────────────────────────────────────────── */}
        {showCheckout && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-vintage/60 p-5 backdrop-blur-sm animate-fade-in"
            onClick={(e) => { if (e.target === e.currentTarget && !purchaseSuccess) setShowCheckout(false); }}
          >
            <div className="w-full max-w-md border-4 border-double border-vintage bg-card p-6 shadow-stack animate-scale-up">

              {purchaseSuccess ? (
                /* Success state */
                <div className="py-6 text-center space-y-4 animate-fade-up">
                  <div className="border-4 border-double border-vintage p-6 inline-block animate-stamp">
                    <ShieldCheck className="h-12 w-12 text-vintage mx-auto" />
                  </div>
                  <div className="newspaper-divider" />
                  <h3 className="font-serif text-xl font-extrabold uppercase text-vintage">Order Authorized!</h3>
                  <p className="font-serif text-xs text-ink/70">
                    ৳{book.price} {paymentMethod === "bkash" ? `charged via bKash (${bkashNumber})` : "deducted from balance"}. Redirecting to orders…
                  </p>
                </div>
              ) : isProcessing ? (
                /* Processing state */
                <div className="py-8 flex flex-col items-center gap-4 animate-fade-in">
                  <div className="relative">
                    <div className="h-12 w-12 border-4 border-vintage/20 border-t-vintage rounded-full animate-spin" />
                    {paymentMethod === "bkash" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-bold text-[#e2136e] text-xs">b</span>
                      </div>
                    )}
                  </div>
                  <p className="font-serif text-xs font-bold uppercase tracking-wider text-ink/70">
                    {paymentMethod === "bkash" ? "Processing bKash Payment…" : "Authorizing Order…"}
                  </p>
                </div>
              ) : (
                /* Checkout form */
                <>
                  <div className="flex items-center justify-between border-b border-vintage pb-3">
                    <h3 className="font-serif text-lg font-extrabold uppercase tracking-tight text-ink">
                      Order Authorization
                    </h3>
                    <button
                      onClick={() => setShowCheckout(false)}
                      className="text-ink/50 hover:text-ink transition-colors text-xl leading-none"
                    >
                      ×
                    </button>
                  </div>

                  <div className="mt-4 space-y-5 font-serif">
                    {/* Book summary */}
                    <div className="border border-vintage p-3 bg-paper flex gap-3">
                      <div
                        className="h-14 w-10 flex-shrink-0 border border-vintage flex items-center justify-center"
                        style={{ background: book.coverColor ?? "linear-gradient(135deg, #e5e2da, #f6f4f0)" }}
                      >
                        <span className="font-serif text-[7px] font-bold uppercase text-ink/40 text-center px-0.5 leading-tight">{book.title}</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase text-ink line-clamp-2">{book.title}</p>
                        <p className="text-[10px] italic text-ink/60">By {book.author}</p>
                        <p className="text-xs font-bold text-vintage mt-1">৳{book.price}</p>
                      </div>
                    </div>

                    {/* Payment method selector */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-ink/60">Payment Method</p>

                      {/* Wallet */}
                      <button
                        onClick={() => setPaymentMethod("balance")}
                        className={cn(
                          "w-full flex items-center gap-3 border-2 p-3 text-left transition-all duration-200",
                          paymentMethod === "balance" ? "border-vintage bg-vintage/5" : "border-vintage/30 hover:border-vintage/60"
                        )}
                      >
                        <Wallet className={cn("h-4 w-4", paymentMethod === "balance" ? "text-vintage" : "text-ink/50")} />
                        <div className="flex-1">
                          <span className="text-xs font-bold uppercase text-ink block">Wallet Balance</span>
                          <span className="text-[10px] text-ink/50">৳{currentUser?.balance ?? 0} available</span>
                        </div>
                        <div className={cn("h-3.5 w-3.5 rounded-full border-2 transition-all", paymentMethod === "balance" ? "border-vintage bg-vintage" : "border-vintage/40")} />
                      </button>

                      {/* bKash */}
                      <button
                        onClick={() => setPaymentMethod("bkash")}
                        className={cn(
                          "w-full flex items-center gap-3 border-2 p-3 text-left transition-all duration-200",
                          paymentMethod === "bkash" ? "border-[#e2136e] bg-[#fce4ef]/20" : "border-vintage/30 hover:border-[#e2136e]/40"
                        )}
                      >
                        <div className="h-4 w-4 rounded-full bg-[#e2136e] flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-[8px]">b</span>
                        </div>
                        <div className="flex-1">
                          <span className="text-xs font-bold uppercase block" style={{ color: paymentMethod === "bkash" ? "#e2136e" : "inherit" }}>
                            bKash
                          </span>
                          <span className="text-[10px] text-ink/50">Mobile banking</span>
                        </div>
                        <div className={cn("h-3.5 w-3.5 rounded-full border-2 transition-all", paymentMethod === "bkash" ? "border-[#e2136e] bg-[#e2136e]" : "border-vintage/40")} />
                      </button>
                    </div>

                    {/* bKash input */}
                    {paymentMethod === "bkash" && (
                      <div className="space-y-2 border border-dashed border-[#e2136e]/40 bg-[#fce4ef]/10 p-3 animate-fade-up">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-ink">
                          bKash Number
                        </label>
                        <input
                          type="tel"
                          value={bkashNumber}
                          onChange={(e) => setBkashNumber(e.target.value.replace(/\D/g, "").slice(0, 11))}
                          placeholder="01XXXXXXXXX"
                          className="w-full border-2 border-[#e2136e]/30 bg-white p-2.5 font-mono text-sm tracking-widest focus:outline-none focus:border-[#e2136e] transition-colors placeholder:font-sans placeholder:tracking-normal placeholder:text-ink/30"
                        />
                      </div>
                    )}

                    {/* Price summary */}
                    <div className="border border-dashed border-vintage p-3 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Listed Price:</span>
                        <strong>৳{book.price}</strong>
                      </div>
                      <div className="flex justify-between border-t border-dashed border-vintage pt-1 mt-1 font-bold text-sm">
                        <span>Total Debit:</span>
                        <strong className="text-vintage">৳{book.price}</strong>
                      </div>
                    </div>

                    {/* Error */}
                    {purchaseError && (
                      <div className="flex items-start gap-2 border border-dashed border-vintage bg-beige/30 p-2 animate-fade-in">
                        <AlertCircle className="h-3.5 w-3.5 text-vintage flex-shrink-0 mt-0.5" />
                        <p className="text-[10px] font-bold uppercase text-vintage">{purchaseError}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 justify-end border-t border-dashed border-vintage pt-4">
                      <button
                        onClick={() => { setShowCheckout(false); setPurchaseError(""); }}
                        className="text-xs font-bold uppercase text-ink/60 hover:underline"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleBuy}
                        className={cn(
                          "border-2 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 active:scale-95",
                          paymentMethod === "bkash"
                            ? "border-[#e2136e] bg-[#e2136e] text-white hover:bg-[#c01060]"
                            : "border-vintage bg-vintage text-paper hover:bg-paper hover:text-vintage"
                        )}
                      >
                        <ShieldCheck className="h-3.5 w-3.5" />
                        {paymentMethod === "bkash" ? "Pay via bKash" : "Confirm Order"}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
