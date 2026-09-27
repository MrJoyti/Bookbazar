"use client";

import { useEffect, useState } from "react";

/**
 * A small fountain-pen-nib cursor that replaces the system pointer on
 * fine-pointer devices. Kept deliberately quiet — it only nudges position
 * and gives a faint "ink dot" pulse on click, never spins or overshoots.
 */
export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [clicking, setClicking] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };
    const down = () => setClicking(true);
    const up = () => setClicking(false);
    const leave = () => setVisible(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    window.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("mouseleave", leave);
    };
  }, [visible]);

  return (
    <div
      className="bookmark-cursor hidden md:block"
      style={{
        transform: `translate(${pos.x - 4}px, ${pos.y - 4}px) scale(${clicking ? 0.88 : 1})`,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.2s ease, transform 0.08s ease",
      }}
      aria-hidden="true"
    >
      <svg width="22" height="30" viewBox="0 0 22 30" fill="none">
        <path
          d="M2 1h18v23l-9 5-9-5V1Z"
          fill="#FAF5ED"
          stroke="#6A4A3C"
          strokeWidth="1.5"
        />
        <path d="M2 1h18v6l-9 3-9-3V1Z" fill="#C8A96A" stroke="#6A4A3C" strokeWidth="1" />
      </svg>
    </div>
  );
}
