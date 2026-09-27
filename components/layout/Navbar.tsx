"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Heart, Bell, User, Menu, X, BookOpen, MessageSquare, ShieldAlert, ShoppingCart } from "lucide-react";
import Button from "@/components/ui/Button";
import { useApp } from "@/lib/context/AppContext";
import { cn } from "@/lib/utils";

const links = [
  { href: "/home", label: "Browse" },
  { href: "/search", label: "Search" },
  { href: "/upload", label: "Sell a Book" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartBump, setCartBump] = useState(false);
  const { currentUser, logout, notifications, markNotificationsRead, cartCount, wishlist } = useApp();

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Bump animation whenever cartCount increases
  const [prevCount, setPrevCount] = useState(cartCount);
  useEffect(() => {
    if (cartCount > prevCount) {
      setCartBump(true);
      const t = setTimeout(() => setCartBump(false), 500);
      return () => clearTimeout(t);
    }
    setPrevCount(cartCount);
  }, [cartCount]);

  const handleNotificationsClick = () => {
    markNotificationsRead();
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="sticky top-0 z-50 border-b-2 border-dashed border-gold bg-walnut shadow-[0_4px_20px_-4px_rgba(59,42,34,0.4)]">
      {/* Date banner — leather bookmark top edge */}
      <div className="border-b border-gold/25 py-1 text-center font-serif text-[10px] uppercase tracking-[0.25em] text-gold/85 bg-vintage/35 animate-flicker">
        Campus Edition · {today} · Volume LVIII No. 12
      </div>

      {/* Hanging bookmark ribbon/tassel */}
      <div className="absolute right-12 top-full h-10 w-4 bg-mutedRed origin-top shadow-[0_4px_8px_rgba(43,33,24,0.3)] flex items-center justify-center pointer-events-none z-[100]" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)" }}>
        <div className="h-full w-[1px] bg-vintage/20" />
      </div>

      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <BookOpen
            className="h-6 w-6 text-gold transition-transform duration-300 group-hover:rotate-12"
            strokeWidth={2}
          />
          <span className="font-serif text-3xl font-bold tracking-tight text-card uppercase hover:text-gold transition-colors duration-250">
            BookBazar
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="relative font-serif text-sm font-bold uppercase tracking-wider text-card/90 transition-colors hover:text-gold after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-gold after:transition-all after:duration-300 hover:after:w-full"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right icons */}
        <div className="hidden items-center gap-4 md:flex">
          {currentUser ? (
            <div className="flex items-center gap-5">
              {/* Balance */}
              <span className="border border-gold px-2 py-0.5 font-serif text-xs font-bold uppercase text-gold transition-all duration-300 hover:bg-gold hover:text-walnut cursor-default rounded-[2px]">
                Bal: ৳{currentUser.balance}
              </span>

              {/* Cart */}
              <Link href="/cart" title="Cart" className="relative">
                <ShoppingCart
                  className={cn(
                    "h-5 w-5 text-card hover:text-gold transition-all duration-200",
                    cartBump && "scale-125 text-gold"
                  )}
                  strokeWidth={2}
                />
                {cartCount > 0 && (
                  <span
                    key={cartCount}
                    className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-walnut animate-badge-pop shadow-md"
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Wishlist */}
              <Link href="/wishlist" title="Wishlist" className="relative">
                <Heart className="h-5 w-5 cursor-pointer text-card hover:text-gold hover:fill-gold transition-all duration-200" strokeWidth={2} />
                {wishlist.length > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-walnut shadow-md">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Messages */}
              <Link href="/messages" title="Messages">
                <MessageSquare className="h-5 w-5 cursor-pointer text-card hover:text-gold hover:fill-gold transition-all duration-200" strokeWidth={2} />
              </Link>

              {/* Notifications */}
              <Link
                href="/notifications"
                title="Notifications"
                onClick={handleNotificationsClick}
                className="relative"
              >
                <Bell className="h-5 w-5 cursor-pointer text-card hover:text-gold transition-all duration-200" strokeWidth={2} />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-mutedRed text-[9px] font-bold text-card pulse-ring shadow-md">
                    {unreadCount}
                  </span>
                )}
              </Link>

              {/* Admin */}
              {currentUser.role === "admin" && (
                <Link
                  href="/admin"
                  title="Admin Control Room"
                  className="flex items-center gap-1 border border-dashed border-gold px-2 py-0.5 text-xs font-bold uppercase text-gold hover:bg-gold hover:text-walnut transition-all duration-200 rounded-[2px]"
                >
                  <ShieldAlert className="h-3 w-3" /> Admin
                </Link>
              )}

              {/* User dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1 font-serif text-sm font-bold uppercase tracking-wider text-card underline hover:text-gold transition-colors"
                >
                  <User className="h-4 w-4 text-gold" strokeWidth={2} />
                  {currentUser.name.split(" ")[0]}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 border border-gold bg-card p-2 shadow-stack animate-scale-up z-50 rounded-[3px]">
                    {[
                      { href: "/profile", label: "My Dashboard" },
                      { href: "/my-listings", label: "My Listings" },
                      { href: "/orders", label: "Orders & Sales" },
                      { href: "/cart", label: "My Cart" },
                      { href: "/settings", label: "Preferences" },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-3 py-1.5 font-serif text-xs font-bold uppercase tracking-wider text-ink hover:bg-beige transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                    <div className="my-1 border-t border-dashed border-vintage" />
                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 font-serif text-xs font-bold uppercase tracking-wider text-vintage hover:bg-vintage hover:text-card transition-all duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="secondary" className="px-4 py-1 border border-gold bg-gold text-walnut font-bold uppercase hover:bg-card hover:text-vintage transition-all duration-200">
                <User className="h-4 w-4" strokeWidth={2} /> Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden transition-transform duration-200 active:scale-90 text-card hover:text-gold"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-gold/20 bg-walnut px-5 py-4 md:hidden animate-slide-left">
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="font-serif text-sm font-bold uppercase tracking-wider text-card hover:text-gold"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            {currentUser && (
              <>
                <Link href="/cart" className="font-serif text-sm font-bold uppercase tracking-wider text-card flex items-center gap-2 hover:text-gold" onClick={() => setOpen(false)}>
                  <ShoppingCart className="h-4 w-4" /> Cart {cartCount > 0 && `(${cartCount})`}
                </Link>
                <Link href="/profile" className="font-serif text-sm font-bold uppercase tracking-wider text-card hover:text-gold" onClick={() => setOpen(false)}>My Dashboard</Link>
                <Link href="/wishlist" className="font-serif text-sm font-bold uppercase tracking-wider text-card hover:text-gold" onClick={() => setOpen(false)}>Wishlist</Link>
                <Link href="/messages" className="font-serif text-sm font-bold uppercase tracking-wider text-card hover:text-gold" onClick={() => setOpen(false)}>Messages</Link>
                {currentUser.role === "admin" && (
                  <Link href="/admin" className="font-serif text-sm font-bold uppercase tracking-wider text-gold hover:text-card" onClick={() => setOpen(false)}>
                    Admin Control Room
                  </Link>
                )}
                <button
                  onClick={() => { logout(); setOpen(false); }}
                  className="text-left font-serif text-sm font-bold uppercase tracking-wider text-gold hover:text-card"
                >
                  Sign Out
                </button>
              </>
            )}
            {!currentUser && (
              <Link href="/login" onClick={() => setOpen(false)}>
                <Button variant="secondary" className="w-full font-bold uppercase border-gold bg-gold text-walnut">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
