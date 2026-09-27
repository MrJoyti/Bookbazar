import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F6EFE5",       // primary background
        beige: "#EFE3CF",       // secondary background / aged paper
        card: "#FAF5ED",        // columns / paper cards
        vintage: "#6A4A3C",     // Leather Brown accents
        ink: "#2B2118",         // deep print ink text
        gold: "#C8A96A",        // Gold Accent
        olive: "#77815C",       // Olive Status / drawer cards
        text: "#2B2118",        // body print text
        walnut: "#3B2A22",      // Dark Walnut wood
        mutedRed: "#8D5A4A",    // Muted Red bookmarks
        bkash: "#e2136e",       // bKash official color
        "bkash-light": "#fce4ef", // bKash tint
      },
      fontFamily: {
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        paper: "0 1px 2px rgba(43,33,24,0.08), 0 8px 20px -8px rgba(43,33,24,0.15)",
        stacked:
          "0 1px 0 #FAF5ED, 0 2px 0 #EFE3CF, 0 6px 12px -6px rgba(43,33,24,0.25)",
        lift: "0 12px 24px -10px rgba(43,33,24,0.3)",
        leather: "0 4px 10px rgba(59,42,34,0.25), inset 0 1px 2px rgba(250,245,237,0.2)",
        brass: "0 2px 5px rgba(43,33,24,0.15), 0 0 0 1px #C8A96A",
      },
      keyframes: {
        "ink-fill": {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        "page-fold": {
          "0%": { transform: "rotateY(0deg)", opacity: "1" },
          "100%": { transform: "rotateY(-90deg)", opacity: "0" },
        },
        "drift-up": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "dust-float": {
          "0%": { transform: "translateY(0) scale(1)", opacity: "0" },
          "20%": { opacity: "0.6" },
          "100%": { transform: "translateY(-40px) scale(0.4)", opacity: "0" },
        },
        "bookmark-drop": {
          "0%": { transform: "translateY(-12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "badge-pop": {
          "0%": { transform: "scale(0)" },
          "70%": { transform: "scale(1.25)" },
          "100%": { transform: "scale(1)" },
        },
        "scale-up": {
          "0%": { opacity: "0", transform: "scale(0.94) translateY(12px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "ink-press": {
          "0%": { opacity: "0", transform: "translateY(-6px) scaleY(0.92)" },
          "60%": { opacity: "1", transform: "translateY(2px) scaleY(1.02)" },
          "100%": { transform: "translateY(0) scaleY(1)" },
        },
        "stamp": {
          "0%": { opacity: "0", transform: "scale(2.5) rotate(-15deg)" },
          "60%": { opacity: "1", transform: "scale(0.92) rotate(2deg)" },
          "80%": { transform: "scale(1.04) rotate(-1deg)" },
          "100%": { transform: "scale(1) rotate(-3deg)", opacity: "1" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "stagger-in": {
          "0%": { opacity: "0", transform: "translateX(-16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "flicker": {
          "0%, 100%": { opacity: "1" },
          "92%": { opacity: "1" },
          "93%": { opacity: "0.85" },
          "94%": { opacity: "1" },
          "97%": { opacity: "0.9" },
          "98%": { opacity: "1" },
        },
      },
      animation: {
        "ink-fill": "ink-fill 1.6s ease-in-out forwards",
        "drift-up": "drift-up 4s ease-in-out infinite",
        "dust-float": "dust-float 3.2s ease-out infinite",
        "bookmark-drop": "bookmark-drop 0.5s cubic-bezier(0.22,1,0.36,1) forwards",
        "badge-pop": "badge-pop 0.4s cubic-bezier(0.22,0.68,0,1.2) both",
        "scale-up": "scale-up 0.35s cubic-bezier(0.22,0.68,0,1.2) both",
        "fade-up": "fade-up 0.5s cubic-bezier(0.22,0.68,0,1.2) both",
        "fade-in": "fade-in 0.3s ease both",
        "ink-press": "ink-press 0.4s cubic-bezier(0.22,0.68,0,1.2) both",
        "stamp": "stamp 0.6s cubic-bezier(0.22,0.68,0,1.2) both",
        "slide-right": "slide-in-right 0.4s cubic-bezier(0.22,0.68,0,1.2) both",
        "slide-left": "slide-in-left 0.4s cubic-bezier(0.22,0.68,0,1.2) both",
        "stagger-in": "stagger-in 0.45s cubic-bezier(0.22,0.68,0,1.2) both",
        "float": "float 3s ease-in-out infinite",
        "flicker": "flicker 8s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
