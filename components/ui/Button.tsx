import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

/**
 * Primary reads like a leather spine tab; secondary like an embossed
 * gold-ruled card. Hover lifts the element slightly, as if picking it up.
 */
export default function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[2px] px-6 py-2.5 font-serif text-sm font-bold uppercase tracking-wider transition-all duration-300 relative overflow-hidden",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold",
        variant === "primary" &&
          "border border-gold/45 bg-vintage text-card shadow-stack hover:-translate-y-0.5 hover:bg-vintage/95 hover:shadow-lift active:translate-y-[1px] active:shadow-inner",
        variant === "secondary" &&
          "border border-vintage bg-card text-vintage shadow-sm hover:-translate-y-0.5 hover:bg-beige/40 active:translate-y-[1px] active:shadow-inner",
        variant === "ghost" &&
          "text-vintage underline-offset-4 hover:underline hover:text-vintage/85 active:scale-98",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
