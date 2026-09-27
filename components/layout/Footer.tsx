import Link from "next/link";
import { BookOpen } from "lucide-react";

const columns = [
  {
    title: "Marketplace",
    links: [
      { name: "Browse Books", href: "/home" },
      { name: "Sell a Book", href: "/upload" },
      { name: "Categories", href: "/home#categories" },
    ],
  },
  {
    title: "Account",
    links: [
      { name: "My Listings", href: "/my-listings" },
      { name: "Wishlist", href: "/wishlist" },
      { name: "Orders", href: "/orders" },
      { name: "Settings", href: "/settings" },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "How It Works", href: "/#how-it-works" },
      { name: "Editorial Board", href: "/admin" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t-2 border-dashed border-gold bg-beige/35 text-ink">
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-vintage" strokeWidth={2} />
              <span className="font-serif text-2xl font-bold tracking-tight text-vintage uppercase">BookBazar</span>
            </div>
            <p className="mt-3 max-w-xs font-serif text-sm text-ink/75 leading-relaxed">
              We turn old books into new stories — a trusted vintage exchange for students
              passing their semester shelf on to the next class.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="md:border-l md:border-dashed md:border-vintage/20 md:pl-6">
              <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-vintage border-b border-gold/40 pb-1">{col.title}</h4>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="font-serif text-xs font-bold uppercase tracking-wider text-ink hover:text-vintage hover:underline">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="my-8 border-t border-gold/45 border-dashed" />

        <p className="text-center font-serif text-[10px] uppercase tracking-widest text-ink/60">
          © {new Date().getFullYear()} BookBazar Gazette — Bound by students, for students.
        </p>
      </div>
    </footer>
  );
}
