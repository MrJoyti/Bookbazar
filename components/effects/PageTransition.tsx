"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

/**
 * Signature moment #2: route change triggers a realistic 3D paper page turn.
 * A paper leaf sweeps across the viewport, curling in 3D perspective to reveal
 * the incoming layout underneath.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    setAnimating(true);
    const t = setTimeout(() => setAnimating(false), 900);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <div className="relative overflow-hidden min-h-screen" style={{ perspective: 1500 }}>
      {/* The actual page content */}
      <motion.div
        key={pathname}
        initial={{ opacity: 0.1, rotateY: 8, x: 25, transformOrigin: "left center" }}
        animate={{ opacity: 1, rotateY: 0, x: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
      >
        {children}
      </motion.div>

      {/* The Curling Page Overlay */}
      <AnimatePresence>
        {animating && (
          <motion.div
            className="absolute inset-0 z-[100] pointer-events-none origin-left bg-gradient-to-r from-beige via-card to-paper"
            initial={{ rotateY: 0, skewY: 0, x: "0%" }}
            animate={{ rotateY: -115, skewY: -4, x: "-100%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            style={{
              boxShadow: "inset -25px 0 60px rgba(43,33,24,0.18), 15px 0 35px rgba(43,33,24,0.15)",
              backfaceVisibility: "hidden"
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
