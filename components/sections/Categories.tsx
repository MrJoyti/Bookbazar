import Link from "next/link";

const categories = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Economics",
  "Literature",
  "Engineering",
  "Business",
  "Law",
];

export default function Categories() {
  return (
    <section id="categories" className="border-b border-gold/30 bg-beige/20 py-12 relative overflow-hidden">
      {/* Wooden panel backdrop style */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-walnut/[0.03] pointer-events-none" />
      <div className="mx-auto max-w-6xl px-5 md:px-8 relative z-10">
        <span className="inline-block border border-gold bg-card px-2.5 py-0.5 font-serif text-[10px] font-bold uppercase tracking-widest text-vintage mb-4 shadow-sm">
          BROWSE BY SUBJECT
        </span>
        <div className="mt-2 flex flex-wrap gap-5 gap-y-7">
          {categories.map((c) => (
            <Link
              key={c}
              href={`/search?category=${encodeURIComponent(c)}`}
              className="relative group border-2 border-gold/75 bg-walnut p-[3px] shadow-[3px_4px_8px_rgba(59,42,34,0.3)] hover:shadow-[5px_8px_14px_rgba(59,42,34,0.4)] transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
            >
              {/* The Card Catalog Drawer Front */}
              <div className="border border-gold/50 bg-[#FAF5ED] px-6 py-2 flex items-center justify-center min-w-[140px] rounded-[1px] relative">
                {/* Left and right rivet dots */}
                <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gold/90 border border-walnut/40 shadow-sm" />
                <span className="absolute right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gold/90 border border-walnut/40 shadow-sm" />
                
                {/* The Paper Label Insert */}
                <span className="font-serif text-[11px] font-bold uppercase tracking-wider text-ink bg-card px-2 py-0.5 border border-dashed border-vintage/35 shadow-inner">
                  {c}
                </span>
              </div>

              {/* Brass Pull Handle Loop hanging off bottom center */}
              <span className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-8 h-2.5 border-x-2 border-b-2 border-gold/70 rounded-b-[4px] group-hover:h-3 transition-all duration-300 origin-top shadow-sm" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
