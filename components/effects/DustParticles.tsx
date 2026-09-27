"use client";

/**
 * A handful of slow-drifting gold flecks — the only "particle" effect in the
 * whole app, used once behind the hero so it reads as atmosphere, not noise.
 */
export default function DustParticles({ count = 10 }: { count?: number }) {
  const seeds = Array.from({ length: count }, (_, i) => i);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {seeds.map((i) => {
        const left = (i * 37) % 100;
        const delay = (i % 5) * 0.8;
        const size = 2.5 + (i % 3) * 1.2;
        return (
          <span
            key={i}
            className="absolute rounded-full bg-gold/40 animate-dust-float"
            style={{
              left: `${left}%`,
              bottom: "10%",
              width: size,
              height: size,
              animationDelay: `${delay}s`,
              boxShadow: "0 0 6px #C8A96A, 0 0 2px #C8A96A",
              opacity: 0.65,
            }}
          />
        );
      })}
    </div>
  );
}
