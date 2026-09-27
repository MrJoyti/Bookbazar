import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";

// Display serif — carries the "old book" personality in headings, eyebrows, prices.
export const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

// Modern, highly readable body face — keeps long text comfortable, not precious.
export const body = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});
