"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import BookCard from "@/components/books/BookCard";
import DustParticles from "@/components/effects/DustParticles";
import { Book } from "@/lib/context/AppContext";

const stackedBooks: Book[] = [
  {
    id: "h1",
    title: "Intro to Algorithms",
    author: "Cormen et al.",
    price: 450,
    condition: "Good",
    rating: 4,
    category: "Computer Science",
    sellerId: "s1",
    sellerName: "Adnan Chowdhury",
    description: "Standard algorithms book.",
    university: "BUET",
    coverColor: "linear-gradient(135deg, #111, #333)"
  },
  {
    id: "h2",
    title: "Calculus: Early Trans.",
    author: "James Stewart",
    price: 380,
    condition: "Like New",
    rating: 5,
    category: "Mathematics",
    sellerId: "s2",
    sellerName: "Maliha Rahman",
    description: "Extremely clean calculus book.",
    university: "NSU",
    coverColor: "linear-gradient(135deg, #333, #666)"
  },
  {
    id: "h3",
    title: "Database Systems",
    author: "Elmasri & Navathe",
    price: 320,
    condition: "Fair",
    rating: 4,
    category: "Computer Science",
    sellerId: "s3",
    sellerName: "Farhan Tanvir",
    description: "Database reference.",
    university: "DU",
    coverColor: "linear-gradient(135deg, #222, #555)"
  },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b-2 border-dashed border-gold bg-paper py-16 md:py-24">
      {/* Cinematic library room background */}
      <div className="absolute inset-0 z-0 bg-paper pointer-events-none">
        {/* Bookshelf horizontal wood panels */}
        <div className="absolute top-[22%] left-0 right-0 h-3.5 bg-walnut border-y border-gold/35 shadow-sm opacity-25" />
        <div className="absolute top-[55%] left-0 right-0 h-3.5 bg-walnut border-y border-gold/35 shadow-sm opacity-25" />
        <div className="absolute top-[88%] left-0 right-0 h-3.5 bg-walnut border-y border-gold/35 shadow-sm opacity-25" />
        
        {/* Diagonal morning sunlight rays */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-gold/5 to-gold/12 mix-blend-color-burn" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(200,169,106,0.22)_0%,transparent_60%)]" />
      </div>

      <DustParticles count={16} />
      
      <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-2 md:items-center md:px-8">
        <div>
          <span className="inline-block border border-gold bg-beige px-3 py-1.5 font-serif text-[10px] font-bold uppercase tracking-widest text-vintage shadow-sm rounded-[1px]">
            A Shelf for Your Semester
          </span>
          <h1 className="mt-5 font-serif text-4xl font-extrabold leading-[1.05] text-ink md:text-5xl lg:text-6xl uppercase tracking-tighter drop-shadow-sm">
            We Turn Old Books
            <br /> Into New Stories
          </h1>
          <p className="mt-5 max-w-md font-serif text-base text-ink/80 leading-relaxed">
            Buy and sell used academic literature with students inside your own
            university community — honest prices, trusted sellers, zero middleman fees.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="/home">
              <Button variant="primary" className="border border-gold/45 font-bold uppercase py-2.5 px-7">Browse Shelf</Button>
            </a>
            <a href="/upload">
              <Button variant="secondary" className="border border-vintage font-bold uppercase py-2.5 px-7">Sell a Book</Button>
            </a>
          </div>
        </div>

        <div className="relative flex h-80 items-center justify-center">
          {stackedBooks.map((b, i) => (
            <motion.div
              key={b.id}
              className="absolute animate-drift-up"
              style={{
                animationDelay: `${i * 0.45}s`,
                transform: `rotate(${(i - 1) * 9}deg) translateX(${(i - 1) * 75}px)`,
                zIndex: i,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <BookCard book={b} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
