"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart, Trash2, ArrowLeft, ArrowRight, ShieldCheck,
  Smartphone, Wallet, CheckCircle2, X, AlertCircle, Package
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useApp } from "@/lib/context/AppContext";
import { cn } from "@/lib/utils";
import Link from "next/link";

type PaymentMethod = "balance" | "bkash";
type CheckoutStep = "cart" | "payment" | "confirm" | "success";

export default function CartPage() {
  const router = useRouter();
  const {
    currentUser,
    cart,
    cartLoading,
    cartError,
    refreshCart,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount,
    placeCartOrder,
  } = useApp();

  const [step, setStep] = useState<CheckoutStep>("cart");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("balance");
  const [bkashNumber, setBkashNumber] = useState("");
  const [bkashOtp, setBkashOtp] = useState("");
  const [bkashPin, setBkashPin] = useState("");
  const [error, setError] = useState("");
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState<{ count: number; total: number } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleRemove = (bookId: string) => {
    setError("");
    setRemovingIds((prev) => new Set([...prev, bookId]));
    setTimeout(async () => {
      const result = await removeFromCart(bookId);
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(bookId);
        return next;
      });
      if (!result.success) {
        setError(result.error || "Could not remove this cart item.");
      }
    }, 320);
  };

  const handleClearCart = async () => {
    setError("");
    const result = await clearCart();
    if (!result.success) {
      setError(result.error || "Could not clear your cart.");
    }
  };

  const handleProceedToPayment = () => {
    if (!currentUser) {
      router.push("/login");
      return;
    }
    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    setError("");
    setStep("payment");
  };

  const handleProceedToConfirm = () => {
    setError("");
    if (paymentMethod === "bkash") {
      if (!bkashNumber || bkashNumber.replace(/\D/g, "").length < 11) {
        setError("Please enter a valid 11-digit bKash number.");
        return;
      }
    }
    if (paymentMethod === "balance" && currentUser && currentUser.balance < cartTotal && currentUser.role !== "admin") {
      setError(`Insufficient wallet balance. You have ৳${currentUser.balance}, cart total is ৳${cartTotal}.`);
      return;
    }
    setStep("confirm");
  };

  const handlePlaceOrder = async () => {
    setError("");
    setIsProcessing(true);
    const receiptDraft = { count: cartCount, total: cartTotal };
    const delay = paymentMethod === "bkash" ? 1500 : 400;
    setTimeout(async () => {
      const res = await placeCartOrder(
        paymentMethod,
        paymentMethod === "bkash" ? bkashNumber : undefined
      );
      setIsProcessing(false);
      if (res.success) {
        setReceipt({
          count: res.count ?? receiptDraft.count,
          total: res.total ?? receiptDraft.total,
        });
        setStep("success");
      } else {
        setError(res.error || "Order failed. Please try again.");
        setStep("payment");
      }
    }, delay);
  };

  // ─── Step: Cart ────────────────────────────────────────────────────────────
  const renderCart = () => (
    <div className="animate-fade-up">
      {!currentUser ? (
        <div className="py-24 text-center space-y-6 animate-fade-up">
          <div className="relative inline-block animate-float">
            <ShoppingCart className="h-16 w-16 text-vintage/30 mx-auto" strokeWidth={1} />
          </div>
          <div className="newspaper-divider max-w-xs mx-auto" />
          <h2 className="font-serif text-2xl font-extrabold uppercase text-ink tracking-tight">
            Sign In Required
          </h2>
          <p className="font-serif text-sm italic text-ink/60">
            Please sign in to view your saved cart ledger.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 border-2 border-vintage bg-vintage text-paper px-6 py-2.5 font-serif text-xs font-bold uppercase tracking-wider hover:bg-paper hover:text-vintage transition-all duration-200"
          >
            Sign In
          </Link>
        </div>
      ) : cartLoading ? (
        <div className="py-24 text-center space-y-6 animate-pulse">
          <ShoppingCart className="h-16 w-16 text-vintage/30 mx-auto" strokeWidth={1} />
          <div className="newspaper-divider max-w-xs mx-auto" />
          <h2 className="font-serif text-2xl font-extrabold uppercase text-ink tracking-tight">
            Loading Cart
          </h2>
          <p className="font-serif text-sm italic text-ink/60">
            Reading your cart ledger from the database.
          </p>
        </div>
      ) : cartError ? (
        <div className="py-24 text-center space-y-6 animate-fade-up">
          <AlertCircle className="h-16 w-16 text-vintage/40 mx-auto" strokeWidth={1} />
          <div className="newspaper-divider max-w-xs mx-auto" />
          <h2 className="font-serif text-2xl font-extrabold uppercase text-ink tracking-tight">
            Cart Unavailable
          </h2>
          <p className="font-serif text-sm italic text-ink/60">{cartError}</p>
          <button
            onClick={() => refreshCart()}
            className="inline-flex items-center gap-2 border-2 border-vintage bg-vintage text-paper px-6 py-2.5 font-serif text-xs font-bold uppercase tracking-wider hover:bg-paper hover:text-vintage transition-all duration-200"
          >
            Retry
          </button>
        </div>
      ) : cart.length === 0 ? (
        <div className="py-24 text-center space-y-6 animate-fade-up">
          <div className="relative inline-block animate-float">
            <ShoppingCart className="h-16 w-16 text-vintage/30 mx-auto" strokeWidth={1} />
          </div>
          <div className="newspaper-divider max-w-xs mx-auto" />
          <h2 className="font-serif text-2xl font-extrabold uppercase text-ink tracking-tight">
            Cart Empty
          </h2>
          <p className="font-serif text-sm italic text-ink/60">
            No classified items added to your shopping ledger yet.
          </p>
          <Link
            href="/home"
            className="inline-flex items-center gap-2 border-2 border-vintage bg-vintage text-paper px-6 py-2.5 font-serif text-xs font-bold uppercase tracking-wider hover:bg-paper hover:text-vintage transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4" /> Browse Listings
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Items list */}
          <div className="space-y-0 border border-vintage overflow-hidden">
            <div className="bg-beige/40 border-b border-vintage px-4 py-3 flex items-center justify-between">
              <h2 className="font-serif text-xs font-bold uppercase tracking-[0.2em] text-vintage">
                {cartCount} Item{cartCount !== 1 ? "s" : ""} in Your Cart
              </h2>
              <button
                onClick={handleClearCart}
                className="font-serif text-[10px] font-bold uppercase tracking-wider text-ink/50 hover:text-vintage hover:underline transition-colors flex items-center gap-1"
              >
                <X className="h-3 w-3" /> Clear All
              </button>
            </div>

            {cart.map((item, idx) => (
              <div
                key={item.bookId}
                className={cn(
                  "flex items-center gap-4 border-b border-vintage/40 px-4 py-4 transition-all duration-300",
                  "hover:bg-beige/20 animate-stagger-in",
                  removingIds.has(item.bookId) && "cart-removing pointer-events-none"
                )}
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                {/* Mini cover */}
                <div
                  className="h-16 w-12 flex-shrink-0 border border-vintage flex items-center justify-center transition-transform duration-200 hover:scale-105"
                  style={{ background: item.coverColor ?? "linear-gradient(135deg, #e5e2da, #f6f4f0)" }}
                >
                  <span className="font-serif text-[8px] font-bold uppercase text-ink/40 text-center px-1 leading-tight line-clamp-3">
                    {item.bookTitle}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-sm font-bold uppercase text-ink tracking-tight line-clamp-1">
                    {item.bookTitle}
                  </h3>
                  <p className="font-serif text-xs italic text-ink/60 line-clamp-1">
                    By {item.bookAuthor}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-serif text-[10px] font-bold uppercase tracking-wider text-ink/50 border border-vintage/30 px-1 bg-beige/30">
                      {item.condition}
                    </span>
                    <span className="font-serif text-[10px] text-ink/50 italic">via {item.sellerName}</span>
                  </div>
                </div>

                {/* Price + Remove */}
                <div className="flex flex-col items-end gap-2">
                  <span className="border-2 border-vintage bg-card px-2 py-0.5 font-serif text-sm font-bold text-vintage">
                    ৳{item.price}
                  </span>
                  <button
                    onClick={() => handleRemove(item.bookId)}
                    className="font-serif text-[10px] font-bold uppercase text-ink/40 hover:text-vintage hover:underline transition-colors flex items-center gap-0.5"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-3 w-3" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-4 h-fit">
            <div className="border-4 border-double border-vintage p-5 space-y-4 animate-fade-up delay-200">
              <h3 className="font-serif text-sm font-bold uppercase tracking-[0.2em] text-vintage border-b border-vintage pb-2">
                Order Summary
              </h3>

              <div className="space-y-2 font-serif text-xs">
                {cart.map((item) => (
                  <div key={item.bookId} className="flex justify-between text-ink/70">
                    <span className="truncate max-w-[160px]">{item.bookTitle}</span>
                    <span className="font-bold">৳{item.price}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-vintage pt-3">
                <div className="flex justify-between font-serif text-sm font-bold uppercase text-ink">
                  <span>Total</span>
                  <span className="text-vintage text-base">৳{cartTotal}</span>
                </div>
                {currentUser && (
                  <div className="flex justify-between font-serif text-[10px] text-ink/50 mt-1">
                    <span>Wallet Balance</span>
                    <span>৳{currentUser.balance}</span>
                  </div>
                )}
              </div>

              {error && (
                <div className="flex items-start gap-2 border border-dashed border-vintage bg-beige/30 p-2 animate-fade-in">
                  <AlertCircle className="h-3.5 w-3.5 text-vintage flex-shrink-0 mt-0.5" />
                  <p className="font-serif text-[10px] font-bold uppercase text-vintage">{error}</p>
                </div>
              )}

              <button
                onClick={handleProceedToPayment}
                className="w-full border-2 border-vintage bg-vintage text-paper py-3 font-serif text-xs font-bold uppercase tracking-wider hover:bg-paper hover:text-vintage transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
              >
                Proceed to Payment <ArrowRight className="h-4 w-4" />
              </button>

              <Link
                href="/home"
                className="block text-center font-serif text-[10px] font-bold uppercase tracking-wider text-ink/50 hover:underline hover:text-ink transition-colors"
              >
                ← Continue Browsing
              </Link>
            </div>

            {/* Security note */}
            <div className="border border-dashed border-vintage/40 p-3 flex items-start gap-2 bg-beige/10">
              <ShieldCheck className="h-4 w-4 text-vintage/50 flex-shrink-0 mt-0.5" />
              <p className="font-serif text-[9px] text-ink/50 leading-relaxed uppercase tracking-wider">
                All transactions are handled securely within the BookBazar campus marketplace. Physical handoff required on campus.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ─── Step: Payment ──────────────────────────────────────────────────────────
  const renderPayment = () => (
    <div className="max-w-lg mx-auto animate-fade-up">
      <button
        onClick={() => { setStep("cart"); setError(""); }}
        className="mb-6 flex items-center gap-1 font-serif text-xs font-bold uppercase tracking-wider text-ink/70 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Cart
      </button>

      <div className="border-4 border-double border-vintage p-6 space-y-6">
        <div>
          <h2 className="font-serif text-xl font-extrabold uppercase tracking-tight text-ink border-b border-vintage pb-2">
            Select Payment Method
          </h2>
          <p className="font-serif text-xs italic text-ink/60 mt-1">
            Choose how you'd like to settle your order of ৳{cartTotal}
          </p>
        </div>

        {/* Payment options */}
        <div className="space-y-3">
          {/* Wallet/Balance */}
          <button
            onClick={() => setPaymentMethod("balance")}
            className={cn(
              "w-full flex items-center gap-4 border-2 p-4 text-left transition-all duration-200",
              "hover:border-vintage",
              paymentMethod === "balance"
                ? "border-vintage bg-vintage/5 shadow-stack"
                : "border-vintage/30 bg-paper"
            )}
          >
            <div className={cn(
              "flex h-10 w-10 flex-shrink-0 items-center justify-center border-2 transition-all",
              paymentMethod === "balance" ? "border-vintage bg-vintage text-paper" : "border-vintage/40 bg-paper text-ink"
            )}>
              <Wallet className="h-5 w-5" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <span className="font-serif text-sm font-bold uppercase tracking-wider text-ink block">
                Wallet Balance
              </span>
              <span className="font-serif text-xs text-ink/60">
                Available: ৳{currentUser?.balance ?? 0}
              </span>
            </div>
            <div className={cn(
              "h-4 w-4 rounded-full border-2 transition-all",
              paymentMethod === "balance" ? "border-vintage bg-vintage" : "border-vintage/40"
            )} />
          </button>

          {/* bKash */}
          <button
            onClick={() => setPaymentMethod("bkash")}
            className={cn(
              "w-full flex items-center gap-4 border-2 p-4 text-left transition-all duration-200",
              paymentMethod === "bkash"
                ? "border-[#e2136e] bg-[#fce4ef]/30 shadow-stack"
                : "border-vintage/30 bg-paper hover:border-[#e2136e]/40"
            )}
          >
            <div className={cn(
              "flex h-10 w-10 flex-shrink-0 items-center justify-center border-2 transition-all",
              paymentMethod === "bkash"
                ? "border-[#e2136e] bg-[#e2136e] text-white"
                : "border-vintage/40 bg-paper text-ink"
            )}>
              <Smartphone className="h-5 w-5" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <span className="font-serif text-sm font-bold uppercase tracking-wider block" style={{ color: paymentMethod === "bkash" ? "#e2136e" : "inherit" }}>
                bKash Mobile Banking
              </span>
              <span className="font-serif text-xs text-ink/60">
                Pay instantly via your bKash wallet
              </span>
            </div>
            <div className={cn(
              "h-4 w-4 rounded-full border-2 transition-all",
              paymentMethod === "bkash" ? "bg-[#e2136e] border-[#e2136e]" : "border-vintage/40"
            )} />
          </button>
        </div>

        {/* bKash number input */}
        {paymentMethod === "bkash" && (
          <div className="space-y-4 border border-dashed border-[#e2136e]/50 bg-[#fce4ef]/20 p-4 animate-fade-up">
            <div className="flex items-center gap-2">
              {/* bKash logo text */}
              <div className="flex items-center gap-1">
                <div className="h-7 w-7 rounded-full bg-[#e2136e] flex items-center justify-center">
                  <span className="text-white font-bold text-[10px]">b</span>
                </div>
                <span className="font-bold text-sm tracking-wide" style={{ color: "#e2136e" }}>bKash</span>
              </div>
              <span className="font-serif text-[10px] uppercase tracking-wider text-ink/50">Secure Payment</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-serif text-[10px] font-bold uppercase tracking-wider text-ink mb-1.5">
                  bKash Account Number
                </label>
                <input
                  type="tel"
                  value={bkashNumber}
                  onChange={(e) => setBkashNumber(e.target.value.replace(/\D/g, "").slice(0, 11))}
                  placeholder="01XXXXXXXXX"
                  className="w-full border-2 border-[#e2136e]/30 bg-white p-3 font-mono text-sm text-ink tracking-widest focus:outline-none focus:border-[#e2136e] transition-colors placeholder:font-sans placeholder:text-ink/30 placeholder:tracking-normal"
                />
                <p className="mt-1 font-serif text-[9px] text-ink/40 uppercase tracking-wider">
                  Enter your registered bKash mobile number
                </p>
              </div>
            </div>

            <div className="bg-[#e2136e]/5 border border-[#e2136e]/20 p-3 rounded-none">
              <p className="font-serif text-[9px] text-ink/60 uppercase tracking-wider leading-relaxed">
                ⚡ After order confirmation, you will receive a payment prompt on your bKash app. 
                Please approve within 2 minutes to complete the transaction.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 border border-dashed border-vintage bg-beige/30 p-3 animate-fade-in">
            <AlertCircle className="h-3.5 w-3.5 text-vintage flex-shrink-0 mt-0.5" />
            <p className="font-serif text-[10px] font-bold uppercase text-vintage">{error}</p>
          </div>
        )}

        <button
          onClick={handleProceedToConfirm}
          className={cn(
            "w-full border-2 py-3 font-serif text-xs font-bold uppercase tracking-wider",
            "transition-all duration-200 flex items-center justify-center gap-2 active:scale-95",
            paymentMethod === "bkash"
              ? "border-[#e2136e] bg-[#e2136e] text-white hover:bg-[#c01060]"
              : "border-vintage bg-vintage text-paper hover:bg-paper hover:text-vintage"
          )}
        >
          Review Order <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  // ─── Step: Confirm ──────────────────────────────────────────────────────────
  const renderConfirm = () => (
    <div className="max-w-lg mx-auto animate-scale-up">
      <button
        onClick={() => { setStep("payment"); setError(""); }}
        className="mb-6 flex items-center gap-1 font-serif text-xs font-bold uppercase tracking-wider text-ink/70 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Payment
      </button>

      <div className="border-4 border-double border-vintage p-6 space-y-6">
        <h2 className="font-serif text-xl font-extrabold uppercase tracking-tight text-ink border-b border-vintage pb-2">
          Order Authorization
        </h2>

        {/* Items summary */}
        <div className="border border-vintage divide-y divide-vintage/30">
          {cart.map((item) => (
            <div key={item.bookId} className="flex justify-between items-center px-4 py-2 font-serif text-xs">
              <span className="uppercase font-bold text-ink line-clamp-1 max-w-[200px]">{item.bookTitle}</span>
              <span className="font-bold text-vintage">৳{item.price}</span>
            </div>
          ))}
          <div className="flex justify-between items-center px-4 py-3 font-serif text-sm font-bold uppercase bg-beige/20">
            <span>Grand Total</span>
            <span className="text-vintage text-base">৳{cartTotal}</span>
          </div>
        </div>

        {/* Payment info */}
        <div className="border border-dashed border-vintage p-4 space-y-2 font-serif text-xs">
          <div className="flex justify-between">
            <span className="text-ink/60 uppercase tracking-wider">Payment Method</span>
            <span className="font-bold uppercase" style={{ color: paymentMethod === "bkash" ? "#e2136e" : "inherit" }}>
              {paymentMethod === "bkash" ? "bKash" : "Wallet Balance"}
            </span>
          </div>
          {paymentMethod === "bkash" && (
            <div className="flex justify-between">
              <span className="text-ink/60 uppercase tracking-wider">bKash Number</span>
              <span className="font-mono font-bold">{bkashNumber}</span>
            </div>
          )}
          {paymentMethod === "balance" && (
            <div className="flex justify-between">
              <span className="text-ink/60 uppercase tracking-wider">Balance After</span>
              <span className="font-bold">৳{(currentUser?.balance ?? 0) - cartTotal}</span>
            </div>
          )}
        </div>

        {/* Processing overlay or confirm */}
        {isProcessing ? (
          <div className="flex flex-col items-center gap-4 py-6 animate-fade-in">
            <div className="relative">
              <div className="h-12 w-12 border-4 border-vintage/20 border-t-vintage rounded-full animate-spin" />
              {paymentMethod === "bkash" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[#e2136e] font-bold text-xs">b</span>
                </div>
              )}
            </div>
            <p className="font-serif text-xs font-bold uppercase tracking-wider text-ink/70">
              {paymentMethod === "bkash" ? "Processing bKash payment..." : "Authorizing order..."}
            </p>
          </div>
        ) : (
          <>
            {error && (
              <div className="flex items-start gap-2 border border-dashed border-vintage bg-beige/30 p-3 animate-fade-in">
                <AlertCircle className="h-3.5 w-3.5 text-vintage flex-shrink-0 mt-0.5" />
                <p className="font-serif text-[10px] font-bold uppercase text-vintage">{error}</p>
              </div>
            )}
            <button
              onClick={handlePlaceOrder}
              className={cn(
                "w-full border-2 py-3 font-serif text-sm font-bold uppercase tracking-wider",
                "transition-all duration-200 flex items-center justify-center gap-2 active:scale-95",
                paymentMethod === "bkash"
                  ? "border-[#e2136e] bg-[#e2136e] text-white hover:bg-[#c01060]"
                  : "border-vintage bg-vintage text-paper hover:bg-paper hover:text-vintage"
              )}
            >
              <ShieldCheck className="h-4 w-4" />
              {paymentMethod === "bkash" ? "Confirm & Pay via bKash" : "Confirm Order"}
            </button>
          </>
        )}
      </div>
    </div>
  );

  // ─── Step: Success ──────────────────────────────────────────────────────────
  const renderSuccess = () => (
    <div className="max-w-lg mx-auto py-8 text-center space-y-8 animate-fade-up">
      {/* Stamp */}
      <div className="relative inline-block">
        <div className="border-4 border-double border-vintage p-8 bg-paper animate-stamp">
          <CheckCircle2 className="h-16 w-16 text-vintage mx-auto" strokeWidth={1.5} />
        </div>
        {/* Ink bleed effect */}
        <div className="absolute -inset-2 border border-vintage/20 animate-pulse" />
      </div>

      <div className="space-y-2">
        <div className="newspaper-divider max-w-xs mx-auto" />
        <h2 className="font-serif text-3xl font-extrabold uppercase tracking-tight text-ink animate-ink-press">
          Order Confirmed!
        </h2>
        <div className="newspaper-divider max-w-xs mx-auto" />
      </div>

      <div className="border border-vintage p-5 text-left space-y-3 animate-fade-up delay-300">
        <p className="font-serif text-xs font-bold uppercase tracking-[0.2em] text-ink/50 text-center border-b border-dashed border-vintage pb-2">
          Transaction Receipt
        </p>
        <div className="space-y-2 font-serif text-xs">
          <div className="flex justify-between">
            <span className="text-ink/60 uppercase tracking-wider">Items Purchased</span>
            <span className="font-bold">{receipt?.count ?? cartCount} Books</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink/60 uppercase tracking-wider">Amount Paid</span>
            <span className="font-bold text-vintage">৳{receipt?.total ?? cartTotal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink/60 uppercase tracking-wider">Payment Via</span>
            <span className="font-bold" style={{ color: paymentMethod === "bkash" ? "#e2136e" : "inherit" }}>
              {paymentMethod === "bkash" ? `bKash (${bkashNumber})` : "Wallet Balance"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink/60 uppercase tracking-wider">Status</span>
            <span className="font-bold text-vintage uppercase">Pending Handoff</span>
          </div>
        </div>
      </div>

      <p className="font-serif text-xs italic text-ink/60 max-w-sm mx-auto leading-relaxed animate-fade-up delay-400">
        Your order has been placed. Arrange a campus meetup with the seller(s) to complete the physical handoff.
      </p>

      <div className="flex gap-3 justify-center animate-fade-up delay-500">
        <Link
          href="/orders"
          className="border-2 border-vintage bg-vintage text-paper px-6 py-2.5 font-serif text-xs font-bold uppercase tracking-wider hover:bg-paper hover:text-vintage transition-all duration-200 flex items-center gap-2"
        >
          <Package className="h-4 w-4" /> View Orders
        </Link>
        <Link
          href="/home"
          className="border-2 border-vintage px-6 py-2.5 font-serif text-xs font-bold uppercase tracking-wider hover:bg-beige transition-all duration-200"
        >
          Browse More
        </Link>
      </div>
    </div>
  );

  // Progress steps bar
  const steps: { key: CheckoutStep; label: string }[] = [
    { key: "cart", label: "Cart" },
    { key: "payment", label: "Payment" },
    { key: "confirm", label: "Review" },
    { key: "success", label: "Done" },
  ];
  const currentStepIdx = steps.findIndex((s) => s.key === step);

  return (
    <main className="min-h-screen bg-paper flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Section header */}
        <section className="border-b border-vintage bg-beige/20 py-6">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-7 w-7 text-vintage" strokeWidth={1.5} />
              <div>
                <h1 className="font-serif text-2xl font-extrabold uppercase tracking-tight text-ink">
                  Shopping Cart
                </h1>
                <p className="font-serif text-xs italic text-ink/60">
                  Classified book acquisition ledger
                </p>
              </div>
            </div>

            {/* Progress stepper */}
            {step !== "success" && (
              <div className="mt-5 flex items-center gap-0">
                {steps.slice(0, -1).map((s, idx) => (
                  <div key={s.key} className="flex items-center">
                    <div
                      className={cn(
                        "flex h-7 w-7 items-center justify-center border-2 font-serif text-[10px] font-bold uppercase transition-all duration-300",
                        idx < currentStepIdx
                          ? "border-vintage bg-vintage text-paper"
                          : idx === currentStepIdx
                          ? "border-vintage bg-paper text-vintage scale-110 shadow-stack"
                          : "border-vintage/30 bg-paper text-ink/30"
                      )}
                    >
                      {idx < currentStepIdx ? <CheckCircle2 className="h-3.5 w-3.5" /> : idx + 1}
                    </div>
                    <span
                      className={cn(
                        "mx-2 font-serif text-[10px] font-bold uppercase tracking-wider transition-colors",
                        idx === currentStepIdx ? "text-ink" : "text-ink/40"
                      )}
                    >
                      {s.label}
                    </span>
                    {idx < steps.length - 2 && (
                      <div className={cn(
                        "h-px w-10 transition-all duration-500",
                        idx < currentStepIdx ? "bg-vintage" : "bg-vintage/20"
                      )} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-8 md:px-8">
          {step === "cart" && renderCart()}
          {step === "payment" && renderPayment()}
          {step === "confirm" && renderConfirm()}
          {step === "success" && renderSuccess()}
        </section>
      </div>
      <Footer />
    </main>
  );
}
