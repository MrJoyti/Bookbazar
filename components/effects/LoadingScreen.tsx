"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Signature moment #1: the site "opens" like a book cover before revealing
 * the page. Two covers rotate open around a center spine, the wordmark
 * settles, and an ink-fill bar finishes loading. Runs once per session.
 */
export default function LoadingScreen() {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const seen = sessionStorage.getItem("bb_loaded");
    if (seen) {
      setOpen(false);
      return;
    }
    const t = setTimeout(() => {
      sessionStorage.setItem("bb_loaded", "1");
      setOpen(false);
    }, 1900);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-ink"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="relative" style={{ perspective: 1200 }}>
            {/* left cover */}
            <motion.div
              className="absolute right-1/2 top-0 h-40 w-32 origin-right rounded-l-sm bg-vintage shadow-paper border border-gold/30 p-1 flex justify-end"
              initial={{ rotateY: 0 }}
              animate={{ rotateY: -115 }}
              transition={{ delay: 0.3, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="h-full w-full border border-dashed border-gold/20 rounded-l-[1px]" />
            </motion.div>
            {/* right cover */}
            <motion.div
              className="absolute left-1/2 top-0 h-40 w-32 origin-left rounded-r-sm bg-vintage shadow-paper border border-gold/30 p-1"
              initial={{ rotateY: 0 }}
              animate={{ rotateY: 115 }}
              transition={{ delay: 0.3, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="h-full w-full border border-dashed border-gold/20 rounded-r-[1px]" />
            </motion.div>
            {/* wordmark + tagline */}
            <motion.div
              className="flex w-64 flex-col items-center pt-16 text-center"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            >
              <span className="font-serif text-3xl font-semibold tracking-wide text-gold">
                BookBazar
              </span>
              <span className="mt-2 font-sans text-xs tracking-[0.18em] text-paper/85">
                WE TURN OLD BOOKS INTO NEW STORIES
              </span>
              <div className="mt-5 h-[2px] w-40 overflow-hidden rounded-full bg-paper/20">
                <div className="h-full w-0 animate-ink-fill bg-gold" style={{ animationDelay: "1.2s" }} />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
