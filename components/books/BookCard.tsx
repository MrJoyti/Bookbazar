"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { Heart, Star, ShoppingCart, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp, Book } from "@/lib/context/AppContext";

/**
 * BookCard — 90s newspaper classified ad with Add to Cart + smooth animations
 */
export default function BookCard({ book }: { book: Book }) {
  const { wishlist, toggleWishlist, addToCart, cart } = useApp();
  const wishlisted = wishlist.includes(book.id);
  const inCart = cart.some((c) => c.bookId === book.id);

  const [cartAnim, setCartAnim] = useState<"idle" | "adding" | "done" | "error">("idle");
  const [cartMsg, setCartMsg] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartAnim !== "idle") return;

    setCartAnim("adding");
    const res = await addToCart(book);
    if (res.success) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setCartAnim("done");
        timeoutRef.current = setTimeout(() => setCartAnim("idle"), 2000);
      }, 450);
    } else {
      setCartAnim("error");
      setCartMsg(res.error || "Error");
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setCartAnim("idle");
        setCartMsg("");
      }, 2200);
    }
  };

  return (
    <div
      className={cn(
        "group relative w-full max-w-[210px] rounded-[2px] border border-gold/30 bg-card p-3",
        "shadow-stack transition-all duration-300 ease-out",
        "hover:-translate-y-1.5 hover:shadow-lift",
        "animate-fade-up"
      )}
    >
      {/* Decorative metal corner brackets */}
      <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gold/40 rounded-tl-[1px]" />
      <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-gold/40 rounded-tr-[1px]" />
      <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-gold/40 rounded-bl-[1px]" />
      <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gold/40 rounded-br-[1px]" />

      {/* Wishlist button */}
      <button
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(book.id);
        }}
        className="absolute right-3.5 top-3.5 z-20 rounded-[2px] border border-gold/50 bg-card p-1.5 shadow-sm hover:bg-beige/40 transition-colors duration-200"
      >
        <Heart
          className={cn(
            "h-3.5 w-3.5 transition-all duration-300",
            wishlisted ? "fill-vintage text-vintage scale-110" : "text-ink/65"
          )}
          strokeWidth={2}
        />
      </button>

      <Link href={`/books/${book.id}`} className="block">
        {/* 3D Book Container */}
        <div className="relative h-44 w-full flex items-center justify-center p-2 mb-2" style={{ perspective: 1000 }}>
          <div className="relative h-full w-[125px] transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(-12deg)_rotateX(4deg)]">
            
            {/* Layered Pages (under the cover on the right edge) */}
            <div className="absolute inset-y-1 right-[-4px] w-2 bg-[#FAF5ED] border-y border-r border-ink/20 rounded-r-[2px] shadow-sm flex flex-col justify-between py-2 [transform:translateZ(-2px)]">
              <div className="w-full h-full border-r border-dashed border-ink/10" />
            </div>

            {/* Book Spine (left edge) */}
            <div className="absolute top-0 left-[-6px] w-3 h-full bg-walnut border-y border-l border-ink/40 shadow-inner rounded-l-[2px] origin-right [transform:rotateY(-90deg)_translateZ(6px)] flex flex-col justify-between py-4">
              <div className="w-full h-[1px] bg-gold/30" />
              <div className="w-full h-[1px] bg-gold/30" />
              <div className="w-full h-[1px] bg-gold/30" />
            </div>

            {/* The Front Cover */}
            <div
              className="absolute inset-0 origin-left flex flex-col items-center justify-between rounded-r-[3px] border-y border-r border-ink/30 p-2.5 overflow-hidden transition-transform duration-500 [transform-style:preserve-3d] [transform-origin:left_center] group-hover:[transform:rotateY(-24deg)] shadow-[3px_5px_12px_rgba(43,33,24,0.3)]"
              style={{ 
                background: book.coverColor ?? "linear-gradient(135deg, var(--beige), var(--paper))",
                backfaceVisibility: "hidden"
              }}
            >
              {/* Cover layout: gold foil borders */}
              <div className="absolute inset-1 border border-gold/40 rounded-[2px] pointer-events-none" />
              <div className="absolute inset-1.5 border border-dashed border-gold/20 rounded-[2px] pointer-events-none" />

              <div className="w-full text-left font-serif text-[7.5px] font-bold uppercase tracking-wider text-card/70 z-10">
                {book.category}
              </div>
              <span className="px-1 text-center font-serif text-[11px] font-bold leading-tight tracking-tight text-card uppercase line-clamp-3 z-10 shadow-sm drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.6)]">
                {book.title}
              </span>
              <div className="w-full text-right font-serif text-[7.5px] italic text-card/80 z-10">
                {book.university}
              </div>
            </div>

            {/* The Bookmark Ribbon hanging out from bottom */}
            <div 
              className="absolute bottom-[-16px] right-3 w-2.5 h-6 bg-mutedRed transition-transform duration-500 origin-top group-hover:translate-y-1 group-hover:rotate-6 shadow-md z-0" 
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)" }} 
            />
          </div>
        </div>

        {/* Info */}
        <div className="mt-2.5">
          <h3 className="truncate font-serif text-[15px] font-bold text-ink uppercase tracking-tight group-hover:underline transition-all">
            {book.title}
          </h3>
          <p className="truncate font-serif text-xs italic text-ink/75">
            By {book.author}
            {book.edition ? ` · ${book.edition}` : ""}
          </p>

          <div className="mt-2 flex items-center justify-between border-t border-dashed border-gold/30 pt-2">
            <span className="border border-gold bg-[#FAF5ED] px-2 py-0.5 font-serif text-xs font-bold text-vintage shadow-sm rounded-[1px]">
              ৳{book.price}
            </span>
            <span className="font-serif text-[9px] font-bold uppercase tracking-wider text-ink border border-gold/30 px-1.5 py-0.5 bg-beige/35 rounded-[1px]">
              {book.condition}
            </span>
          </div>

          {book.rating && (
            <div className="mt-2 flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn("h-3 w-3 transition-all", i < book.rating! ? "fill-gold text-gold" : "text-ink/15")}
                  strokeWidth={2}
                />
              ))}
            </div>
          )}
        </div>
      </Link>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={inCart || cartAnim === "adding"}
        className={cn(
          "relative mt-3.5 w-full overflow-hidden border py-1.5 font-serif text-[10px] font-bold uppercase tracking-wider rounded-[2px]",
          "transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm active:translate-y-[1px]",
          inCart || cartAnim === "done"
            ? "border-vintage bg-vintage text-card cursor-default"
            : cartAnim === "error"
            ? "border-gold bg-[#EFE3CF] text-vintage"
            : "border-gold bg-[#FAF5ED] text-vintage hover:bg-vintage hover:text-card active:shadow-inner"
        )}
        aria-label="Add to cart"
      >
        {/* Ink fill animation on click */}
        {cartAnim === "adding" && (
          <span className="absolute inset-0 bg-vintage animate-ink-press" />
        )}
        <span className="relative z-10 flex items-center gap-1">
          {inCart || cartAnim === "done" ? (
            <><Check className="h-3 w-3" strokeWidth={3} /> In Cart</>
          ) : cartAnim === "error" ? (
            <><AlertCircle className="h-3 w-3" /> {cartMsg.slice(0, 20)}</>
          ) : (
            <><ShoppingCart className="h-3 w-3" /> Add to Cart</>
          )}
        </span>
      </button>
    </div>
  );
}
